import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/app-context";

export const metadata: Metadata = {
  title: "LEDGER ZERO – Agentic AI Financial OS",
  description: "Autonomous financial intelligence & operating system for small businesses by NULL PROTOCOL. From financial insight to real-world action.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-background text-forest antialiased flex flex-col">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
