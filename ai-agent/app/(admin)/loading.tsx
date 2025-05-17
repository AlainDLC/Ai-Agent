import Image from "next/image";
import React from "react";

function Loading() {
  return (
    <div className="mx-auto animate-spin p-10">
      <h1>KING </h1>
      <Image src={"/ai.png"} height={30} width={30} alt="ai" />
    </div>
  );
}

export default Loading;
