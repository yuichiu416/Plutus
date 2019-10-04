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
  mutation newItem($name: String!, $seller: String!, $description: String!, $starting_price: Float, $minimum_price: Float, $category: String!, $sold: Boolean!, $appraised: Boolean!) {
    newItem(name: $name,seller: $seller, description: $description, starting_price: $starting_price, minimum_price: $minimum_price, category: $category, sold: $sold, appraised: $appraised) {
      id
      name
      seller
      description
      starting_price
      minimum_price
      category{
        name
      }
      sold
      appraised
    }
  }
`;

const CREATE_MESSAGE = gql`
  mutation newMessage($title: String!, $body: String!, $receiver: String!){
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
`

export { LOGIN_USER, VERIFY_USER, REGISTER_USER, CREATE_ITEM, CREATE_MESSAGE };