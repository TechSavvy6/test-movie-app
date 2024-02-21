'use client';

import React from 'react'

export default function TextInput({
  type,
  placeholder,
  value,
  onChange,
}: {
  type: "text" | "password";
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      type={type}
      className="rounded-[10px] bg-[#224957] px-[16px] py-[11px] text-[14px] leading-[24px] outline-none w-full"
      placeholder={placeholder}
      onChange={(event) => {
        onChange(event);
      }}
      value={value}
    />
  );
}
