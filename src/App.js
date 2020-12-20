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