"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDropzone } from "react-dropzone";

import TextInput from "@/app/_components/input/text";
import Button from "@/app/_components/input/button";

import { api } from "@/trpc/react";
import toast from "react-hot-toast";

export default function EditPage() {
  const [fileBlob, setFileBlob] = React.useState<any>(null);

  const [input, setInput] = React.useState({
    title: "",
    year: 1999,
    file: "",
    id: "",
  });

  const searchParams = useParams();

  const locale = searchParams.locale;

  const { push } = useRouter();

  const id = searchParams.id;

  const movie = api.movie.getMovieDetail.useQuery({ id: id as string });

  const updateMovie = api.movie.updateMovie.useMutation({
    onSuccess: () => {
      push("/" + locale + "/movie");
    },
    onError: (error) => {
      if (error.data?.code === "BAD_REQUEST") {
        toast.error(JSON.parse(error.message)[0].message);
      }
    },
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
    }
    updateMovie.mutate({ ...input });
  };

  useEffect(() => {
    if (movie.data) {
      setInput({
        file: movie.data?.postImage!,
        title: movie.data?.title!,
        year: movie.data?.publishYear!,
        id: movie.data.id,
      });
    }
  }, [movie.data]);

  if (updateMovie.isLoading) {
    return <p>Uploading...</p>;
  }

  if (movie.isLoading) {
    return <p>Loading...</p>;
  }

  if (!movie.data) {
    return <p>Not found movie.</p>;
  }

  return (
    <div className="mx-5 flex min-h-screen w-full max-w-[1200px] flex-col md:mx-auto">
      <h2 className="mt-[120px] text-[48px]"> Edit </h2>
      <div className="mt-[120px] grid  grid-cols-1 gap-[127px] md:grid-cols-2">
        <div className="relative w-full">
          <div
            {...getRootProps({ className: "dropzone" })}
            className="flex min-h-[450px] items-center justify-center rounded-[10px] border-[2px] border-dashed border-white"
          >
            <input {...getInputProps()} />
            {fileBlob ? (
              <img
                src={URL.createObjectURL(fileBlob)}
                className="-z-1 max absolute h-[94%] max-w-[92%] object-contain"
              />
            ) : (
              <img
                src={input.file}
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
          <div className="mt-[24px] sm:w-[66%] w-full">
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
                text="Cancel"
                onClick={() => {
                  push(`/${locale}/movie`);
                }}
              />
            </div>
            <div className="">
              <Button text="Update" onClick={onSubmit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
