import React from "react";

const User = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;

  return (
    <div className="user-overlay">
      <div className="user-content">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        {children}
      </div>
    </div>
  );
};

export default User;
