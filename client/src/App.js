//client/src/App.js
import React from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import { Route, Switch } from 'react-router-dom';
import AuthRoute from "./util/route_util";
import Nav from "./components/Nav";
// import Splash from './components/Splash';
import ItemIndex from "./components/Items/ItemIndex";
import ItemShow from "./components/Items/Itemshow";
import EditItem from "./components/Items/EditItem";
import CreateMessage from "./components/Messages/CreateMessage";
import CreateItem from './components/Items/Createitem';
import MessagesIndex from "./components/Messages/MessagesIndex";
import MessageDetail from "./components/Messages/MessageDetail";
import UserProfile from './components/Users/UserProfile';

const App = () => {
  return (
    <div>
      <Nav />
      {/* <h1>PLUTUS</h1> */}
      <Switch>
        <AuthRoute exact path="/login" component={Login} routeType="auth" />
        <AuthRoute exact path="/register" component={Register} routeType="auth" />
        <Route exact path="/items/new" component={CreateItem} />
        <Route exact path="/items/:id/edit" component={EditItem} />
        <Route exact path="/items/:id" component={ItemShow} />
        <Route exact path="/" component={ItemIndex} />
        <Route exact path="/messages/new" component={CreateMessage} />
        <Route exact path="/messages/:messageId" component={MessageDetail}/>
        <Route exact path="/messages" component={MessagesIndex}/>
        <Route exact path="/users/:userId" component={UserProfile}/>
      </Switch>
    </div>
  );
};

export default App;