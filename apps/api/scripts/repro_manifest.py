#!/usr/bin/env python3
"""
================================================================================
REPRODUCIBILITY MANIFEST GENERATOR
================================================================================

Captures complete execution environment for reproducible runs:
- Git commit hash and status
- Python version and pip freeze
- Database connection (host only, no credentials)
- Dataset content hashes
- All hyperparameters and seeds
- Hostname and timestamp

This ensures every number is rerunnable on a clean machine.
================================================================================
"""

import os
import sys
import json
import hashlib
import subprocess
import platform
import socket
from datetime import datetime
from typing import Dict, Any, Optional
from pathlib import Path
import asyncio
import asyncpg

DATABASE_URL = os.environ.get('DATABASE_URL', '')


def get_git_info() -> Dict[str, Any]:
    """Capture git repository state."""
    try:
        commit = subprocess.check_output(
            ['git', 'rev-parse', 'HEAD'],
            stderr=subprocess.DEVNULL
        ).decode().strip()

        branch = subprocess.check_output(
            ['git', 'rev-parse', '--abbrev-ref', 'HEAD'],
            stderr=subprocess.DEVNULL
        ).decode().strip()

        # Check for uncommitted changes
        status = subprocess.check_output(
            ['git', 'status', '--porcelain'],
            stderr=subprocess.DEVNULL
        ).decode().strip()

        dirty = len(status) > 0

        return {
            'commit': commit,
            'branch': branch,
            'dirty': dirty,
            'uncommitted_files': status.split('\n') if dirty else []
        }
    except Exception as e:
        return {'error': str(e)}


def get_python_info() -> Dict[str, Any]:
    """Capture Python environment."""
    try:
        pip_freeze = subprocess.check_output(
            [sys.executable, '-m', 'pip', 'freeze'],
            stderr=subprocess.DEVNULL
        ).decode().strip()

        packages = {}
        for line in pip_freeze.split('\n'):
            if '==' in line:
                name, version = line.split('==', 1)
                packages[name] = version

        return {
            'version': platform.python_version(),
            'executable': sys.executable,
            'platform': platform.platform(),
            'packages': packages
        }
    except Exception as e:
        return {'error': str(e)}


def get_db_info() -> Dict[str, Any]:
    """Capture database connection info (host only, no credentials)."""
    if not DATABASE_URL:
        return {'error': 'DATABASE_URL not set'}

    try:
        # Parse URL to extract host only
        from urllib.parse import urlparse
        parsed = urlparse(DATABASE_URL)
        return {
            'host': parsed.hostname,
            'port': parsed.port,
            'database': parsed.path.lstrip('/'),
            'scheme': parsed.scheme
        }
    except Exception as e:
        return {'error': str(e)}


def hash_file(filepath: str) -> str:
    """Compute SHA256 hash of a file."""
    sha256 = hashlib.sha256()
    with open(filepath, 'rb') as f:
        for chunk in iter(lambda: f.read(8192), b''):
            sha256.update(chunk)
    return sha256.hexdigest()


def hash_string(s: str) -> str:
    """Compute SHA256 hash of a string."""
    return hashlib.sha256(s.encode()).hexdigest()


async def get_dataset_hashes(pool: asyncpg.Pool) -> Dict[str, str]:
    """Compute content hashes for canonical database tables."""
    hashes = {}

    async with pool.acquire() as conn:
        # Hash synoptic_alignments
        rows = await conn.fetch("""
            SELECT * FROM synoptic_alignments
            ORDER BY id
        """)
        content = json.dumps([dict(r) for r in rows], default=str, sort_keys=True)
        hashes['synoptic_alignments'] = hash_string(content)
        hashes['synoptic_alignments_count'] = len(rows)

        # Hash source_texts (sample for efficiency)
        rows = await conn.fetch("""
            SELECT work, section, LEFT(content, 500) as content_sample
            FROM source_texts
            ORDER BY work, section
        """)
        content = json.dumps([dict(r) for r in rows], default=str, sort_keys=True)
        hashes['source_texts'] = hash_string(content)
        hashes['source_texts_count'] = len(rows)

        # Hash thomas_logia
        try:
            rows = await conn.fetch("""
                SELECT * FROM thomas_logia ORDER BY logion_num
            """)
            content = json.dumps([dict(r) for r in rows], default=str, sort_keys=True)
            hashes['thomas_logia'] = hash_string(content)
            hashes['thomas_logia_count'] = len(rows)
        except:
            hashes['thomas_logia'] = 'table_not_found'

        # Hash style_residuals count
        try:
            count = await conn.fetchval("SELECT COUNT(*) FROM style_residuals")
            hashes['style_residuals_count'] = count
        except:
            hashes['style_residuals_count'] = 0

    return hashes


class ReproManifest:
    """Reproducibility manifest for a computational run."""

    def __init__(self, run_name: str, config: Dict[str, Any] = None):
        self.run_name = run_name
        self.config = config or {}
        self.manifest = {
            'run_name': run_name,
            'timestamp': datetime.now().isoformat(),
            'config': config
        }

    def capture_environment(self):
        """Capture all environment information."""
        self.manifest['git'] = get_git_info()
        self.manifest['python'] = get_python_info()
        self.manifest['database'] = get_db_info()
        self.manifest['host'] = {
            'hostname': socket.gethostname(),
            'platform': platform.platform(),
            'processor': platform.processor()
        }

        # Check for dirty git state
        if self.manifest['git'].get('dirty', False):
            print("WARNING: Git repository has uncommitted changes!")
            print("  Uncommitted files:", self.manifest['git']['uncommitted_files'][:5])

    async def capture_dataset_hashes(self, pool: asyncpg.Pool):
        """Capture dataset content hashes."""
        self.manifest['dataset_hashes'] = await get_dataset_hashes(pool)

    def set_seeds(self, seeds: Dict[str, int]):
        """Record random seeds used."""
        self.manifest['seeds'] = seeds

    def set_hyperparams(self, hyperparams: Dict[str, Any]):
        """Record hyperparameters."""
        self.manifest['hyperparams'] = hyperparams

    def add_result(self, key: str, value: Any):
        """Add a result to the manifest."""
        if 'results' not in self.manifest:
            self.manifest['results'] = {}
        self.manifest['results'][key] = value

    def add_gate_result(self, gate_num: int, gate_name: str, passed: bool, metrics: Dict):
        """Add a gate result."""
        if 'gates' not in self.manifest:
            self.manifest['gates'] = {}
        self.manifest['gates'][f'gate_{gate_num}'] = {
            'name': gate_name,
            'passed': passed,
            'metrics': metrics
        }

    def compute_manifest_hash(self) -> str:
        """Compute hash of the manifest for integrity verification."""
        content = json.dumps(self.manifest, default=str, sort_keys=True)
        return hash_string(content)

    def save(self, output_dir: str = '/Users/royvaid/Downloads/logos/papers'):
        """Save manifest to files."""
        Path(output_dir).mkdir(parents=True, exist_ok=True)

        # Add manifest hash
        self.manifest['manifest_hash'] = self.compute_manifest_hash()

        # Save JSON
        json_path = os.path.join(output_dir, f'{self.run_name}_MANIFEST.json')
        with open(json_path, 'w') as f:
            json.dump(self.manifest, f, indent=2, default=str)

        # Save human-readable markdown
        md_path = os.path.join(output_dir, f'{self.run_name}_MANIFEST.md')
        with open(md_path, 'w') as f:
            f.write(f"# Reproducibility Manifest: {self.run_name}\n\n")
            f.write(f"**Generated:** {self.manifest['timestamp']}\n\n")

            f.write("## Git State\n")
            f.write(f"- Commit: `{self.manifest['git'].get('commit', 'unknown')}`\n")
            f.write(f"- Branch: `{self.manifest['git'].get('branch', 'unknown')}`\n")
            f.write(f"- Dirty: {self.manifest['git'].get('dirty', 'unknown')}\n\n")

            f.write("## Python Environment\n")
            f.write(f"- Version: {self.manifest['python'].get('version', 'unknown')}\n")
            f.write(f"- Platform: {self.manifest['python'].get('platform', 'unknown')}\n\n")

            f.write("## Database\n")
            db = self.manifest.get('database', {})
            f.write(f"- Host: {db.get('host', 'unknown')}\n")
            f.write(f"- Database: {db.get('database', 'unknown')}\n\n")

            f.write("## Dataset Hashes\n")
            for key, value in self.manifest.get('dataset_hashes', {}).items():
                f.write(f"- {key}: `{value}`\n")
            f.write("\n")

            if 'seeds' in self.manifest:
                f.write("## Random Seeds\n")
                for key, value in self.manifest['seeds'].items():
                    f.write(f"- {key}: {value}\n")
                f.write("\n")

            if 'hyperparams' in self.manifest:
                f.write("## Hyperparameters\n")
                for key, value in self.manifest['hyperparams'].items():
                    f.write(f"- {key}: {value}\n")
                f.write("\n")

            if 'gates' in self.manifest:
                f.write("## Gate Results\n")
                for gate_id, gate_data in self.manifest['gates'].items():
                    status = "PASS" if gate_data['passed'] else "FAIL"
                    f.write(f"- {gate_data['name']}: [{status}]\n")
                f.write("\n")

            f.write(f"## Manifest Hash\n")
            f.write(f"`{self.manifest['manifest_hash']}`\n")

        print(f"Manifest saved to:")
        print(f"  {json_path}")
        print(f"  {md_path}")

        return json_path, md_path


async def create_manifest(run_name: str, config: Dict = None) -> ReproManifest:
    """Create a new reproducibility manifest with environment captured."""
    manifest = ReproManifest(run_name, config)
    manifest.capture_environment()

    if DATABASE_URL:
        pool = await asyncpg.create_pool(DATABASE_URL)
        try:
            await manifest.capture_dataset_hashes(pool)
        finally:
            await pool.close()

    return manifest


async def main():
    """Demo: create a manifest."""
    manifest = await create_manifest(
        run_name='DEMO_RUN',
        config={'description': 'Test manifest generation'}
    )

    manifest.set_seeds({
        'numpy': 42,
        'sklearn': 42,
        'train_test_split': 42
    })

    manifest.set_hyperparams({
        'penalty': 10,
        'n_features': 50,
        'cluster_k': 40,
        'n_estimators': 100
    })

    manifest.save()

    print("\nManifest created successfully!")


if __name__ == "__main__":
    asyncio.run(main())
