//client/src/graphql/mutations.js
import gql from "graphql-tag";

const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      loggedIn
    }
  }
`;

const REGISTER_USER = gql`
  mutation RegisterUser($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      token
      loggedIn
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
  mutation newItem($name: String!, $description: String!, $starting_price: Float, $minimum_price: Float, $category: String!, $sold: Boolean!, $appraised: Boolean!) {
    newItem(name: $name, description: $description, starting_price: $starting_price, minimum_price: $minimum_price, category: $category, sold: $sold, appraised: $appraised) {
      id
      name
      description
      starting_price
      minimum_price
      category{
        name
      }
      sold
      appraised
      imageURLs
      location
    }
  }
`;

const UPDATE_ITEM = gql`
  mutation updateItem($id: ID!, $name: String!, $description: String!, $starting_price: Float, $minimum_price: Float, $category: String!, $sold: Boolean!, $appraised: Boolean!, $imageURLs: [String], $location: [Float]) {
    updateItem(id: $id, name: $name, description: $description, starting_price: $starting_price, minimum_price: $minimum_price, category: $category, sold: $sold, appraised: $appraised, imageURLs: $imageURLs, location: $location) {
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
      imageURLs
      location
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

export { LOGIN_USER, VERIFY_USER, REGISTER_USER, CREATE_ITEM, CREATE_MESSAGE, CREATE_CHAMPION, UPDATE_ITEM_IMAGES };
