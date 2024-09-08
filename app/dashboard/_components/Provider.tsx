"use client";

import React from "react";
import { ThemeProvider } from "next-themes";

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" storageKey="gemini-theme">
      {children}
    </ThemeProvider>
  );
};
