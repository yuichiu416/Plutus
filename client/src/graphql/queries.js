//client/src/graphql/queries.js
import gql from "graphql-tag";

export default {
    IS_LOGGED_IN: gql`
    query IsUserLoggedIn {
      isLoggedIn @client
    }
  `,
  FETCH_ITEMS: gql`
    query fetchItems{
      items {
        id
        name
        seller
        description
        starting_price
        minimum_price
        category{
          id
          name
        }
        sold
        appraised
      }
    }`,
    FETCH_CATEGORIES: gql`
      query categories{
        categories{
          id
          name
        }
      }
    `,
    FETCH_USERS: gql`
      query FetchUsers{
        users{
          id
          name
          email
        }
      }
    `
};