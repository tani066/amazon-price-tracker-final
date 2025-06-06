import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LoginView from "./LoginView";
import { auth } from "@/auth";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PricePulse",
  description: "Track prices and compare smartly across platforms",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {user ? (
          <div className="min-h-screen">
            <div className="px-4 py-3 max-w-6xl mx-auto h-screen">
              <Header user={user} />
              <div className="grid grid-cols-12 mt-4 gap-4">
                <div className="col-span-3 rounded-2xl p-4 shadow-md bg-white mr-3">
                  <Sidebar />
                </div>
                <div className="col-span-9">{children}</div>
              </div>
            </div>
          </div>
        ) : (
          <LoginView />
        )}
      </body>
    </html>
  );
}
