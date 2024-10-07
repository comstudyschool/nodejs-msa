import { Outlet } from "react-router-dom";
import Main from "./Main";

const Layout = (props) => {
    return (<>
        <header>
            <h1>Comstudy School</h1>
            <Main />
        </header>
        <main>
            <Outlet />
        </main>
        <footer>
            <address>서울시 종로구 견지동 KOSTA</address>
        </footer>
    </>);
}

export default Layout;