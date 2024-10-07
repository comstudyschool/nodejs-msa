// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import counterReducer, { decrement, increment } from './store_counter';
import positionReducer, { setPosition } from './store_dnd';
import todosReducer, { addTodo, removeTodo, toggleTodo } from './store_todo';

export { addTodo, decrement, increment, removeTodo, setPosition, toggleTodo };

const rootReducer = {
  counter: counterReducer,
  todos: todosReducer,
  position: positionReducer,
};

const store = configureStore({
  reducer: rootReducer
});

export default store;
