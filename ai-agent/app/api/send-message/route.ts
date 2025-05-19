import { INSERT_MESSAGE } from "@/graphql/mutations/mutations";
import {
  GET_CHATBOT_BY_ID,
  GET_MESSAGES_BY_CHAT_SESSION_ID,
} from "@/graphql/queries/queries";
import { serverClient } from "@/lib/server/serverClient";
import {
  GetChatbotByIdResponse,
  MessagesByChatSessionsIdResponse,
} from "@/types/types";

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
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

    const previusMessages = messagesData?.chat_sessions?.messages;

    const formattedPreviusMessages: ChatCompletionMessageParam[] =
      previusMessages?.map((message) => ({
        role: message.sender === "ai" ? "system" : "user",
        name: message.sender === "ai" ? "system" : name,
        content: message.content,
      })) || [];

    const systemPromt = chatbot.chatbot_characteristics
      .map((c) => c.content)
      .join(" + ");

    console.log("SystemPromt", systemPromt);

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        name: "system",
        content: `You are a helpful assistant talking to ${name}. if a generic qusetion is asked wich is not
        relevant or in the same scope or domain as the points in mentioned in the key information section,kindly
        inform the user the are allowed to search for the specified content. Use Emoj's where possible. Here
        os some key information thet you nedd to be awere of, these are elements you may be asked about: ${systemPromt} `,
      },
      ...formattedPreviusMessages,
      {
        role: "user",
        name: name,
        content: content,
      },
    ];

    const openaiResponse = await openai.chat.completions.create({
      messages: messages,
      model: "gpt-3.5-turbo",
    });

    const aiResponse = openaiResponse?.choices?.[0]?.message?.content?.trim();

    if (!aiResponse) {
      return NextResponse.json(
        {
          error: "Failed to generate AI response",
        },
        { status: 500 }
      );
    }

    await serverClient.mutate({
      mutation: INSERT_MESSAGE,
      variables: { chat_sessions_id, content, sender: "user" },
    });

    const aiMssageResult = await serverClient.mutate({
      mutation: INSERT_MESSAGE,
      variables: { chat_sessions_id, content: aiResponse, sender: "ai" },
    });

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Message content is empty." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      id: aiMssageResult.data.insertMessages.id,
      content: aiResponse,
    });
  } catch (error) {
    console.error("Error sending message", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
