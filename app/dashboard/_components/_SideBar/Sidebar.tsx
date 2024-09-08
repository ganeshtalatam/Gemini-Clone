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
import ThemeSwitch from "../ThemeSwitch";
import { useTheme } from "next-themes";
import { IoMenu, IoSettingsSharp } from "react-icons/io5";
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
            className={styles.icon}
            onClick={handleRefresh}
            src={assets.plus_icon}
            alt="new"
          />
          {!expand ? (
            <span className={styles.newChatText}>New Chat</span>
          ) : null}
        </div>
        {!expand ? (
          <div className={styles.recentEntry}>
            <p className={styles.recentText}>Recent</p>
            {finalDraft?.map((data) => (
              <div key={data} className={styles.recent}>
                <FaRegMessage className={styles.recenticon} />
                {/* <Image
                  className={styles.icon}
                  src={assets.message_icon}
                  alt="msg"
                /> */}
                <p>{data.slice(0, 18)}...</p>
              </div>
            ))}
          </div>
        ) : (
          <FaRegMessage className={styles.recenticon} />
        )}
      </div>
      <div className="bottomSide">
        <div className={styles.recentBottom}>
          {/* <Image
            className={styles.bottomicon}
            src={assets.question_icon}
            alt="qn"
          /> */}
          <IoIosHelpCircleOutline className={styles.bottomicon} />
          {!expand ? <p>Help</p> : null}
        </div>
        <div className={styles.recentBottom}>
          {/* <Image
            className={styles.bottomicon}
            src={assets.history_icon}
            alt="his"
          /> */}
          <MdHistory className={styles.bottomicon} />
          {!expand ? <p>History</p> : null}
        </div>
        <div className={styles.recentBottom}>
          {/* <Image
            className={styles.bottomicon}
            src={assets.setting_icon}
            alt="settings"
          /> */}
          <IoMdSettings className={styles.bottomicon} />
          {!expand ? <p>Settings</p> : null}
          {/* <Image
            src="data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjIwMHB4IiB3aWR0aD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIyIj48L3JlY3Q+PC9zdmc+Cg=="
            width={36}
            height={36}
            sizes="36x36"
            alt="Loading Light/Dark Toggle"
            priority={false}
            title="Loading Light/Dark Toggle"
          /> */}

          {/* <ThemeSwitch /> */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
