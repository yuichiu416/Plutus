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
import ChampionUpload from "./components/Champion/ChampionUpload";
import ChampionDetail from "./components/Champion/ChampionDetail";

import EditItem from "./components/Items/EditItem";

const App = () => {
  return (
    <div>
      <Nav />
      <h1>Online Store</h1>
      <Switch>
        <AuthRoute exact path="/login" component={Login} routeType="auth" />
        <AuthRoute exact path="/register" component={Register} routeType="auth" />
        <Route exact path="/create_item" component={CreateItem} />
        <Route path="/create_item" component={CreateItem} />
        <Route exact path="/:id/edit" component={EditItem} />
        <Route path="/:id" component={ItemShow} />
        <Route exact path="/" component={ItemIndex} />
        <Route exact path="/messages/new" component={CreateMessage}/>
        {/* <Route exact path="/champions/new" component={ChampionUpload}/>
        <Route exact path="/champions" component={ChampionDetail}/> */}
      </Switch>
    </div>
  );
};

export default App;