import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import { Home, Users, Historique, Confirmation, Delivered } from "@/pages/dashboard";
import { getToken2 } from "./configs";
import { SignUp } from "./pages/auth";
import { PlusCircle } from "lucide-react";

const icon = {
  className: "w-5 h-5 text-inherit",
};

const basePages = [
  {
    icon: <HomeIcon {...icon} />,
    name: "dashboard",
    path: "/",
    element: <Home />,
  },
  {
    icon: <TableCellsIcon {...icon} />,
    name: "Confirmation",
    path: "/confirmation",
    element: <Confirmation />,
  },
  {
    icon: <ClockIcon {...icon} />,
    name: "Historique",
    path: "/historique",
    element: <Historique />,
  },
  {
    icon: <CheckCircleIcon {...icon} />,
    name: "Delivery",
    path: "/delivery",
    element: <Delivered />,
  },
];

export const routes = [
  {
    layout: "dashboard",
    pages: [
      ...basePages,
      ...(getToken2() === "admin" ? [{ icon: <UserCircleIcon {...icon} />, name: "users", path: "/users", element: <Users /> }] : []),
      ...(getToken2() !== "admin" && getToken2() !== "user"
        ? [
            { icon: <UserCircleIcon {...icon} />, name: "users", path: "/users", element: <Users /> },
            { name: "", path: "/sign-up", element: <SignUp /> },
          ]
        : []),
    ],
  },
];

export default routes;
