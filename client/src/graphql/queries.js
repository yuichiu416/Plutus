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
        champions
        location
        endTime
        nameHash
        current_price
      }
    }`,
    FETCH_ITEM: gql`
    query fetchItem($id: String!){
      item(id: $id){
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
        champions
        location
        endTime
        nameHash
        current_price
      }
    }
    `,
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
        notifications{
          id
          body
          read
        }
      }
    `,
    FETCH_CHAMPION: gql`
      query FetchChampion($id: String!){
        champion(id: $id){
          id
          name
          publicId
        }
      }
    `,
    FETCH_CHAMPIONS: gql`
      query FetchChampions{
        champions{
          id
          name
          publicId
        }
      }
    `,
    FETCH_MESSAGES: gql`
      query FetchMessages{
        messages{
          id
          title
          body
          sender{
            id
            name
          }
          replies{
            id
            title
            body
            sender{
              id
              name
            }
          }
        }
      }
    `,
    FETCH_MESSAGE: gql`
      query FetchMessage($id: ID!){
        message(id: $id){
          id
          title
          body
          sender{
            id
            name
          }
          replies{
            id
            body
            sender{
              id
              name
            }
          }
         
        }
      }
    `,
    FETCH_USER: gql`
      query FetchUser($id: ID!){
        user(id: $id){
          id
          name
          email
        }
      }
    `,
    FETCH_NOTIFICATIONS: gql`
      query FetchNotifications{
        notifications{
          id
          body
          read
          date
        }
      }
    `
     
};