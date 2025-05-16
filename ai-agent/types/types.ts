export interface Chatbot {
  id: number;
  clerk_user_id: string;
  name: string;
  created_at: string;
  chatbot_characteristics: ChatBotCharacteristics[];
  chat_sessions: ChatSessions[];
}

export interface ChatBotCharacteristics {
  id: number;
  chatbot_id: number;
  content: string;
  created_at: string;
}

export interface Guest {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface ChatSessions {
  id: number;
  chatbot_id: number;
  guest_id: number | null;
  created_at: string;
  message: Message[];
  guests: Guest[];
}

export interface Message {
  id: number;
  chat_sessions_id: number;
  content: string;
  created_at: string;
  sender: "ai" | "user";
}

export interface GetChatbotByIdResponse {
  chatbots: Chatbot;
}

export interface GetChatbotByIdVariables {
  id: string;
}

export interface GetUserChatbotsResponse {
  chatbotsList: Chatbot[];
}
export interface GetUserChatbotsVariables {
  userId: string;
}
