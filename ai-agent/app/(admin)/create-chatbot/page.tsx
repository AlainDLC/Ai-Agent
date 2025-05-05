import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";

function CreateChatbot() {
  return (
    <div
      className="flex flex-col items-center md:flex-row
    md:space-x-10 bg-white p-10 rounded-md m-10"
    >
      <Image src={"/ai.png"} alt="ai" height={50} width={50} />
      <div>
        <h1 className="text-lg lg:text-3xl font-semibold">Create</h1>
        <h2 className="font-light">
          Create a new chatbot to assist your conversations with your customers.
        </h2>
        <form className="flex flex-col md:flex-row gap-5 mt-5">
          <Input
            placeholder="Chatbot Name..."
            className="max-w-lg"
            type="text"
            required
          />
          <Button>Create Chatbot</Button>
        </form>
      </div>
    </div>
  );
}

export default CreateChatbot;
