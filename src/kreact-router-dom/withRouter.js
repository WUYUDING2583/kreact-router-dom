import { useContext } from "react"
import RouterContext from "./RouterContext"

const withRouter=WrappedComponent=>props=>{
    const context=useContext(RouterContext);
    return <WrappedComponent {...props} {...context}/>
}

export default withRouter;