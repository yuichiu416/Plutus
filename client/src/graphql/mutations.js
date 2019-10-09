//client/src/graphql/mutations.js
import gql from "graphql-tag";

const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      loggedIn
      id
    }
  }
`;

const REGISTER_USER = gql`
  mutation RegisterUser($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      token
      loggedIn
      id
    }
  }
`;

const VERIFY_USER = gql`
  mutation VerifyUser($token: String!) {
    verifyUser(token: $token) {
      loggedIn
    }
  }
`;

const CREATE_ITEM = gql`
  mutation newItem($name: String!, $description: String!, $starting_price: Float, $minimum_price: Float, $category: String!, $sold: Boolean!, $appraised: Boolean!, $location: String!, $champions: [String], $endTime: Float) {
    newItem(name: $name, description: $description, starting_price: $starting_price, minimum_price: $minimum_price, category: $category, sold: $sold, appraised: $appraised, location: $location, champions: $champions, endTime: $endTime) {
      id
      name
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
    }
  }
`;

const UPDATE_ITEM = gql`
  mutation updateItem($id: ID!, $name: String!, $description: String!, $starting_price: Float, $minimum_price: Float, $category: String!, $sold: Boolean!, $appraised: Boolean!, $champions: [String], $endTime: Float) {
    updateItem(id: $id, name: $name, description: $description, starting_price: $starting_price, minimum_price: $minimum_price, category: $category, sold: $sold, appraised: $appraised, champions: $champions, endTime: $endTime){
      id
      name
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
      current_price
    }
  }
`;

const MAKE_BID = gql`
  mutation makeBid($id: ID!, $current_price: Float!){
    makeBid(id: $id, current_price: $current_price){
      id
      name
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
      current_price
    }
  }
`;

const CREATE_MESSAGE = gql`
  mutation CreateMessage($title: String!, $body: String!, $receiver: String!){
    newMessage(title: $title, body: $body, receiver: $receiver){
      id
      title
      body
      receiver{
        id
        name
      }
      replies{
        title
        body
      }
    }
  }
`

const CREATE_CHAMPION = gql`
  mutation CreateChampion($name: String!, $publicId: String!){
    createChampion(name: $name, publicId: $publicId){
      id
      name
      publicId
    }
  }
`
const UPDATE_ITEM_IMAGES = gql`
  mutation UpdateItemImages($publicId: String!, $id: String!){
    updateItemImages(publicId: $publicId, id: $id)
    id
    champions
  }
`
const ADD_REPLY = gql`
  mutation AddReply($id: String!, $body: String!){
    addReply(id: $id , body: $body){
      id
      title
      body
      sender{
        id
        name
      }
      receiver{
        id
        name
      }
    }
  }
`

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $name: String!, $email: String!){
    updateUser(id: $id, name: $name, email: $email){
      id
      name
      email
    }
  }
`



export { LOGIN_USER, VERIFY_USER, REGISTER_USER, CREATE_ITEM, UPDATE_ITEM, CREATE_MESSAGE, CREATE_CHAMPION, UPDATE_ITEM_IMAGES, ADD_REPLY, MAKE_BID, UPDATE_USER };
