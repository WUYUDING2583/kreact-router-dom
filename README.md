**English** | [简体中文]()

kreact-router-dom is a router component imitates react-router-dom 5.2, it implements components and hooks displayed below:

components:

* BrowserRouter
* Router
* Switch
* Route
* Link
* Redirct
* withRouter
* Prompt

hooks:

* useLocation
* useHistory
* useParams
* useRouteMatch

## Usage

```javascript
//App.js
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  Prompt,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
  withRouter,
} from "./kreact-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import _404Page from "./pages/_404Page";
function App() {
  return (
    <div className="App">
      <Router>
        <Link to="/">Home</Link>
        <Link to="/user">User</Link>
        <Link to="/login">Login</Link>
        <Link to="/product/123">Product</Link>
        <Switch>
          <Route
            path="/"
            exact
            // children={children}
            // component={HomePage}
            render={()=><HomePage/>}
          />
          <Route path="/user" component={UserPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/product/:id" component={Product} />
          <Route component={_404Page} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;

function children() {
  return <div>children</div>
}

function render() {
  return <div>render</div>
}

function Product(
  // { match }
) {
  const match = useRouteMatch();
  const history = useHistory();
  const params = useParams();
  const location = useLocation();
  console.log("product", match, history, location, params);
  // console.log("Product match", match);
  // return <Redirect to={{pathname:"/login",search:"asfd",state:{aaa:"asdfasssssss"}}}/>
  return (
    <div>
      <h5>Product-{params.id}</h5>
      <Link to="/product/123/search">Search</Link>
      <Route path="/product/:id/search" component={Search} />
      <Prompt message={"Are you sure to leave this page without saving your input?"} when={true} />
    </div>
  )
}

function Search(params) {
  return <h4>SearchPage</h4>
}
```

```javascript
import React, { Component } from 'react'
import { withRouter } from '../kreact-router-dom';

class HomePage extends Component {
    render() {
        console.log("HomePage",this.props);
        return (
            <div>
                HomePage
            </div>
        )
    }
}

export default withRouter(HomePage);
```

## Implementation

### BrowserRouter

```javascript
import React, { Component } from 'react';
import {createBrowserHistory} from "history";
import Router from './Router';

export default class BrowserRouter extends Component {
    constructor(props){
        super(props);
        this.history=createBrowserHistory();
    }
    render() {
        return <Router {...this.props} history={this.history}/>
    }
}
```

### Router

```javascript
import React, { Component } from 'react';
import RouterContext from "./RouterContext";

export default class Router extends Component {
    static computeRouteMatch(pathname) {
        return { path: "/", url: "/", params: {}, isExact: pathname === "/" };
    }
    constructor(props) {
        super(props);
        this.state = {
            location: props.history.location
        }
    }

    componentDidMount(){
        this.unlisten=this.props.history.listen(location=>{
            this.setState({location});
        });
    }

    componentWillUnmount(){
        this.unlisten();
    }
    render() {
        return (
            <RouterContext.Provider value={{
                history: this.props.history,
                location: this.state.location,
                match: Router.computeRouteMatch(this.state.location.pathname)
            }}>
                {this.props.children}
            </RouterContext.Provider>
        )
    }
}
```

### Switch

```javascript
import React, { Component } from 'react';
import RouterContext from './RouterContext';
import matchPath from "./matchPath";

export default class Switch extends Component {
    render() {
        return (
            <RouterContext.Consumer>
                {context => {
                    let match;
                    let element;
                    React.Children.forEach(this.props.children, child => {
                        if (match == null) {
                            element = child;
                            match = child.props.path
                                ? matchPath(context.location.pathname, child.props)
                                : context.match;
                        }
                    });
                    return React.cloneElement(element, { computedMatch: match });
                }}
            </RouterContext.Consumer>
        )
    }
}
```

### Route

```javascript
import React, { Component } from 'react'
import { matchPath } from 'react-router-dom';
import RouterContext from './RouterContext'

export default class Route extends Component {
    render() {
        return (
            <RouterContext.Consumer>
                {context => {
                    const { location } = context;
                    const { children, component, render, path, computedMatch } = this.props;
                    const match = computedMatch
                        ? computedMatch
                        : path
                            ? matchPath(location.pathname, this.props)
                            : context.match;
                    const props = {
                        ...context,
                        location,
                        match
                    };
                    return (
                        <RouterContext.Provider value={props}>
                            {match
                                ? children
                                    ? typeof children === "function"
                                        ? children(props)
                                        : children
                                    : component
                                        ? React.createElement(component, props)
                                        : render
                                            ? render(props)
                                            : null
                                : typeof children === "function"
                                    ? children(props)
                                    : null}

                        </RouterContext.Provider>
                    );
                }}
            </RouterContext.Consumer>
        )
    }
}
```

### Link

```javascript
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
```

### Redirect

```javascript
import React, { Component } from 'react'
import RouterContext from './RouterContext';
import LifeCycle from "./LifeCycle";

export default class Redirect extends Component {
    render() {
        return (
            <RouterContext.Consumer>
                {context => {
                    const { history } = context;
                    const { to, push } = this.props;
                    return <LifeCycle
                        onMount={() => {
                            push ? history.push(to) : history.replace(to);
                        }}
                    />
                }}
            </RouterContext.Consumer>
        )
    }
}
```

### Prompt

```javascript
import React, { Component } from 'react'
import LifeCycle from './LifeCycle';
import RouterContext from './RouterContext'

export default class Prompt extends Component {
    render() {
        return (
            <RouterContext.Consumer>
                {context=>{
                    const {message,when}=this.props;
                    if(!when){
                        return null;
                    }
                    return <LifeCycle
                        onMount={self=>{
                            self.release=context.history.block(message);
                        }}
                        onUnmount={self=>{
                            self.release();
                        }}
                    />
                }}
            </RouterContext.Consumer>
        )
    }
}
```

### withRouter

```javascript
import { useContext } from "react"
import RouterContext from "./RouterContext"

const withRouter=WrappedComponent=>props=>{
    const context=useContext(RouterContext);
    return <WrappedComponent {...props} {...context}/>
}

export default withRouter;
```

### LifyCycle

```javascript
import React, { Component } from 'react'

export default class LifeCycle extends Component {
    componentDidMount(){
        if(this.props.onMount){
            this.props.onMount.call(this,this);
        }
    }

    componentWillUnmount(){
        if(this.props.onUnmount){
            this.props.onUnmount.call(this,this);
        }
    }

    componentDidUpdate(preProps){
        if(this.props.onUpdate){
            this.props.onUpdate.call(this,this,preProps);
        }
    }
    render() {
        return null;
    }
}
```

### hooks

```javascript
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
```

