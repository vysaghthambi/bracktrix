"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header>
      {session ? (
        <div>
          <Link href={"/team/create"}>Create Team</Link>
          <Link href={"/team/join"}>Join Team</Link>
          {session?.user?.email}
          <button onClick={() => signOut()}>logout</button>
        </div>
      ) : (
        <div>
          Not logged in<button onClick={() => signIn()}>login</button>
        </div>
      )}
    </header>
  );
}
