import {
  GET_CHATBOT_BY_ID,
  GET_MESSAGES_BY_CHAT_SESSION_ID,
} from "@/graphql/queries/queries";
import { serverClient } from "@/lib/server/serverClient";
import {
  GetChatbotByIdResponse,
  MessagesByChatSessionsIdResponse,
} from "@/types/types";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextResponse) {
  const { chat_sessions_id, chatbot_id, content, name } = await req.json();

  console.log(
    `Send-message AI  cid ${chat_sessions_id} bid ${chatbot_id} con ${content} nam ${name}`
  );

  try {
    const { data } = await serverClient.query<GetChatbotByIdResponse>({
      query: GET_CHATBOT_BY_ID,
      variables: { id: chatbot_id },
    });

    const chatbot = data.chatbots;

    if (!chatbot) {
      return NextResponse.json({ error: "chatbot not found" }, { status: 404 });
    }

    console.log("Response", data);

    const { data: messagesData } =
      await serverClient.query<MessagesByChatSessionsIdResponse>({
        query: GET_MESSAGES_BY_CHAT_SESSION_ID,
        variables: { chat_sessions_id },
        fetchPolicy: "no-cache",
      });

    const previusMessages = messagesData.chat_sessions.messages;

    const formattedPreviusMessages: ChatCompletionMessageParam[] =
      previusMessages.map((message) => ({
        role: message.sender === "ai" ? "system" : "user",
        name: message.sender === "ai" ? "system" : name,
        content: message.content,
      }));

    const systemPromt = chatbot.chatbot_characteristics
      .map((c) => c.content)
      .join(" + ");

    console.log("SystemPromt", systemPromt);

    const messages: ChatCompletionMessageParam[] = {};
  } catch (error) {
    console.error("Error sending message", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
