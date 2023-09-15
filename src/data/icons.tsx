import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import { LuMenu } from "react-icons/lu";
import { ReactComponent as SunIcon } from "../images/icons/sun.svg";
import { ReactComponent as MoonIcon } from "../images/icons/moon.svg";
import { AiFillGithub, AiFillLock } from "react-icons/ai";
import { GoStack } from "react-icons/go";
// import { TfiThought } from "react-icons/tfi";
import { BsStars, BsFillQuestionDiamondFill } from "react-icons/bs";
import { HiChatBubbleOvalLeftEllipsis } from "react-icons/hi2";
import { FaFaceDizzy } from "react-icons/fa6";
import { MdSearchOff, MdDelete } from "react-icons/md";
import { BiTimer } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";

const ICONS = {
    "tea": EmojiFoodBeverageIcon,
    "menu": LuMenu,
    "sun": SunIcon,
    "moon": MoonIcon,
    "github": AiFillGithub,
    "stack": GoStack,
    "thought": HiChatBubbleOvalLeftEllipsis,
    "stars": BsStars,
    "ohNo": FaFaceDizzy,
    "notFound": MdSearchOff,
    "throttled": BiTimer,
    "forbidden": AiFillLock,
    "internal": BsFillQuestionDiamondFill,
    "delete": MdDelete,
    "edit": FaEdit
};

export default ICONS;