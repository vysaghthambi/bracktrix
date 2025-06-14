"use client";

import { Session } from "next-auth";
import { SnackbarProvider } from "notistack";
import { SessionProvider } from "next-auth/react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export default function Providers({
  children,
  session,
}: Readonly<React.PropsWithChildren<{ session: Session | null }>>) {
  return (
    <SessionProvider session={session}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SnackbarProvider>{children}</SnackbarProvider>
      </LocalizationProvider>
    </SessionProvider>
  );
}
