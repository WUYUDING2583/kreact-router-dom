import { useContext } from "react";
import RouterContext from "./RouterContext";

export function useLocation(){
    return useContext(RouterContext).location;
}

export function useRouteMatch(){
    return useContext(RouterContext).match;
}
export function useParams(){
    return useContext(RouterContext).match.params;
}
export function useHistory(){
    return useContext(RouterContext).history;
}