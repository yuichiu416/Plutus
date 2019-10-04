//client/src/graphql/queries.js
import gql from "graphql-tag";

export default {
    IS_LOGGED_IN: gql`
    query IsUserLoggedIn {
      isLoggedIn @client
    }
  `,
  FETCH_ITEMS: gql`
    query FetchItems{
      items {
        id
        name
        seller
        description
        starting_price
        minimum_price
        location
        category
        sold
        appraised
      }
    }`,
};