"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Sidebar from "./dashboard/_components/_SideBar/Sidebar";
import Mainbar from "./dashboard/_components/_Main/Mainbar";
import "@radix-ui/themes/styles.css";
import { useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import { GeminiOutput } from "@/utils/schema";

export interface UserData {
  id: number;
  createdBy: string;
  formData: string;
  aiResponse: string;
}

export default function Home() {
  const { user } = useClerk();
  // console.log(user?.firstName, "name>>>");
  // console.log("78986>>>");
  const [userData, setUserData] = useState<UserData[]>();
  const [selectedChat, setSelectedChat] = useState<UserData | null>(null);

  const getUserData = async () => {
    const usersData = await db.query.GeminiOutput.findMany({
      columns: { id: true, createdBy: true, formData: true, aiResponse: true },
      orderBy: (posts, { desc }) => [desc(posts.id)],
    });
    console.log(usersData, "userData>called");
    // @ts-ignore
    setUserData(usersData);
  };
  const [isNewChatActive, setIsNewChatActive] = useState(false);
  const handleNewChat = () => {
    setIsNewChatActive(true);
    setSelectedChat(null);
    setTimeout(() => {
      setIsNewChatActive(false);
    }, 2000);
  };

  console.log(isNewChatActive, "Active>>>>");

  const handlePromptSelect = (chat: UserData) => {
    setSelectedChat(chat);
  }

  const handleDeleteChat = async (id: number) => {
    await db.delete(GeminiOutput).where(eq(GeminiOutput.id, id));
    getUserData();
  }

  const handleRenameChat = async (id: number, newTitle: string) => {
    await db.update(GeminiOutput).set({ formData: newTitle }).where(eq(GeminiOutput.id, id));
    getUserData();
  }

  return (
    <div className="flex flex-row">
      <Sidebar
        onNewChat={handleNewChat}
        getUserData={getUserData}
        userData={userData}
        onPromptSelect={handlePromptSelect}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
        selectedChat={selectedChat}
      />
      <Mainbar 
        isActive={isNewChatActive} 
        getUserData={getUserData} 
        selectedChat={selectedChat}
      />
    </div>
  );
}
