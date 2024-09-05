import { useState, useEffect } from 'react';

const Count = () => {
  const [count, setCount] = useState(0);
  const handleIncrement = () => {
    setCount(count + 1);
  };

  useEffect(() => {
    console.log("effect...start", count);
    return () => {
      console.log("effect...end", count);
    };
  }, [count]);

  return (
    <button onClick={handleIncrement}>{count}</button>
  );
};

export default Count;
