
//client/src/App.js
import React from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import { Route, Switch } from 'react-router-dom';
import AuthRoute from "./util/route_util";
import Nav from "./components/Nav";
import Splash from './components/Splash';
import ItemIndex from "./components/Items/ItemIndex";
import ItemShow from "./components/Items/Itemshow";
import EditItem from "./components/Items/EditItem";
import CreateMessage from "./components/Messages/CreateMessage";
import CreateItem from './components/Items/Createitem';
import MessagesIndex from "./components/Messages/MessagesIndex";
import MessageDetail from "./components/Messages/MessageDetail";
import UserProfile from './components/Users/UserProfile';
import Chatbot from './components/Chatbot';

const App = () => {
  return (
    <div>
      <Nav />
      <Chatbot />
      
      <Switch>
        <AuthRoute exact path="/login" component={Login} routeType="auth" />
        <AuthRoute exact path="/register" component={Register} routeType="auth" />
        <AuthRoute exact path="/items/new" component={CreateItem} />
        <AuthRoute exact path="/items/:id/edit" component={EditItem} />
        <AuthRoute exact path="/messages/new" component={CreateMessage} />
        <AuthRoute exact path="/messages/:messageId" component={MessageDetail}/>
        <AuthRoute exact path="/messages" component={MessagesIndex}/>
        <AuthRoute exact path="/users/:userId" component={UserProfile} />
        <AuthRoute exact path="/users/:userId/:tabName" component={UserProfile}/>
        <Route exact path="/index" component={ItemIndex} />
        <Route exact path="/items/:id" component={ItemShow} />
        <Route exact path="/" component={Splash} />
      </Switch>
    </div>
  );
};

export default App;