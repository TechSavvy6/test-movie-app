import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { uploadSingleImage } from "@/utils/aws";
import { TRPCError } from "@trpc/server";

export const movieRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        year: z.number().min(1900),
        file: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const fileLink = await uploadSingleImage(input.file);

      return ctx.db.movie.create({
        data: {
          title: input.title,
          postImage: fileLink,
          publishYear: input.year,
        },
      });
    }),

  getMovieList: publicProcedure
    .input(z.object({ page: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.db.movie.findMany({
        skip: 8 * input.page,
        take: 8,
      });
      const length = await ctx.db.movie.count();
      return { data, length };
    }),

  getMovieDetail: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.movie.findUnique({ where: { id: input.id } });
    }),

  updateMovie: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        year: z.number().min(1900),
        file: z.string(),
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const movieModel = await ctx.db.movie.findUnique({
        where: { id: input.id },
      });
      if (!movieModel) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Can't find the specified movie!",
        });
      }

      if (movieModel.postImage === input.file) {
        input.file = await uploadSingleImage(input.file);
      }

      return ctx.db.movie.update({
        where: { id: input.id },
        data: {
          postImage: input.file,
          publishYear: input.year,
          title: input.title,
        },
      });
    }),
});
