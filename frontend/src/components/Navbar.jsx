import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaSearch, FaUserCircle } from "react-icons/fa";
import { reset } from "../feature/authSlice";

const Navbar = ({ sidebarToggle, setSidebarToggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const logout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };
  return (
    <div className={`${sidebarToggle ? "" : "ml-64"}`}>
      <nav
        className="flex justify-between px-3 py-4 bg-gray-800"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="flex items-center text-xl">
          <FaBars
            className="text-white me-4 cursor-pointer"
            onClick={() => setSidebarToggle(!sidebarToggle)}
          />
          <h1 className="font-bold text-white">SIPASTI</h1>
        </div>
        <div className="flex gap-x-5 items-center text-white">
          <div className="relative md:w-55">
            <span className="relative md:absolute inset-y-0 left-0 flex items-center pl-2">
              <button className="p-1 focus:outline-none text-white md:text-black">
                <FaSearch />
              </button>
            </span>
            <input
              type="text"
              className="w-full px-4 py-1 pl-12 rounded shadow outline-none text-black bg-white hidden md:block"
            />
          </div>

          <div className="relative">
            <div className="text-white cursor-pointer group">
              <FaUserCircle className="w-6 h-6 mt-1" />
              <div className="z-10 hidden absolute rounded-lg shadow w-32 group-focus:block top-full right-0 text-black">
                <div  className="p-4 mt-2 space-y-2 font-semibold">
                  <ul>
                    <li>
                      <NavLink to="/">profile</NavLink>
                    </li>
                  </ul>
                  <ul>
                    <li>
                      <button  className="cursor-pointer" onClick={logout}>Logout</button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
