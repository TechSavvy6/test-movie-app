"use client";

import React from "react";
import { toast } from "react-hot-toast";

import { api } from "@/trpc/react";

import TextInput from "@/app/_components/input/text";

import Button from "@/app/_components/input/button";
import { useRouter, useParams } from "next/navigation";

export default function Home() {
  const { push } = useRouter();

  const searchParams = useParams();

  const locale = searchParams.locale;

  const [input, setInput] = React.useState({
    email: "",
    password: "",
  });

  const login = api.auth.login.useMutation({
    onSuccess: () => {
      typeof window !== "undefined" &&
        window.localStorage.setItem("is_login", "true");
      push(locale + "/movie");
    },
    onError: (error) => {
      if (error.data?.code === "BAD_REQUEST") {
        toast.error(JSON.parse(error.message)[0].message);
      } else if (error.data?.code === "NOT_FOUND") {
        toast.error(error.message);
      }
    },
  });

  return (
    <form
      className="flex w-[300px] flex-col items-center"
      onSubmit={async (event) => {
        event.preventDefault();
        login.mutate({ ...input });
      }}
    >
      <h1 className="text-[4rem]">Sign In</h1>
      <div className="mt-[40px] w-full">
        <TextInput
          type="text"
          value={input.email}
          onChange={(event) => {
            setInput({ ...input, email: event.target.value });
          }}
          placeholder="Email"
        />
      </div>
      <div className="mt-[24px] w-full">
        <TextInput
          type="password"
          value={input.password}
          onChange={(event) => {
            setInput({ ...input, password: event.target.value });
          }}
          placeholder="Password"
        />
      </div>
      <div className="mt-[24px] w-full">
        <Button onClick={() => {}} text="Login" />
      </div>
    </form>
  );
}
