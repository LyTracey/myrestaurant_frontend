import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import { LuMenu } from "react-icons/lu";
import { ReactComponent as SunIcon } from "../images/icons/sun.svg";
import { ReactComponent as MoonIcon } from "../images/icons/moon.svg";
import { AiFillGithub, AiFillLock } from "react-icons/ai";
import { GoStack } from "react-icons/go";
import { BsStars, BsFillQuestionDiamondFill, BsArrowReturnLeft } from "react-icons/bs";
import { HiChatBubbleOvalLeftEllipsis } from "react-icons/hi2";
import { FaFaceDizzy } from "react-icons/fa6";
import { MdSearchOff, MdDelete } from "react-icons/md";
import { BiTimer } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
import { RxCross2, RxCheck } from "react-icons/rx";

const ICONS = {
    "TeaIcon": EmojiFoodBeverageIcon,
    "MenuIcon": LuMenu,
    "SunIcon": SunIcon,
    "MoonIcon": MoonIcon,
    "GithubIcon": AiFillGithub,
    "StackIcon": GoStack,
    "ThoughtIcon": HiChatBubbleOvalLeftEllipsis,
    "StarsIcon": BsStars,
    "OhNoIcon": FaFaceDizzy,
    "NotFoundIcon": MdSearchOff,
    "ThrottledIcon": BiTimer,
    "ForbiddenIcon": AiFillLock,
    "InternalIcon": BsFillQuestionDiamondFill,
    "DeleteIcon": MdDelete,
    "EditIcon": FaEdit,
    "FalseIcon": RxCross2,
    "TrueIcon": RxCheck,
    "ReturnIcon": BsArrowReturnLeft

};

export default ICONS;