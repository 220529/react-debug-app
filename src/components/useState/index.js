import React, { useState, useRef, useEffect } from 'react';

const App = () => {
  const [value, setValue] = useState(100);
  function clickHandler() {
    setTimeout(() => {
      setValue(value + 1);
      setValue(value + 1);
      console.log(1, value);
      setValue(value + 1);
      setValue(value + 1);
      console.log(2, value);
    });
  }
  return (
    <div>
      <span>{value}</span>
      <button onClick={clickHandler}>increase</button>
    </div>
  );
};

export default App;
