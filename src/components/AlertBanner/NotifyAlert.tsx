'use client'

// NotifyAlert.tsx
import React from 'react';
import './index.css';
import { useTime } from '@/context/TimerContext';

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const NotifyAlert: React.FC = () => {
    const time = useTime();

    return (
        <div className="top-banner">
            <h2 className='p-2'>Match will start in <strong>{formatTime(time)}</strong></h2>
        </div>
    );
};

export default NotifyAlert;

