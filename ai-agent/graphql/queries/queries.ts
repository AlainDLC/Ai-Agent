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
    chat_sessions(id: $id) {
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

export const GET_CHATBOT_BY_USER = gql`
  query GetChatbotByUser($clerk_user_id: String!, $id: Int!) {
    chatbots(clerk_user_id: $clerk_user_id, id: $id) {
      clerk_user_id
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
        id
        guests {
          name
          email
        }
      }
    }
  }
`;

export const GET_CHAT_SESSION_MESSAGE = gql`
  query GetChatSessionMessage($id: Int!) {
    chat_sessions(id: $id) {
      created_at
      messages {
        id
        content
        created_at
        sender
      }
      chatbots {
        name
      }
      guests {
        name
        email
      }
    }
  }
`;

export const GET_MESSAGES_BY_CHAT_SESSION_ID = gql`
  query GetMessagesByChatSessionId($chat_session_id: Int!) {
    chat_sessions(id: $chat_session_id) {
      id
      messages {
        id
        content
        sender
        created_at
      }
    }
  }
`;
