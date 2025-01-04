import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./navbar-styles.scss";
import { SidebarNavigationProps } from "../../models/components";
import { FilledNotificationsIcon, NotificationsIcon } from "../../assests/images/icons.tsx";
import Button from "../button/Button.tsx";

const Navbar = ({ isMobileView }: SidebarNavigationProps) => {
    const navigate = useNavigate();
    const location = useLocation(); // Hook to get current route

    const handleButtonClick = () => {
      navigate("/logs");
    };
  
    // Conditionally render icon based on the current route
  const isLogsPage = location.pathname === "/logs";

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">
          Trello Application
        </Link>
      </div>

      <div className={`navbar-right ${isMobileView ? "mobile" : ""}`}>
      <Button 
          icon={isLogsPage ? <FilledNotificationsIcon /> : <NotificationsIcon />} // Conditional icon
          variant="tertiary" 
          onClickHandler={handleButtonClick} 
          collapse 
        />
      </div>

    </nav>
  );
};

export default Navbar;
