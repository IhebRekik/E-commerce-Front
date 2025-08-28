// src/routes.jsx
import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import { Home, Users, Historique, Confirmation, Delivered } from "@/pages/dashboard";
import { getToken2 } from "@/configs";

const icon = { className: "w-5 h-5 text-inherit" };

// Base pages for all users
const basePages = [
  { icon: <HomeIcon {...icon} />, name: "home", path: "/", element: <Home /> },
  { icon: <TableCellsIcon {...icon} />, name: "Confirmation", path: "/confirmation", element: <Confirmation /> },
  { icon: <ClockIcon {...icon} />, name: "Historique", path: "/historique", element: <Historique /> },
  { icon: <CheckCircleIcon {...icon} />, name: "Delivery", path: "/delivery", element: <Delivered /> },
];

// Function to generate routes dynamically
export function getRoutes() {
  let pages = [...basePages];

  // Add admin-only page if token === "admin"
  const token = getToken2(); // evaluated at runtime
  if (token === "admin") {
    pages.push({
      icon: <UserCircleIcon {...icon} />,
      name: "Users",
      path: "/users",
      element: <Users />,
    });
  }

  return [{ layout: "dashboard", pages }];
}

// Default export for convenience
export default getRoutes;
