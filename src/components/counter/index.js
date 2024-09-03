import { useState, useEffect } from 'react';

const Count = () => {
  const [count, setCount] = useState(0);

  // useEffect(() => {
  //   console.log("useEffect.count", count);
  // }, [count]);

  // useEffect(() => {
  //   console.log("useEffect...", count);
  // }, []);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  return (
    <div id='counter'>
      <p>count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
};

export default Count;
