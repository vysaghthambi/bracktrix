"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header>
      {session ? (
        <div>
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
