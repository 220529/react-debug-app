import { useState, useEffect } from 'react';

const Count = () => {
  debugger
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("useEffect.count", count);
  }, [count]);

  useEffect(() => {
    console.log("useEffect...", count);
  }, []);

  const handleIncrement = () => {
    debugger
    setCount(count + 1);
  };

  return (
    <div className='container'>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
};

export default Count;
