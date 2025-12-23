'use client';

import React, { useState, useEffect, useRef } from 'react';

const StatsCounter = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({
    passages: 0,
    words: 0,
    connections: 0,
    years: 0,
  });

  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    return () => {
      if (componentRef.current) {
        observer.unobserve(componentRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      const animateStats = () => {
        const targetStats = {
          passages: 1700000,
          words: 892000,
          connections: 500000,
          years: 2300,
        };

        const duration = 2000; // Animation duration in milliseconds
        const startTime = performance.now();

        const updateStats = (currentTime: number) => {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);

          setStats({
            passages: Math.floor(progress * targetStats.passages),
            words: Math.floor(progress * targetStats.words),
            connections: Math.floor(progress * targetStats.connections),
            years: Math.floor(progress * targetStats.years),
          });

          if (progress < 1) {
            requestAnimationFrame(updateStats);
          }
        };

        requestAnimationFrame(updateStats);
      };

      animateStats();
    }
  }, [isVisible]);


  return (
    <div ref={componentRef} className="bg-[#0D0D0F] text-[#F5F4F2] py-12">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-8">Logos in Numbers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="text-4xl font-bold text-[#C9A227]">{stats.passages.toLocaleString()}</div>
            <p className="text-lg">Passages</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#C9A227]">{stats.words.toLocaleString()}</div>
            <p className="text-lg">Words</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#C9A227]">{stats.connections.toLocaleString()}</div>
            <p className="text-lg">Connections</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#C9A227]">{stats.years.toLocaleString()}</div>
            <p className="text-lg">Years of History</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCounter;