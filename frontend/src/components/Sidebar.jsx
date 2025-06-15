import React from "react";
import { NavLink, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { IoPerson, IoHome, IoLogOut, IoCalendar } from "react-icons/io5";
import { GiFertilizerBag } from "react-icons/gi";
import { LogOut, reset } from "../feature/authSlice";
import { LuLandPlot, LuFolderOutput } from "react-icons/lu";
import { FaMoneyCheck } from "react-icons/fa";

const Sidebar = ({ sidebarToggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/login");
  };
  return (
    <div
      className={`w-64 bg-gray-800 fixed h-full px-4 py-2 transition-transform duration-300 overflow-y-auto ${
        sidebarToggle ? "-ml-64" : "block"
      }`}
    >
      <div className="my-2 mb-4">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      </div>
      <hr />
      <ul className="mt-3 text-white font-bold">
        <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2 px-1">
          <NavLink to="/dashboard">
            <IoHome className="inline-block w-6 h-6 mr-2 -mt-2" /> Home
          </NavLink>
        </li>
      </ul>
      <ul className="mt-3 text-white font-bold">
        <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2 px-1">
          <NavLink to="/jadwal">
            <IoCalendar className="inline-block w-6 h-6 mr-2 -mt-2" /> Jadwal
            Tanam
          </NavLink>
        </li>
      </ul>
      <ul className="mt-3 text-white font-bold">
        <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2 px-1">
          <NavLink to="/lahan">
            <LuLandPlot className="inline-block w-6 h-6 mr-2 -mt-2" /> Lahan
          </NavLink>
        </li>
      </ul>
      {user && user.role === "Admin" && (
        <>
          <ul className="mt-3 text-white font-bold">
            <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2 px-1">
              <NavLink to="/users">
                <IoPerson className="inline-block w-6 h-6 mr-2 -mt-2" /> Users
              </NavLink>
            </li>
          </ul>
          <ul className="mt-3 text-white font-bold">
            <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2 px-1">
              <NavLink to="/pengeluaran">
                <FaMoneyCheck className="inline-block w-6 h-6 mr-2 -mt-2" /> All
                Pengeluaran
              </NavLink>
            </li>
          </ul>
          <ul className="mt-3 text-white font-bold">
            <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2 px-1">  
              <NavLink to="/penggunaan-pupuk">
                <LuFolderOutput className="inline-block w-6 h-6 mr-2 -mt-2" />
                Penggunaan pupuk
              </NavLink>
            </li>
          </ul>
        </>
      )}
      <ul className="mt-3 text-white font-bold">
        <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2 px-1">
          <NavLink to="/pupuk">
            <GiFertilizerBag className="inline-block w-6 h-6 mr-2 -mt-2" />{" "}
            Pupuk
          </NavLink>
        </li>
      </ul>
      <div className="absolute left-0 right-0 bottom-0 w-64 px-4 py-2">
        <hr />
        <ul className="mt-3 text-white font-bold">
          <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2 px-1">
            <button onClick={logout}>
              <IoLogOut className="inline-block w-6 h-6 mr-2 -mt-2" /> Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
