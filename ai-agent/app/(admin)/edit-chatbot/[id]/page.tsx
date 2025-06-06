"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/graphql/apolloClient";
import { Copy, Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CHATBOT_BY_ID } from "@/graphql/queries/queries";
import { GetChatbotByIdResponse, GetChatbotByIdVariables } from "@/types/types";
import Characteristic from "@/app/components/Characteristic";
import {
  ADD_CHARACTERISTIC,
  DELETE_CHATBOT,
  UPDATE_CHATBOT,
} from "@/graphql/mutations/mutations";
import { redirect } from "next/navigation";

function EditChatbot({ params: { id } }: { params: { id: string } }) {
  const [url, setUrl] = useState<string>("");
  const [chabotName, setChatbotName] = useState<string>("");
  const [newCharacteristic, setNewCharacteristic] = useState<string>("");
  const [deleteChatbot] = useMutation(DELETE_CHATBOT, {
    refetchQueries: ["GetChatbotById"],
    awaitRefetchQueries: true,
  });

  const [addCharacteristic] = useMutation(ADD_CHARACTERISTIC, {
    refetchQueries: ["GetChatbotById"],
  });

  const [uptadeChatbot] = useMutation(UPDATE_CHATBOT, {
    refetchQueries: ["GetChatbotById"],
  });

  const { data, loading, error } = useQuery<
    GetChatbotByIdResponse,
    GetChatbotByIdVariables
  >(GET_CHATBOT_BY_ID, {
    variables: { id: String(id) },
  });

  useEffect(() => {
    if (data) {
      setChatbotName(data.chatbots?.name);
    }
  }, [data]);

  useEffect(() => {
    const url = `${BASE_URL}/chatbot/${id}`;
    setUrl(url);
  }, [id]);

  const handleUpdateChatbot = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const promise = uptadeChatbot({
        variables: {
          id,
          name: chabotName,
          created_at: new Date().toISOString(),
        },
      });

      toast.promise(promise, {
        loading: "Updating...",
        success: "Chatbot Name Sucessfully updated!",
        error: "Failed to Update Chatbot ",
      });
    } catch (err) {
      console.error("Failed to Updating", err);
    }
  };

  const handleDeleteChatbot = async (id: string) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this chatbot?..."
    );
    if (!isConfirmed) {
      return;
    }

    try {
      const promise = deleteChatbot({ variables: { id } });
      toast.promise(promise, {
        loading: "Deleting...",
        success: "Chatbot Successfully deleted!",
        error: "Failed to delete chatbot",
      });
    } catch (error) {
      console.log("handleDeleteChatbot", error);
      toast.error("Failed to delete chatbot");
    }
  };

  const handleAddCharacteristic = async (content: string) => {
    try {
      const promise = addCharacteristic({
        variables: {
          chatbotId: Number(id),
          content,
          created_at: new Date().toISOString(),
        },
      });

      toast.promise(promise, {
        loading: "Adding...",
        success: "Information added",
        error: "Failed to Add Information ",
      });
    } catch (err) {
      console.error("Failed to Add", err);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto animate-spin p-10">
        <Loader className="h-6 w-6 ring-2" />
      </div>
    );
  }

  if (error) return <p>Error: {error.message}</p>;

  if (!data?.chatbots) {
    return redirect("/view-chatbots");
  }

  return (
    <div className="px-0 md:p-10">
      <div className="md:sticky md:top-10 z-50 sm:max-w-sm ml-auto space-y-2 md:border p-5 rounded-b-lg bg-blue-400">
        <h2 className="text-white text-sm font-bold">Link to Chat</h2>
        <p className="text-sm italic text-white">
          Share this link with your customers to start conversations with your
          chat-bot
        </p>
        <div className="flex items-center space-x-2">
          <Link href={url} className="w-full cursor-pointer hover:opacity-50">
            <Input value={url} readOnly className="cursor-pointer bg-white" />
          </Link>
          <Button
            size="sm"
            className="px-3"
            onClick={() => {
              navigator.clipboard.writeText(url);
              toast.success("Copied to clipbord");
            }}
          >
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <section className="relative mt-5 bg-white p-5 md:p-10 rounded-lg">
        <Button
          variant="destructive"
          className="absolute top-2 right-2 h-8 w-2"
          onClick={() => handleDeleteChatbot(id)}
        >
          X
        </Button>
        <div className="flex space-x-4">
          <Image src={"/ai.png"} height={50} width={50} alt="ai" />

          <form
            onSubmit={handleUpdateChatbot}
            className="flex flex-1 space-x-2 items-center"
          >
            <Input
              value={chabotName}
              onChange={(e) => setChatbotName(e.target.value)}
              placeholder={chabotName}
              required
              className="w-full border-green-300 bg-transparent text-xl font-bold 	text-transform: uppercase"
            />
            <Button type="submit" disabled={!chabotName}>
              Update
            </Button>
          </form>
        </div>
        <h2 className="text-xl font-bold mt-10">
          Heres what your AI knows....
        </h2>
        <p>
          Your chatbot is equipped whit the fallowing information to assist you
          in your coversations whit your customers & users
        </p>
        <div className="bg-green-300 p-5 md:p-5 rounded-md mt-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddCharacteristic(newCharacteristic);
              setNewCharacteristic("");
            }}
            className="flex  space-x-2 mb-5"
          >
            <Input
              type="text"
              placeholder="Examlpe: If cutsomers ask for price, provide pricing page: www.example.com/pricing"
              value={newCharacteristic}
              onChange={(e) => setNewCharacteristic(e.target.value)}
              className="bg-white"
            />
            <Button type="submit" disabled={!newCharacteristic}>
              Add
            </Button>
          </form>
          <ul className="flex flex-wrap-reverse gap-5">
            {data?.chatbots?.chatbot_characteristics?.map((characteristic) => (
              <Characteristic
                characteristic={characteristic}
                key={characteristic.id}
              />
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default EditChatbot;
