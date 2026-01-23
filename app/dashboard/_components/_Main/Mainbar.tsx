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

import { UserData } from "@/app/page";

interface IMainbar {
  getUserData: () => void;
  isActive: Boolean;
  selectedChat: UserData | null;
}

function Mainbar({ getUserData, isActive, selectedChat }: IMainbar) {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompt, setPrevPrompts] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const { resolvedTheme, theme } = useTheme();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  
  const timeoutIds = React.useRef<NodeJS.Timeout[]>([]);
  const abortRef = React.useRef(false);

  const name = user?.firstName;

  useEffect(() => {
    return () => {
       timeoutIds.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (selectedChat) {
      setRecentPrompt(selectedChat.formData);
      setResultData(selectedChat.aiResponse);
      setShowResult(true);
      setLoading(false);
      setIsTyping(false);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (isActive) {
      setShowResult(false);
    }
  }, [isActive]);

  const delayPara = (index: number, nextWord: string) => {
    const id = setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
    timeoutIds.current.push(id);
  };

  const stopGeneration = () => {
    if (loading) {
      abortRef.current = true;
      setLoading(false);
    }
    if (isTyping) {
      timeoutIds.current.forEach(clearTimeout);
      timeoutIds.current = [];
      setIsTyping(false);
    }
  };

  const onSent = async () => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    setRecentPrompt(input);
    setPrevPrompts((prev) => [...prev, input]);
    setInput("");
    
    abortRef.current = false;
    timeoutIds.current = [];

    const response = await run(input);

    if (abortRef.current) {
      return; 
    }

    if (!response) return;

    // Format the response:
    // 1. Bold: **text** -> <b>text</b>
    let formatted = response.split("**").map((part, i) => 
        i % 2 === 1 ? `<b>${part}</b>` : part
    ).join("");

    // 2. Newlines: \n -> <br />
    formatted = formatted.replace(/\n/g, "<br />");
    
    // 3. Bullets: *  -> <br />• 
    // Handle specific case where Gemini uses * for bullets
    formatted = formatted.replace(/\* /g, "<br />• ");

    let newResponseArray = formatted.split(" ");
    
    setLoading(false);
    setIsTyping(true);

    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i];
      delayPara(i, nextWord + " ");
    }
    
    // Set final timeout to turn off typing state and SAVE to DB
    const finishId = setTimeout(async () => {
        setIsTyping(false);
        // Save to DB only if fully completed
        await SaveinDb(input, formatted); 
        getUserData();
    }, 75 * newResponseArray.length);
    
    timeoutIds.current.push(finishId);
  };

  const SaveinDb = async (promptText: string, aiResponseText: string) => {
    if (user?.primaryEmailAddress?.emailAddress) {
      await db.insert(GeminiOutput).values({
        formData: promptText,
        aiResponse: aiResponseText,
        createdBy: user?.primaryEmailAddress.emailAddress,
        createdAt: moment().format("DD/MM/YYYY"),
      });
    }
  };

  return (
    <div
      className={clsx(styles["main"], styles[`main-${resolvedTheme}`])}
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

              {(loading || isTyping) ? (
                 <FaStopCircle 
                    className={styles.bottomIcon} 
                    onClick={stopGeneration}
                    cursor="pointer"
                 />
              ) : (input ? (
                    <IoSend
                      onClick={() => onSent()}
                      className={styles.bottomIcon}
                    />
                  ) : null
              )}
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
