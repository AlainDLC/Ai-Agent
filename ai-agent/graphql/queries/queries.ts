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
  }
`;

export const GET_CHATBOT_BY_USER = gql`
  query GetChatbotByUser($clerk_user_id: String!) {
    chatbots(clerk_user_id: $clerk_user_id) {
      id
      name
      created_at
      chatbot_characteristics {
        id
        created_at
        content
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
  }
`;

export const GET_USER_CHATBOTS = gql`
  query GetUserChatbots {
    chatbotsList {
      clerk_user_id
      id
      name
      chat_sessions {
        created_at
        guests {
          name
          email
        }
      }
    }
  }
`;
