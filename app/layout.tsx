import "./globals.css";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import { SuperTokensProvider } from "./components/supertokensProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "With You 😇",
  description: "NextJS version of with you web-app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "p-3")}>
        <SuperTokensProvider>{children}</SuperTokensProvider>
      </body>
    </html>
  );
}
