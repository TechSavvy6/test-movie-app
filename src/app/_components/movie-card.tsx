import React from "react";
import { useParams, useRouter } from "next/navigation";

export interface Movie {
  id: string;
  title: string;
  publishYear: number;
  postImage: string;
}

export default function MovieCard({ movie }: { movie: Movie }) {
  const {push} = useRouter();

  const searchParams = useParams();

  const locale = searchParams.locale;
  
  return (
    <div className="bg-[#092C39] px-[8px] pt-[8px] pb-[16px] rounded-[12px] cursor-pointer hover:-translate-y-2 transition-all min-w-[200px]" onClick={() => {
      push(`/${locale}/movie/` + movie.id);
    }}>
      <img src={movie.postImage} className="rounded-[12px] w-full object-cover h-[400px]" alt="card-image" />
      <p className="mt-[16px] text-[20px]">{movie.title}</p>
      <p className="text-[14px] mt-[8px]">{movie.publishYear}</p>
    </div>
  );
}


