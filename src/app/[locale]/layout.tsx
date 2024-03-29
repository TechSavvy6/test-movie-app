import "@/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { NextIntlClientProvider, useMessages } from "next-intl";

import { Toaster } from "react-hot-toast";
import Image from "next/image";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Movie List",
  description: "Generated by Ninja",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = useMessages();
  return (
    <html lang={locale}>
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider>
          <NextIntlClientProvider messages={messages}>
            <main className="relative flex min-h-screen flex-col items-center justify-center bg-[#093545] px-5 pb-[200px] text-white">
              {children}
              <Image
                src="/assets/bottom.png"
                className="absolute bottom-0 w-full object-cover"
                alt="background"
                width={1200}
                height={400}
              />
            </main>
          </NextIntlClientProvider>

          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
