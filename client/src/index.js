import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { ApolloProvider } from "react-apollo";
import { HashRouter } from 'react-router-dom'
import { onError } from "apollo-link-error";
import { VERIFY_USER } from "./graphql/mutations";
import { ApolloLink } from 'apollo-link';

const cache = new InMemoryCache({
    dataIdFromObject: object => object._id || null
});

// if we have a token we want to verify the user is actually logged in
const token = localStorage.getItem("auth-token");
const currentUser = localStorage.getItem("currentUser");
// to avoid components async problems where
// a component would try to read the cache's value of isLoggedIn
// before our mutation goes through we can set it up here
cache.writeData({
    data: {
        isLoggedIn: Boolean(token),
        currentUser: currentUser
    }
});

const httpLink = createHttpLink({
    uri: window.location.origin.replace(/3000/, "5000"),
    headers: {
        // pass our token into the header of each request
        authorization: token
    }
});
// make sure we log any additional errors we receive
const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        console.log('graphQLErrors', graphQLErrors);
    }
    if (networkError) {
        console.log('networkError', networkError);
    }
});
const link = ApolloLink.from([errorLink, httpLink]);

const client = new ApolloClient({
    link,
    cache,
    onError: ({ networkError, graphQLErrors }) => {
        console.log("graphQLErrors", graphQLErrors);
        console.log("networkError", networkError);
    }
});
// then if we do have a token we'll go through with our mutation
if (token) {
    client
        // use the VERIFY_USER mutation directly use the returned data to know if the returned
        // user is loggedIn
        .mutate({ mutation: VERIFY_USER, variables: { token } })
        .then(({ data }) => {
            cache.writeData({
                data: {
                    isLoggedIn: data.verifyUser.loggedIn,
                    id: data.verifyUser.id,
                    currentUser: data.verifyUser.id
                }
            });
        });
}

const Root = () => {
    return (
        <ApolloProvider client={client}>
            <HashRouter>
                <App />
            </HashRouter>
        </ApolloProvider>
    );
};

ReactDOM.render(<Root />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();