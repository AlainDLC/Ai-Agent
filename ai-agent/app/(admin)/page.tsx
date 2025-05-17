import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="p-10 bg-white m-10 rounded-md w-full">
      <h1 className="text-4xl font-light">Ai agent</h1>
      <h2 className="mt-2 mb-10">
        Yor customisable AI chat agent help you manage your cusomer
        conversations!
      </h2>
      <Link href="/create-chatbot">
        <Button className="bg-green-400">
          Lets get started by creating you first chatbot
        </Button>
      </Link>
    </main>
  );
}
