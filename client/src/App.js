//client/src/App.js
import React from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import { Route, Switch } from 'react-router-dom';
import AuthRoute from "./util/route_util";
import Nav from "./components/Nav";
import CreateItem from './components/Items/Createitem';

const App = () => {
  return (
    <div>
      <Nav />
      <h1>Online Store</h1>
      <Switch>
        <AuthRoute exact path="/login" component={Login} routeType="auth" />
        <AuthRoute exact path="/register" component={Register} routeType="auth" />
        <Route path="/create_item" component={CreateItem} />
      </Switch>
    </div>
  );
};

export default App;