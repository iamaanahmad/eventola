'use client';

import { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function Countdown({ targetDate }: CountdownProps) {
  const calculateTimeLeft = (): TimeLeft | null => {
    const difference = +targetDate - +new Date();
    if (difference <= 0) {
      return null;
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    // Set initial value on client mount to avoid hydration mismatch
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

  if (!timeLeft) {
    return <div className="text-xl md:text-2xl font-bold text-primary">The event has started!</div>;
  }

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-4 text-center">
      <TimeUnit value={timeLeft.days} label="Days" />
      <div className="text-xl sm:text-2xl md:text-4xl font-bold text-primary pb-5 sm:pb-6 md:pb-8">:</div>
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <div className="text-xl sm:text-2xl md:text-4xl font-bold text-primary pb-5 sm:pb-6 md:pb-8">:</div>
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <div className="text-xl sm:text-2xl md:text-4xl font-bold text-primary pb-5 sm:pb-6 md:pb-8">:</div>
      <TimeUnit value={timeLeft.seconds} label="Seconds" />
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
      <span className="text-xl sm:text-2xl md:text-4xl font-bold tracking-tighter">{value.toString().padStart(2, '0')}</span>
      <span className="text-[10px] sm:text-xs md:text-sm font-medium uppercase tracking-widest text-white/70">{label}</span>
    </div>
  );
}