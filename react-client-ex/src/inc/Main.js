import { Link } from "react-router-dom";

const Main = (props) => {
    return (<>
        <nav>
            <Link to="/">홈</Link> |
            <Link to="/products">상품</Link> |
            <Link to="/counter">카운터</Link> |
            <Link to="/todo">TodoList</Link> |
            <Link to="/dnd">드래그앤드랍</Link>
        </nav>
    </>);
}

export default Main;