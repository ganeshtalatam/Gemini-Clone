"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Sidebar from "./dashboard/_components/_SideBar/Sidebar";
import Mainbar from "./dashboard/_components/_Main/Mainbar";
import "@radix-ui/themes/styles.css";
import { useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { db } from "@/utils/db";

export interface UserData {
  createdBy: string;
  formData: string;
}

export default function Home() {
  const { user } = useClerk();
  console.log(user?.firstName, "name>>>");
  console.log("78986>>>");
  const [userData, setUserData] = useState<UserData[]>();
  const getUserData = async () => {
    const usersData = await db.query.GeminiOutput.findMany({
      columns: { createdBy: true, formData: true },
    });
    console.log(userData, "userData>called");
    setUserData(usersData);
  };
  const [isNewChatActive, setIsNewChatActive] = useState(false);
  const handleNewChat = () => {
    setIsNewChatActive(true);
    setTimeout(() => {
      setIsNewChatActive(false);
    }, 2000);
  };

  console.log(isNewChatActive, "Active>>>>");

  return (
    <div className="flex flex-row">
      <Sidebar
        onNewChat={handleNewChat}
        getUserData={getUserData}
        userData={userData}
      />
      <Mainbar isActive={isNewChatActive} getUserData={getUserData} />
    </div>
  );
}
