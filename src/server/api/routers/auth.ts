import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(6) }))
    .mutation(({ input }) => {
      if (input.email === "test@gmail.com" && input.password === "asdfasdf") {
        return { success: true, message: "Successfully login!" };
      } else {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Wrong Credential!",
        });
      }
    }),
});
