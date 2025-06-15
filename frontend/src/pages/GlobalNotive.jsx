import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearNotif } from "../feature/penggunaanSlice";
import { FiCheckCircle, FiClock, FiX, FiXCircle } from "react-icons/fi";

const GlobalNotif = () => {
  const dispatch = useDispatch();
  const { type, message, visible, persistent } = useSelector(
    (state) => state.notif
  );

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => dispatch(clearNotif()), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message) return null;

  if (!visible) return null;

  const colors = {
    success: {
      border: "border-green-500",
      text: "text-green-500",
      icon: <FiCheckCircle className="h-6 w-6" />,
    },
    error: {
      border: "border-red-500",
      text: "text-red-500",
      icon: <FiXCircle className="h-6 w-6" />,
    },
    info: {
      border: "border-blue-500",
      text: "text-blue-500",
      icon: <FiClock className="h-6 w-6" />,
    },
  };
  const { border, text } = colors[type] || colors.info;
  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`bg-white rounded-lg shadow-lg border-l-4 ${border} w-80`}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className={`flex-shrink-0 ${text}`}>{colors[type].icon}</div>
            <div className="ml-3 flex-1">
              <p className="mt-1 text-md font-semibold text-gray-600">
                {message}
              </p>
            </div>
            {!persistent && (
              <button
                onClick={() => dispatch(clearNotif())}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX className="h-5 w-5" />
              </button>
            )}
          </div>
          <div className="mt-2 flex justify-end">
            <button
              onAbort={() => dispatch(clearNotif())}
              className="text-sm font-medium text-green-600 hover:text-green-500"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalNotif;
