import { useState } from 'react';

export default function Component1() {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        setCount(count + 1);
    };

    return (
        <section>
            <h2>This is Component 1.</h2>
            <p>Count: {count}</p>
            <button onClick={handleClick}>Click Me</button>;
        </section>
    );
}