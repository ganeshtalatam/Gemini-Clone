import { assets } from "@/public/assets/assets";
import { StaticImageData } from "next/image";
import { FaYoutube } from "react-icons/fa6";
import { ImCompass2 } from "react-icons/im";
import { IoBulbOutline, IoCodeSlash } from "react-icons/io5";
import { IconType } from "react-icons/lib";

export interface Template {
  name?: string;
  desc: string;
  icon: StaticImageData;
  alt: string;
  react_icon: IconType;
}

const templates = [
  {
    name: "Road-trip",
    desc: "Suggest beautiful places to see on an upcoming road trip",
    icon: assets.compass_icon,
    react_icon: ImCompass2,
    alt: "compass",
  },
  {
    name: "Urban-Planning",
    desc: "Briefly summarize this concept: urban planning",
    icon: assets.lightbulb,
    react_icon: IoBulbOutline,
    alt: "bulb",
  },
  {
    name: "Work-retreat",
    desc: "Brainstorm team bonding activities for our work retreat",
    icon: assets.youtube_icon,
    react_icon: FaYoutube,
    alt: "youtube",
  },
  {
    name: "React",
    desc: "Tell me about React js and React native",
    icon: assets.code_icon,
    react_icon: IoCodeSlash,
    alt: "code",
  },
];

export default templates;
