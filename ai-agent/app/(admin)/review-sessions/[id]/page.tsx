/* eslint-disable @typescript-eslint/no-unused-vars */
import Message from "@/app/components/Message";
import { GET_CHAT_SESSION_MESSAGE } from "@/graphql/queries/queries";
import { serverClient } from "@/lib/server/serverClient";
import {
  GetChatSessionMessagesResponse,
  GetChatSessionMessagesVariables,
} from "@/types/types";

export const dynamic = "force-dynamic";

async function ReviewSessionPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const {
    data: {
      chat_sessions: {
        id: chatSessionId,
        created_at,
        messages,
        chatbots: { name },
        guests: { name: guestName, email },
      },
    },
  } = await serverClient.query<
    GetChatSessionMessagesResponse,
    GetChatSessionMessagesVariables
  >({
    query: GET_CHAT_SESSION_MESSAGE,
    variables: {
      id: parseInt(id),
    },
  });
  return (
    <div className="flex-1 p-10 pb-24">
      <h1 className="text-xl lg:text-3xl  font-semibold">Session Review</h1>
      <p className="font-light text-sm text-slate-400 mt-2">
        Started at {new Date(created_at).toLocaleString()}
      </p>
      <h2 className="font-light  mt-2">
        Between {name} &{" "}
        <span className="font-extrabold">
          {guestName} ({email}) {chatSessionId}
        </span>
      </h2>
      <hr className="my-10" />
      <Message messages={messages} />
    </div>
  );
}

export default ReviewSessionPage;
