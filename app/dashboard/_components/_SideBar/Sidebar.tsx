"use client";
import React, { useEffect, useState } from "react";
import { assets } from "@/public/assets/assets";
import Image from "next/image";
import styles from "./Sidebar.module.css";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { IoMdMenu } from "react-icons/io";
import { FaRegMessage } from "react-icons/fa6";
import { MdHistory, MdDeleteOutline, MdMoreVert, MdPushPin, MdDriveFileRenameOutline, MdDelete } from "react-icons/md";
import { IoIosHelpCircleOutline, IoMdSettings, IoMdArrowDropright } from "react-icons/io";
import { UserData } from "@/app/page";
import clsx from "clsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  getUserData: () => void;
  userData: UserData[] | undefined;
  onNewChat: () => void;
  onPromptSelect: (chat: UserData) => void;
  onDeleteChat: (id: number) => void;
  onRenameChat: (id: number, newTitle: string) => void;
  selectedChat?: UserData | null;
}

const Sidebar = ({ getUserData, userData, onNewChat, onPromptSelect, onDeleteChat, onRenameChat, selectedChat }: Props) => {
  const { user } = useUser();
  const mail = user?.primaryEmailAddress?.emailAddress;
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  
  // Collapse state for sections
  const [expand, setExpand] = useState(true);

  // Rename Dialog State
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [currentChatToRename, setCurrentChatToRename] = useState<UserData | null>(null);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    setMounted(true);
    getUserData();
  }, []);

  const handleRefresh = () => {
    router.refresh();
  };

  const openRenameDialog = (chat: UserData) => {
      setCurrentChatToRename(chat);
      setNewTitle(chat.formData);
      setShowRenameDialog(true);
  };

  const handleRenameSubmit = () => {
      if (currentChatToRename && newTitle.trim()) {
          onRenameChat(currentChatToRename.id, newTitle);
          setShowRenameDialog(false);
      }
  };

  // Filter data for the current user
  const userChats = userData?.filter((d) => d.createdBy === mail) || [];

  return (
    <div
      className={clsx(
        theme === "light" ? styles.sideBar : styles.sideBarDark,
        !expand && styles.collapsed
      )}
    >
      <div className={styles.sideBarTop}>
        <div
          className={styles.menuButton}
          onClick={() => setExpand((prev) => !prev)}
        >
          <IoMdMenu className={styles.menuicon} />
        </div>
        
        <div 
            className={clsx(styles.newChat, !expand && styles.newChatCollapsed)} 
            onClick={onNewChat}
        >
          <div className="flex items-center gap-3">
            <Image
                className={styles.addicon}
                src={assets.plus_icon}
                alt="new"
            />
            {expand && <span className={styles.newChatText}>New chat</span>}
          </div>
        </div>

        {/* {expand && (
            <div className={styles.navSection}>
                <div className={styles.sectionItem}>
                    <span>My stuff</span>
                    <IoMdArrowDropright />
                </div>
                <div className={styles.sectionItem}>
                    <span>Gems</span>
                    <IoMdArrowDropright />
                </div>
            </div>
        )} */}

        <div className={styles.recentEntry}>
          {expand && <p className={styles.sectionTitle}>Chats</p>}
          
          {userChats.map((chat, index) => {
            const isActive = selectedChat?.id === chat.id;
            return (
                <div 
                  key={index} 
                  className={clsx(styles.recent, isActive && styles.active)}
                  onClick={() => onPromptSelect(chat)}
                >
                  <div className="flex items-center gap-2 overflow-hidden w-full">
                    {/* {!expand ? <FaRegMessage className={styles.recenticon} /> : null} */}
                    
                    {expand && (
                        <p className="truncate w-full text-nowrap">
                            {chat.formData}
                        </p>
                    )}
                  </div>
                  
                  {expand && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div 
                                className={styles.menuTrigger}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MdMoreVert />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                <MdPushPin className="mr-2 h-4 w-4" />
                                <span>Pin</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                openRenameDialog(chat);
                            }}>
                                <MdDriveFileRenameOutline className="mr-2 h-4 w-4" />
                                <span>Rename</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteChat(chat.id);
                                }}
                                className="text-red-500 focus:text-red-500"
                            >
                                <MdDelete className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
            );
          })}
        </div>
      </div>

      <div className={styles.bottomSide}>
        <div className={styles.recentBottom}>
            <IoIosHelpCircleOutline className={styles.bottomicon} />
            {expand && <p>Help</p>}
        </div>
        <div className={styles.recentBottom}>
            <MdHistory className={styles.bottomicon} />
             {expand && <p>Activity</p>}
        </div>
        <div className={styles.recentBottom}>
            <IoMdSettings className={styles.bottomicon} />
             {expand && <p>Settings</p>}
        </div>
      </div>

      {showRenameDialog && (
          <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                  <h3 className={styles.modalTitle}>Rename this chat</h3>
                  <input 
                      type="text" 
                      className={styles.modalInput}
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      autoFocus
                  />
                  <div className={styles.modalActions}>
                      <button 
                          className={styles.cancelBtn}
                          onClick={() => setShowRenameDialog(false)}
                      >
                          Cancel
                      </button>
                      <button 
                          className={styles.renameBtn}
                          onClick={handleRenameSubmit}
                      >
                          Rename
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Sidebar;
