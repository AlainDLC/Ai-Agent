import { gql } from "@apollo/client";

export const GET_CHATBOT_BY_ID = gql`
  query GetChatbotById($id: Int!) {
    chatbots(id: $id) {
      id
      name
      created_at
      chatbot_characteristics {
        id
        created_at
        content
      }
    }
    chat_sessions(id: 10) {
      created_at
      id
      guest_id
      messages {
        content
        id
        created_at
      }
    }
  }
`;
