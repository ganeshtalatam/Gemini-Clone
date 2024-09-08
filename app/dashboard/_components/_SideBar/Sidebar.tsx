"use client";
import { assets } from "@/public/assets/assets";
import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import styles from "./Sidebar.module.css";
import { db } from "@/utils/db";
import { GeminiOutput } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm/sql/expressions";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { IoMdMenu } from "react-icons/io";
import { FaRegMessage } from "react-icons/fa6";
import { MdHistory } from "react-icons/md";
import { IoIosHelpCircleOutline, IoMdSettings } from "react-icons/io";
import { UserData } from "@/app/page";
import { date } from "drizzle-orm/mysql-core";
// import { mainData } from "./SideBarData";

interface Props {
  getUserData: () => void;
  userData: UserData[] | undefined;
  onNewChat: () => void;
}

const Sidebar = ({ getUserData, userData, onNewChat }: Props) => {
  const { user } = useUser();
  const mail = user?.primaryEmailAddress?.emailAddress;
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    getUserData();
  }, []);

  const handleRefresh = () => {
    router.refresh();
  };
  const [expand, setExpand] = useState(true);

  // MainData();

  const primaryData = userData?.map((d) =>
    d.createdBy === mail ? d.formData : ""
  );

  const finalDraft = primaryData?.filter((d) => d !== "");
  const dataLength = finalDraft?.length;
  // if (!mounted)
  return (
    <div
      className={`${theme === "light" ? styles.sideBar : styles.sideBarDark}`}
    >
      <div className="sideBarTop">
        <div
          className={styles.menuButton}
          onClick={() => setExpand((prev) => !prev)}
        >
          <IoMdMenu className={styles.menuicon} />
        </div>
        <div className={styles.newChat} onClick={onNewChat}>
          <Image
            className={styles.addicon}
            onClick={handleRefresh}
            src={assets.plus_icon}
            alt="new"
          />
          {!expand ? (
            <span className={styles.newChatText}>New Chat</span>
          ) : null}
        </div>
        {/* {!expand ? ( */}
        <div className={styles.recentEntry}>
          {!expand ? <p className={styles.recentText}>Recent</p> : null}
          {finalDraft?.map((data) => (
            <div key={data} className={styles.recent}>
              <FaRegMessage className={styles.recenticon} />
              {!expand ? <p>{data.slice(0, 18)}...</p> : null}
            </div>
          ))}
        </div>
      </div>
      <div className="bottomSide">
        <div className={styles.recentBottom}>
          <IoIosHelpCircleOutline className={styles.bottomicon} />
          {!expand ? <p>Help</p> : null}
        </div>
        <div className={styles.recentBottom}>
          <MdHistory className={styles.bottomicon} />
          {!expand ? <p>History</p> : null}
        </div>
        <div className={styles.recentBottom}>
          <IoMdSettings className={styles.bottomicon} />
          {!expand ? <p>Settings</p> : null}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
