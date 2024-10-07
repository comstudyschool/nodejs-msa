// src/components/counter/Counter.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { decrement, increment } from '../../redux/store';

function App() {
  const count = useSelector(state => state.counter.count);
  const dispatch = useDispatch();

  return (
    <div className="App">
      <h1>Counter: {count}</h1>
      <button onClick={() => dispatch(increment())}>증가</button>
      <button onClick={() => dispatch(decrement())}>감소</button>
    </div>
  );
}

export default App;
