import { movieRouter } from "@/server/api/routers/movie";
import { createTRPCRouter } from "@/server/api/trpc";
import { authRouter } from "@/server/api/routers/auth";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  movie: movieRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
