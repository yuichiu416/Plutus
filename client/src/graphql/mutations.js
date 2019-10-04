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

const CREATE_PRODUCT = gql`
  mutation newProduct($name: String!, $description: String!, $weight: Int!) {
    newProduct(name: $name, description: $description, weight: $weight) {
      id
      name
      description
      weight
    }
  }
`;

export { LOGIN_USER, VERIFY_USER, REGISTER_USER, CREATE_PRODUCT };