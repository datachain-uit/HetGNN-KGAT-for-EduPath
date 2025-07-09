import React from "react";
import { MoreHorizontal } from "lucide-react";
import "../../styles/Header.css";

const Header = ({ title = "OVERVIEW" }) => {
  return (
    <header className="main-header">
      {/* Nền từ 240px trở đi */}
      <div className="header-background" />

      {/* Title */}
      <div className="header-title">
        {title}
      </div>

      {/* More button + Avatar Group */}
      <div className="header-controls">
        {/* More Button */}
        <button className="more-button">
          <MoreHorizontal size={24} color="#000" />
        </button>

        {/* Avatar */}
        <div className="avatar-container">
          <img
            src="https://i.pravatar.cc/40"
            alt="User avatar"
            className="avatar-image"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;