import type { Metadata } from "next";
import { poppins, roboto } from "./ui/fonts";
import Nav from "@/components/nav";
import Provider from "@/components/providers";
import ToastProvider from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "Blog App",
  description: "Made by Team Tengis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* <script defer src="https://www.google.com/recaptcha/api.js"></script> */}
        <link rel="icon" href="/osu.svg" />
      </head>
      <body
        className={`${poppins.variable} ${roboto.variable} antialiased space-y-4 flex`}
      >
        <Provider>
          <Nav />
          <main className="grow ml-[100px]">
            <ToastProvider>{children}</ToastProvider>
          </main>
        </Provider>
      </body>
    </html>
  );
}
