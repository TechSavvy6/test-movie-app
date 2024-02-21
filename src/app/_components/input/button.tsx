"use client";

import React from "react";

export default function Button({
  text,
  onClick,
  type = "primary",
}: {
  text: string;
  onClick: () => void;
  type?: "default" | "primary";
}) {
  return (
    <button
      className={`text-white" w-full rounded-[10px] py-[15px] text-[16px] font-[700] leading-[24px] ${type === "primary" ? "bg-[#2BD17E]" : "bg-transparent border-white border"}`}
      onClick={() => {
        onClick();
      }}
    >
      {text}
    </button>
  );
}
