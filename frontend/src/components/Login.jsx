import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { LoginUser, reset } from "../feature/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (user || isSuccess) {
      navigate("/dashboard");
    }
    dispatch(reset());
  }, [user, isSuccess, navigate, dispatch]);

  const Auth = (e) => {
    e.preventDefault();
    dispatch(LoginUser({ email, password }));
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-1/2 md:w-1/4 h-1/2 bg-gray-200 rounded shadow-md ">
        <form onSubmit={Auth}>
          <div className="flex flex-col items-center justify-center w-full">
            {isError && (
              <p className="text-center text-red-500 mt-2">{message}</p>
            )}
            <h1 className="font-bold text-2xl mt-3">Login</h1>
            <div className="mt-3 flex flex-col gap-2 w-2/3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                id="email"
                className="border-2 border-gray-400 focus:outline-none focus:border-blue-500 px-2 py-1"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-3 flex flex-col gap-2 w-2/3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                id="password"
                placeholder="*******"
                className="border-2 border-gray-400 focus:outline-none focus:border-blue-500 px-2 py-1"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mt-5 w-full flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-400 text-white font-semibold w-2/3 py-2 rounded cursor-pointer"
              >
                {isLoading ? "Loading..." : "Login"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
