import RouterContext from "./RouterContext";
import { useContext } from "react";

export default function Link({ to, children, ...restProps }) {
    const context = useContext(RouterContext);
    const handleClick = e => {
        e.preventDefault();
        to && context.history.push(to);
    }
    return <a href={to} {...restProps} style={{ margin: "0 5px" }} onClick={handleClick}>{children}</a>
}