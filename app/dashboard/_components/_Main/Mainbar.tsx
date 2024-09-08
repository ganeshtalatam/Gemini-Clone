import React, { useEffect, useState } from "react";
import styles from "./Mainbar.module.css";
import Image, { StaticImageData } from "next/image";
import { assets } from "@/public/assets/assets";
import run from "@/utils/AiModal";
import { db } from "@/utils/db";
import { GeminiOutput } from "@/utils/schema";
import { useClerk, useUser } from "@clerk/nextjs";
import moment from "moment";
import { FaStopCircle } from "react-icons/fa";
import { IoLogOutOutline, IoSend } from "react-icons/io5";
import { TbPhotoPlus } from "react-icons/tb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import templates, { Template } from "@/app/(data)/Templates";
import { MdMic } from "react-icons/md";
import ThemeSwitch from "../ThemeSwitch";
import clsx from "clsx";

// import { chatSession } from "@/utils/AiModal";
// import { templates } from "@/app/(data)/Templates";
// import Templates from "@/app/(data)/Templates";
// import { templates } from "@/app/(data)/Templates";

interface IMainbar {
  getUserData: () => void;
  isActive: Boolean;
}

function Mainbar({ getUserData, isActive }: IMainbar) {
  // console.log(">>> mainbar");
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompt, setPrevPrompts] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState("");
  const { resolvedTheme, theme } = useTheme();

  console.log(theme, "useTheme");

  const { user, isLoaded } = useUser();
  // console.log(isLoaded, user, ">>>>");

  useEffect(() => {
    if (isActive) {
      console.log(isActive, "isActive");
      setShowResult(false);
    }
  }, [isActive]);
  const { signOut } = useClerk();
  const name = user?.firstName;

  const delayPara = (index: any, nextWord: any) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const onSent = async () => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    setRecentPrompt(input);
    setPrevPrompts((prev) => [...prev, input]);

    setInput("");
    const response = await run(input);

    let responseArray = response.split("**");
    let newArray = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newArray += responseArray[i];
      } else {
        newArray += "<b>" + responseArray[i] + "</b>";
      }
    }
    let newArray2 = newArray.split("*").join("</br>");
    let newArray3 = newArray2.split("   ").join("/br");
    let newResponse = newArray3.split(" ");
    for (let i = 0; i < newResponse.length; i++) {
      const nextWord = newResponse[i];
      delayPara(i, nextWord + " ");
    }
    await SaveinDb(recentPrompt, resultData);
    setTimeout(() => {
      getUserData();
    }, 1000);
    setResultData(newArray2);
    setLoading(false);
  };

  const SaveinDb = async (recentPrompt: string, resultData: string) => {
    const resultDb = await db.insert(GeminiOutput).values({
      formData: recentPrompt,
      aiResponse: resultData,
      createdBy: user?.primaryEmailAddress?.emailAddress,
      createdAt: moment().format("DD/MM/YYYY"),
    });
    // console.log("new data added");
  };

  console.log(resolvedTheme, "resolvedTheme-mainbar");

  return (
    <div
      // className={`${resolvedTheme === "light" ? styles.main : styles.darkmain}`}
      className={clsx(styles["main"], styles[`main-${resolvedTheme}`])}

      // className={clsx(styles["main"], styles[`main-dark`])}
    >
      <div className={styles.nav}>
        <p
          className={`${
            resolvedTheme === "light"
              ? styles.geminiText
              : styles.darkgeminiText
          }`}
          onClick={() => setShowResult(false)}
        >
          Gemini
        </p>
        <div className="flex flex-row items-center space-x-4">
          <ThemeSwitch />
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <Avatar className={styles.avatar}>
                <AvatarImage src={user?.imageUrl} />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                {user?.primaryEmailAddress?.emailAddress}
              </DropdownMenuLabel>
              <DropdownMenuItem>
                <IoLogOutOutline />
                <span
                  className={styles.logout}
                  onClick={() => signOut({ redirectUrl: "/" })}
                >
                  LogOut
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className={styles.mainContainer}>
        {!showResult ? (
          <>
            <div className={styles.greet}>
              <span>Hello, {name}!</span>
              <span className="block">How can I help U today?</span>
            </div>
            <div className={styles.cards}>
              {templates.map((item: Template) => (
                <div
                  key={item.name}
                  onClick={() => setInput(item.desc)}
                  className={clsx(
                    styles["card"],
                    styles[`card-${resolvedTheme}`]
                  )}
                >
                  <p>{item.desc}</p>
                  <item.react_icon className={styles.cardicon} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className={styles.resultData}>
            <div className={styles.resultTitle}>
              <Avatar className={styles.avatar}>
                <AvatarImage src={user?.imageUrl} />
              </Avatar>
              <p className={styles.resultPrompt}>{recentPrompt}</p>
            </div>
            <div className={styles.resultScreen}>
              <Image
                className={loading ? styles.geminiIcon : styles.userIcon}
                src={assets.gemini_icon}
                alt="gemini"
              />
              {loading ? (
                <div className={styles.loader}>
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}{" "}
            </div>
          </div>
        )}
        <div className={styles.mainBottom}>
          <div
            className={`${
              resolvedTheme === "light"
                ? styles.searchBox
                : styles.darksearchBox
            }`}
          >
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Enter your prompt here..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSent();
                }
              }}
            />

            <div>
              <TbPhotoPlus className={styles.bottomIcon} />
              <MdMic className={styles.bottomIcon} />

              {/* {loading && <FaStopCircle />} */}
              {(() => {
                if (loading) {
                  return <FaStopCircle className={styles.bottomIcon} />;
                }

                if (input) {
                  return (
                    <IoSend
                      onClick={() => onSent()}
                      className={styles.bottomIcon}
                    />
                  );
                }
                return null;
              })()}
            </div>
          </div>
          <p
            className={clsx(
              styles["bottomInfo"],
              styles[`bottomInfo-${resolvedTheme}`]
            )}
          >
            Gemini may display inaccurate info, including about people, so
            double-check its responses. Your privacy and Gemini Apps
          </p>
        </div>
      </div>
    </div>
  );
}

export default Mainbar;
