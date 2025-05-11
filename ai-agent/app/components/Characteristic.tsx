"use client";

import { REMOVE_CHARACTERISTIC } from "@/graphql/mutations/mutations";
import { ChatBotCharacteristics } from "@/types/types";
import { useMutation } from "@apollo/client";
import { OctagonMinus } from "lucide-react";
import { toast } from "sonner";

function Characteristic({
  characteristic,
}: {
  characteristic: ChatBotCharacteristics;
}) {
  const [removeCharacteristic] = useMutation(REMOVE_CHARACTERISTIC, {
    refetchQueries: ["GetChatbotById"],
  });

  const handleCharacteristic = async (characteristicId: number) => {
    try {
      await removeCharacteristic({
        variables: {
          id: characteristicId,
        },
      });
    } catch (error) {
      console.log("removeCharacteristic", error);
    }
  };
  return (
    <li
      key={characteristic.id}
      className="relative p-10 bg-white border rounded-md"
    >
      {characteristic.content}
      <OctagonMinus
        className="w-6 h-6 text-white fill-red-500 absolute top-1 right-1
      cursor-pointer hover:opacity-50"
        onClick={() => {
          const promise = handleCharacteristic(characteristic.id);
          toast.promise(promise, {
            loading: "Removing",
            success: "Characteristic removed",
            error: "Failed to remove CharacteristicId",
          });
        }}
      />
    </li>
  );
}

export default Characteristic;
