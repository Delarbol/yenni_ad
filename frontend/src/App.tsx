import { BrowserRouter as Router, Switch } from "react-router-dom";
import routeritems from "./router/router";
import RouterConfig from "./router/router-config";
import { GlobalStyle } from "./style";

const App = () => {
  return (
    <Router>
      <GlobalStyle />
        <Switch>
          {routeritems.map((route, i) => (
            <RouterConfig key={i} {...route} />
          ))}
        </Switch>
    </Router>
  );
}

export default App;
