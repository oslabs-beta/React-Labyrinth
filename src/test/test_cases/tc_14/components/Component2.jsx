'use client'
import { useState, useEffect } from 'react';

export default function Component2() {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(prevSeconds => prevSeconds + 1);
        }, 1000);

        return () => clearInterval(interval);
    });

    return (
        <section>
            <h2>Timer Component</h2>
            <p>Seconds: {seconds}</p>
        </section>
    );
}