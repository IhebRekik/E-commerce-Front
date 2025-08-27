import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";
import { HeartIcon } from "@heroicons/react/24/solid";

export function Footer({ brandName, brandLink, routes }) {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl shadow-md">
      
    </footer>
  );
};

Footer.displayName = "/src/widgets/layout/footer.jsx";

export default Footer;
