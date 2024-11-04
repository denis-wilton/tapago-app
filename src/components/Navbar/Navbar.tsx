import React from "react";
import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="flex justify-around p-2 bg-[rgb(24,112,226)] text-sm">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "text-primary font-bold" : "text-primary"
        }
      >
        clientes
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) =>
          isActive ? "text-primary font-bold" : "text-primary"
        }
      >
        ajuda
      </NavLink>
    </nav>
  );
};

export default Navbar;
