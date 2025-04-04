"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { EdgeStoreProvider } from "@/app/lib/edgestore";
import { SessionProvider } from "next-auth/react";
import "@/app/ui/globals.css";

const theme = createTheme({
  palette: {
    mode: "dark",
    secondary: {
      main: "#ff3e00",
    },
    text: {
      primary: "#fff",
    },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <EdgeStoreProvider>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </EdgeStoreProvider>
    </SessionProvider>
  );
}
