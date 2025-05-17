import client from "@/graphql/apolloClient";
import {
  INSERT_CHAT_SESSION,
  INSERT_GUEST,
  INSERT_MESSAGE,
} from "@/graphql/mutations/mutations";

async function startNewChat(
  guestName: string,
  guestEmail: string,
  chatbotId: number
) {
  try {
    // create a new quest entry
    const created_at = new Date().toISOString();
    const questResult = await client.mutate({
      mutation: INSERT_GUEST,
      variables: {
        name: guestName,
        email: guestEmail,
        created_at: created_at,
      },
    });
    const guestId = questResult.data.insertGuests.id;

    console.log("guestId", guestId);

    //2. Initailize a new chat session

    const chatSessionResult = await client.mutate({
      mutation: INSERT_CHAT_SESSION,
      variables: {
        chatbot_id: chatbotId,
        guest_id: guestId,
        created_at: created_at,
      },
    });

    const chatSessionId = chatSessionResult.data.insertChat_sessions.id;

    console.log("chatSessionId", chatSessionId);

    // 3. Insert initial message (optinal)

    await client.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id: chatSessionId,
        sender: "ai",
        content: `Welcome ${guestName}!\n How can I assist you today? 😎`,
        created_at: created_at,
      },
    });

    console.log("New Chat Session starterd successfully");

    return chatSessionId;
  } catch (error) {
    console.error("startNewChat", error);
  }
}

export default startNewChat;
