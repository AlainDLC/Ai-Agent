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

export const REMOVE_CHARACTERISTIC = gql`
  mutation RemoveCharacteristic($id: Int!) {
    deleteChatbot_characteristics(id: $id) {
      id
    }
  }
`;

export const DELETE_CHATBOT = gql`
  mutation DeleteChatbot($id: Int!) {
    deleteChatbots(id: $id) {
      id
    }
  }
`;

/*  insertChatbot_characteristics(
    created_at: DateTime!
    content: String!
    chatbot_id: Int */

export const ADD_CHARACTERISTIC = gql`
  mutation AddCharacteristic(
    $chatbotId: Int!
    $content: String!
    $created_at: DateTime!
  ) {
    insertChatbot_characteristics(
      chatbot_id: $chatbotId
      content: $content
      created_at: $created_at
    ) {
      id
      content
      created_at
    }
  }
`;
