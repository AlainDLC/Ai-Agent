import { gql } from "@apollo/client";

export const CREATE_CHATBOT = gql`
  mutation CreateChatBot(
    $clerk_user_id: String!
    $created_at: DateTime!
    $name: String!
  ) {
    insertChatbots(
      clerk_user_id: $clerk_user_id
      created_at: $created_at
      name: $name
    ) {
      id
      name
    }
  }
`;

export const CREATE_CHATBOT1 = gql`
  mutation CreateChatBot($clerk_user_id: String!, $name: String!) {
    insertChatbots(clerk_user_id: $clerk_user_id, name: $name) {
      id
      name
    }
  }
`;
