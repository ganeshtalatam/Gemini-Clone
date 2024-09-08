import { db } from "@/utils/db";
import React from "react";

export const mainData = async () => {
  const usersData = await db.query.GeminiOutput.findMany({
    columns: { createdBy: true, aiResponse: true },
  });

  // backgroundColor: `${theme === "light" ? "#f0f4f9" : "#1e1f20"}`
};
