import { useState } from 'react';

function Component5() {
    const [isToggled, setIsToggled] = useState(false);

    const handleToggle = () => {
        setIsToggled(!isToggled);
    };

    return (
        <section>
            <h2>Toggle Component</h2>
            <p>Status: {isToggled ? 'Enabled' : 'Disabled'}</p>
            <button onClick={handleToggle}>{isToggled ? 'Disable' : 'Enable'}</button>;
        </section>
    );
}

export default Component5;