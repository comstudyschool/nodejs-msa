import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Counter from "./components/counter/Counter";
import DraggableComponent from "./components/dnd/DraggableComponent";
import Home from "./components/Home";
import Products from "./components/products/Products";
import TodoList from "./components/todolist/TodoList";
import Layout from "./inc/Layout";

const App = () => {
    return (<>
        <h3>리액트 학습자료 개발</h3>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout /> }>
                    <Route index element={<Home /> } />
                    <Route path="products" element={<Products /> } />
                    <Route path="counter" element={<Counter /> } />
                    <Route path="todo" element={<TodoList /> } />
                    <Route path="dnd" element={
                        <DndProvider backend={HTML5Backend}>
                            <DraggableComponent />
                        </DndProvider>} />
                </Route>
            </Routes>
        </BrowserRouter>
    </>);
}

export default App;