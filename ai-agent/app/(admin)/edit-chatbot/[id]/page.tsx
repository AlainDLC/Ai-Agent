"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/graphql/apolloClient";
import { Copy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function EditChatbot({ params: { id } }: { params: { id: string } }) {
  const [url, setUrl] = useState("");
  const [chabotName, setChatbotName] = useState("");

  useEffect(() => {
    const url = `${BASE_URL}/chatbot/${id}`;
    setUrl(url);
  }, [id]);

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
          // onClick={() =>  handleDelete(id)}
        >
          X
        </Button>
        <div>
          <Image src={"/ai.png"} height={30} width={30} alt="ai" />
        </div>
      </section>
    </div>
  );
}

export default EditChatbot;
