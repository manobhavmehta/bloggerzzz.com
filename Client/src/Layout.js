import Headers from "./Headers";
import {Outlet} from "react-router-dom";

export default function Layout(){
    return(
        <main>
            <Headers />
            <Outlet />
        </main>
    );
}