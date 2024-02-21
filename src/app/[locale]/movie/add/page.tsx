"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";

import TextInput from "@/app/_components/input/text";
import Button from "@/app/_components/input/button";

import { api } from "@/trpc/react";
import toast from "react-hot-toast";

import { useTranslations } from "next-intl";

export default function AddMovie() {
  const { push } = useRouter();

  const [fileBlob, setFileBlob] = React.useState<any>(null);

  const searchParams = useParams();

  const locale = searchParams.locale;

  const t = useTranslations("Index");

  const createMovie = api.movie.create.useMutation({
    onSuccess: () => {
      push(`/${locale}/movie`);
    },
    onError: (error) => {
      if (error.data?.code === "BAD_REQUEST") {
        toast.error(JSON.parse(error.message)[0].message);
      }
    },
  });

  const [input, setInput] = React.useState({
    title: "",
    year: 1999,
    file: "",
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFileBlob(acceptedFiles[0]);
    },
    multiple: false,
    maxSize: 1024 * 1024,
    onDropRejected: (error) => {
      toast.error("This file is too large!");
    },
  });

  const onSubmit = async () => {
    if (fileBlob) {
      input.file = await new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(fileBlob);
        reader.onload = () => resolve(reader.result as any);
        reader.onerror = (error) => reject(error);
      });
    } else {
      return toast.error("Please choose the post image file!");
    }
    createMovie.mutate({ ...input });
  };

  if (createMovie.isLoading) {
    return <p>Uploading...</p>;
  }

  return (
    <div className="mx-5 flex min-h-screen w-full max-w-[1200px] flex-col md:mx-auto">
      <h2 className="mt-[120px] text-[48px]"> {t("Create a new movie")} </h2>
      <div className="mt-[120px] grid  grid-cols-1 gap-[127px] md:grid-cols-2">
        <div className="relative w-full">
          <div
            {...getRootProps({ className: "dropzone" })}
            className="flex min-h-[450px] items-center justify-center rounded-[10px] border-[2px] border-dashed border-white"
          >
            <input {...getInputProps()} />
            {fileBlob && (
              <img
                src={URL.createObjectURL(fileBlob)}
                className="-z-1 max absolute h-[94%] max-w-[92%] object-contain"
              />
            )}
            <p>Drop an image here</p>
          </div>
        </div>
        <div className="flex max-w-[362px] flex-col">
          <div className="w-full">
            <TextInput
              type="text"
              onChange={(event) => {
                setInput({ ...input, title: event.target.value });
              }}
              value={input.title}
              placeholder="Title"
            />
          </div>
          <div className="mt-[24px] w-full sm:w-[66%]">
            <TextInput
              type="text"
              onChange={(event) => {
                setInput({
                  ...input,
                  year: Number.isNaN(Number(event.target.value))
                    ? 0
                    : Number(event.target.value),
                });
              }}
              value={"" + input.year}
              placeholder="Publishing Year"
            />
          </div>
          <div className="mt-[64px] grid w-full grid-cols-2 gap-4">
            <div className="">
              <Button
                type="default"
                text={t("Cancel")}
                onClick={() => {
                  push(`/${locale}/movie`);
                }}
              />
            </div>
            <div className="">
              <Button text={t("Submit")} onClick={onSubmit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
