"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useMutation } from "@apollo/client";
import { useUser } from "@clerk/nextjs";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CREATE_CHATBOT } from "@/graphql/mutations/mutations";

function CreateChatbot() {
  const { user } = useUser();
  const [name, setName] = useState("");
  const router = useRouter();

  console.log(user);

  const [createChabot, { loading }] = useMutation(CREATE_CHATBOT, {
    variables: {
      clerk_user_id: user?.id,
      name,
      created_at: new Date().toISOString(),
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const data = await createChabot();

      setName("");

      router.push(`/edit-chatbot/${data.data.insertChatbots.id}`);
    } catch (error) {
      console.log("CreateChatbot", error);
    }
  };

  if (!user) {
    return null;
  }

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
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-5 mt-5"
        >
          <Input
            placeholder="Chatbot Name..."
            className="max-w-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            required
          />
          <Button type="submit" disabled={loading || !name}>
            {loading ? "Creating Chabot..." : "Create  Chatbot"}
          </Button>
        </form>
        <p className="text-green-500 mt-5 text-sm">
          Example: Customer Support Chatbot
        </p>
      </div>
    </div>
  );
}

export default CreateChatbot;
