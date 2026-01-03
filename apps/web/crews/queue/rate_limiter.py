"""
RATE LIMITER
Per-provider limits to avoid API throttling
"""

import asyncio
from typing import Dict
from dataclasses import dataclass
import time


@dataclass
class ProviderLimits:
    rpm: int  # Requests per minute
    tpm: int  # Tokens per minute
    concurrent: int  # Max concurrent requests


# Provider-specific limits
LIMITS = {
    "gemini": ProviderLimits(rpm=2000, tpm=4_000_000, concurrent=100),
    "openai": ProviderLimits(rpm=500, tpm=200_000, concurrent=50),
    "anthropic": ProviderLimits(rpm=50, tpm=80_000, concurrent=10),
    "local": ProviderLimits(rpm=10000, tpm=100_000_000, concurrent=500),  # No real limits
}


class RateLimiter:
    """
    Token bucket rate limiter with per-provider limits.
    """

    def __init__(self, provider: str):
        self.provider = provider
        self.limits = LIMITS.get(provider, ProviderLimits(rpm=100, tpm=100000, concurrent=10))
        self.semaphore = asyncio.Semaphore(self.limits.concurrent)
        self.request_times: list = []
        self.token_counts: list = []
        self.lock = asyncio.Lock()

    async def acquire(self, estimated_tokens: int = 100):
        """Wait until we can make a request"""
        await self.semaphore.acquire()

        async with self.lock:
            now = time.time()
            minute_ago = now - 60

            # Clean old entries
            self.request_times = [t for t in self.request_times if t > minute_ago]
            self.token_counts = [
                (t, c) for t, c in self.token_counts if t > minute_ago
            ]

            # Check RPM
            while len(self.request_times) >= self.limits.rpm:
                wait_time = self.request_times[0] - minute_ago
                await asyncio.sleep(max(wait_time + 0.1, 0.1))
                self.request_times = [t for t in self.request_times if t > time.time() - 60]

            # Check TPM
            current_tokens = sum(c for _, c in self.token_counts)
            while current_tokens + estimated_tokens > self.limits.tpm:
                await asyncio.sleep(1)
                self.token_counts = [
                    (t, c) for t, c in self.token_counts if t > time.time() - 60
                ]
                current_tokens = sum(c for _, c in self.token_counts)

            # Record this request
            self.request_times.append(now)
            self.token_counts.append((now, estimated_tokens))

    def release(self, actual_tokens: int = None):
        """Release semaphore after request completes"""
        self.semaphore.release()

        # Update token count if actual differs from estimate
        if actual_tokens is not None and self.token_counts:
            # Update the last entry with actual token count
            async def update():
                async with self.lock:
                    if self.token_counts:
                        last_time, _ = self.token_counts[-1]
                        self.token_counts[-1] = (last_time, actual_tokens)
            # Schedule the update (non-blocking)
            asyncio.create_task(update())

    async def __aenter__(self):
        await self.acquire()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        self.release()

    def get_stats(self) -> Dict:
        """Get current rate limiter stats"""
        now = time.time()
        minute_ago = now - 60

        recent_requests = len([t for t in self.request_times if t > minute_ago])
        recent_tokens = sum(c for t, c in self.token_counts if t > minute_ago)

        return {
            "provider": self.provider,
            "requests_last_minute": recent_requests,
            "tokens_last_minute": recent_tokens,
            "rpm_limit": self.limits.rpm,
            "tpm_limit": self.limits.tpm,
            "rpm_usage": recent_requests / self.limits.rpm,
            "tpm_usage": recent_tokens / self.limits.tpm,
        }
