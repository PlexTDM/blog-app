"use client";

import { ToastContainer } from "react-toastify";

interface ToastProviderProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <ToastContainer theme={"dark"} position="top-right" autoClose={3000} />
    </>
  );
}
