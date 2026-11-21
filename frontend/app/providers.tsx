"use client";

import { ReactNode } from "react";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { ApiError, isUnauthorized } from "@/lib/api";
import { endSession } from "@/lib/session";

const handleError = (error: Error) => {
  if (isUnauthorized(error)) void endSession();
};

const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: handleError }),
  mutationCache: new MutationCache({ onError: handleError }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error) =>
        !(
          error instanceof ApiError &&
          error.status !== null &&
          error.status < 500
        ) && failureCount < 3,
    },
  },
});

const Providers = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  </QueryClientProvider>
);

export default Providers;
