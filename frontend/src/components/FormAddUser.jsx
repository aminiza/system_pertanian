import axiosInstance from "../../axios";
import { useState } from "react";
import { useNavigate } from "react-router";

const FormAddUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const saveUser = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/users", {
        name: name,
        email: email,
        password: password,
        confPassword: confPassword,
        role: role,
      });
      navigate("/users");
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      }
    }  
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Users</h1>
        <h2 className="text-xl font-bold">Add New User</h2>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-red-100 border-1-4 border-red-500 text-red-700">
          <p>{message}</p>
        </div>
      )}

      <form onSubmit={saveUser} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2  focus:outline-none focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email address"
              required
            />
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter Password"
              required
            />
          </div>
          <div>
            <label
              htmlFor="confPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confPassword"
              value={confPassword}
              onChange={(e) => setConfPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter Confirmation Password"
              required
            />
          </div>
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              User Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option>Select Role</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="px-6 py-2 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            Save
          </button>

        </div>
      </form>
    </div>
  );
};

export default FormAddUser;