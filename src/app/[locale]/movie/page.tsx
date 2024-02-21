"use client";

import Link from "next/link";
import React from "react";

import { api } from "@/trpc/react";
import { useTranslations } from "next-intl";
import MovieCard, { type Movie } from "@/app/_components/movie-card";
import ReactPaginate from "react-paginate";
import { useParams } from "next/navigation";

export default function MainPage() {
  const [page, setPage] = React.useState(0);
  const getMovie = api.movie.getMovieList.useMutation();

  React.useEffect(() => {
    getMovie.mutate({ page });
  }, [page]);

  if (!getMovie.data || getMovie.isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {getMovie.data?.length === 0 ? (
        <EmptyPage />
      ) : (
        <MovieList
          lists={getMovie.data?.data}
          setPage={setPage}
          itemCount={Math.ceil(getMovie.data?.length / 8)}
          page={page}
        />
      )}
    </div>
  );
}

const MovieList = ({
  lists,
  page,
  setPage,
  itemCount,
}: {
  lists: Movie[];
  page: number;
  setPage: (page: number) => void;
  itemCount: number;
}) => {
  const handlePageClick = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected);
  };

  const searchParams = useParams();

  const locale = searchParams.locale;

  const t = useTranslations("Index");

  return (
    <div className="flex min-h-screen w-full max-w-[1200px] flex-col md:mx-auto">
      <div className="mt-[120px] flex w-full flex-col items-center justify-between text-[48px] md:flex-row">
        <div className="flex">
          {t("My movies")}
          <Link
            href={"/" + locale + "/movie/add"}
            className="flex items-center"
          >
            <img src="/assets/add.svg" className="ml-3" />
          </Link>
        </div>
        <div className="flex items-center">
          <select
            className="mr-3 bg-transparent text-[18px] text-red-400"
            value={locale}
            onChange={(event) => {
              if (typeof window === "undefined") return;
              const language = event.target.value;
              const array = window.location.pathname.split("/");
              array[1] = language;
              window.location.href = array.join("/");
            }}
          >
            <option value={"en"}>EN</option>
            <option value={"fr"}>FR</option>
          </select>
          <Link
            href={"/"}
            className="flex text-[16px]"
            onClick={() => {
              typeof window !== "undefined" &&
                window.localStorage.removeItem("is_login");
            }}
          >
            {t("Logout")} <img src="/assets/logout.svg" className="ml-2" />
          </Link>
        </div>
      </div>
      <div className="mt-[120px] grid gap-[24px] sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {lists.map((item) => (
          <MovieCard key={item.id} movie={item} />
        ))}
      </div>
      <div className="mt-[120px] flex justify-center">
        <ReactPaginate
          breakLabel="..."
          nextLabel="Next"
          onPageChange={handlePageClick}
          pageRangeDisplayed={2}
          pageCount={itemCount}
          previousLabel="Prev"
          className="flex items-center"
          previousLinkClassName="px-3 text-[16px]"
          nextLinkClassName="px-3 text-[16px]"
          pageClassName="px-[12px] py-[4px] bg-[#092C39] mx-[8px] text-[16px] rounded-[4px]"
          activeClassName="bg-[#2BD17E]"
          initialPage={page}
        />
      </div>
    </div>
  );
};

const EmptyPage = () => {
  const searchParams = useParams();

  const locale = searchParams.locale;

  return (
    <div>
      <p className="text-center text-[48px]">Your movie list is empty</p>
      <div className="mt-[40px] flex justify-center">
        <Link
          className="w-[200px] rounded-[10px] bg-[#2BD17E] py-[15px] text-center text-[16px] font-[700] leading-[24px] text-white"
          href={`/${locale}/movie/add`}
        >
          Add a new movie
        </Link>
      </div>
    </div>
  );
};
