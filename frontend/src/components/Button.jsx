import React from "react";
import { useNavigate } from "react-router";

const Button = ({ props }) => {
    const { onClick, children, type} = props;
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer`}
    >
      {children}
    </button>
  );
};

export default Button;
