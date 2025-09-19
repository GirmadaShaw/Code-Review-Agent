import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Polish PR",
  description: "Your AI-Powered Code Review Agent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
