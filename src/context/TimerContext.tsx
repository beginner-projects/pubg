'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const TimeContext = createContext<number>(0);

export const useTime = () => useContext(TimeContext);

interface TimeProviderProps {
    children: ReactNode;
}

export const TimeProvider: React.FC<TimeProviderProps> = ({ children }) => {
    const [time, setTime] = useState<number>(0);

    useEffect(() => {
        const getTimeUntilNextHour = () => {
            const now = new Date();
            const currentISTTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
            const nextHour = new Date(currentISTTime);
            nextHour.setHours(currentISTTime.getHours() + 1, 0, 0, 0);
            const timeDifference = Math.floor((nextHour.getTime() - currentISTTime.getTime()) / 1000);
            return timeDifference;
        };

        setTime(getTimeUntilNextHour());

        const timer = setInterval(() => {
            setTime(prevTime => (prevTime > 0 ? prevTime - 1 : getTimeUntilNextHour()));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <TimeContext.Provider value={time}>
            {children}
        </TimeContext.Provider>
    );
};
