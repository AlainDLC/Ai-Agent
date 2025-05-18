/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { FormProvider } from "react-hook-form";
import Messages from "@/app/components/Message";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  GET_CHATBOT_BY_ID,
  GET_MESSAGES_BY_CHAT_SESSION_ID,
} from "@/graphql/queries/queries";
import startNewChat from "@/lib/startNewChat";
import {
  GetChatbotByIdResponse,
  Message,
  MessagesByChatSessionsIdResponse,
  MessagesByChatSessionsIdVariables,
} from "@/types/types";
import { useQuery } from "@apollo/client";
import Image from "next/image";
import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  message: z.string().min(2, "Your Message is too short!!"),
});

function ChatbotPage({ params: { id } }: { params: { id: string } }) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [chatId, setChatId] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const { data: chatBotData } = useQuery<GetChatbotByIdResponse>(
    GET_CHATBOT_BY_ID,
    { variables: { id } }
  );

  const {
    loading: loadingQuery,
    error,
    data,
  } = useQuery<
    MessagesByChatSessionsIdResponse,
    MessagesByChatSessionsIdVariables
  >(GET_MESSAGES_BY_CHAT_SESSION_ID, {
    variables: { chat_session_id: chatId },
    skip: !chatId,
  });

  useEffect(() => {
    if (data) {
      setMessages(data.chat_sessions.messages);
    }
  }, [data]);

  const handleInformationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const chatId = await startNewChat(name, email, Number(id));
    setChatId(chatId);
    setLoading(false);
    setIsOpen(false);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const { message: formMessage } = values;
    const message = formMessage;
    form.reset();

    if (!name || !email) {
      setIsOpen(true);
      setLoading(false);
      return;
    }

    if (!message.trim()) {
      return;
    }
  }

  return (
    <div className="w-full flex bg-gray-100">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] ">
          <form onSubmit={handleInformationSubmit}>
            <DialogHeader>
              <DialogTitle>Lets help you out</DialogTitle>
              <DialogDescription>
                I just need a few details to get started
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="King"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="King@gmail.com"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!name || !email || loading}>
                {!loading ? "Continue" : "Loading..."}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col w-full max-w-3xl mx-auto bg-white md:rounded-t-lg shadow-2xl md:mt-20">
        <div
          className="pb-4 border-b sticky top-0 <-50 bg-green-400 text-white md:rounded-t-lg flex
        items-center space-x-4"
        >
          <Image src={"/ai.png"} height={30} width={30} alt="ai" />
        </div>
        <h1 className="truncate text-lg">{chatBotData?.chatbots.name}</h1>
        🤖 Typically replies Instantly
        <Messages messages={messages} />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-start sticky bottom-0 z-50
          space-x-4 drop-shadow-lg p-4 bg-gray-100 rounded-md"
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel hidden>Message</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type a message..."
                      {...field}
                      className="p-8 bg-green-200"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="h-full"
              disabled={form.formState.isSubmitted || !form.formState.isValid}
            >
              Send
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default ChatbotPage;
