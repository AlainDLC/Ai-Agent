/* eslint-disable @typescript-eslint/no-unused-vars */
import ChatBotSessions from "@/app/components/ChatBotSessions";
import { GET_USER_CHATBOTS } from "@/graphql/queries/queries";
import { serverClient } from "@/lib/server/serverClient";
import {
  Chatbot,
  GetUserChatbotsResponse,
  GetUserChatbotsVariables,
} from "@/types/types";
import { auth } from "@clerk/nextjs/server";

async function ReviewSessions() {
  const { userId } = await auth();

  if (!userId) return;

  const {
    data: { chatbotsList },
  } = await serverClient.query<
    GetUserChatbotsResponse,
    GetUserChatbotsVariables
  >({
    query: GET_USER_CHATBOTS,
    variables: {
      userId: userId,
    },
  });

  const sortedChatBotByUser: Chatbot[] = chatbotsList.map((chatbot) => ({
    ...chatbot,
    chat_sessions: [...chatbot.chat_sessions].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ),
  }));

  return (
    <div className="flex-1 p-10">
      <h1 className="text-xl lg:text-3xl font-semibold mt-10">Chat Sessions</h1>
      <h2 className="mb-5">
        Review all the chat sessions the chat bots have ad with your cutomers
      </h2>
      <ChatBotSessions chatbots={sortedChatBotByUser} />
    </div>
  );
}

export default ReviewSessions;
