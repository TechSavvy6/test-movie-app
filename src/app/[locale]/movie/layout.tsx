"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { push } = useRouter();

  useEffect(() => {
    const isLogin =
      typeof window !== "undefined" && window.localStorage.getItem("is_login");
    if (!isLogin) {
      push("/");
    }
  }, []);

  return <>{children}</>;
}
