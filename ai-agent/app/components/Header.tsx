"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";

import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import Link from "next/link";

function Header() {
  return (
    <header className="flex items-center justify-between shadow-sm p-3 ">
      <Link href="/">
        <Image src={"/a.png"} alt="logo" height={200} width={200} />
      </Link>
      <SignedIn>
        <UserButton
          showName
          appearance={{
            elements: {
              userButtonBox: {
                fontSize: "16px", // ändrar textstorlek
                color: "#88e887", // ändrar textfärg
              },
              userButtonName: {
                color: "#88e887", // om bara namnet ska byta färg
              },
              userButtonAvatarBox: {
                width: "24px", // Minskar avataren
                height: "24px",
              },
            },
          }}
        />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </header>
  );
}

export default Header;
