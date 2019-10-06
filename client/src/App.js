//client/src/App.js
import React from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import { Route, Switch } from 'react-router-dom';
import AuthRoute from "./util/route_util";
import Nav from "./components/Nav";
import Splash from './components/Splash';
import CreateItem from './components/Items/EditItem';
import ItemIndex from "./components/Items/ItemIndex";
import ItemShow from "./components/Items/Itemshow";
import CreateMessage from "./components/Messages/CreateMessage";
import EditItem from "./components/Items/EditItem";

const App = () => {
  return (
    <div>
      {/* <Splash /> */}
      <Nav />
      <h1>Online Store</h1>
      <Switch>
        <AuthRoute exact path="/login" component={Login} routeType="auth" />
        <AuthRoute exact path="/register" component={Register} routeType="auth" />
        <Route path="/create_item" component={CreateItem} />
        <Route exact path="/:id/edit" component={EditItem} />
        <Route path="/:id" component={ItemShow} />
        <Route exact path="/" component={ItemIndex} />
        <Route exact path="/messages/new" component={CreateMessage}/>
      </Switch>
    </div>
  );
};

export default App;