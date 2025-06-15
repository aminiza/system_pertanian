import { Link } from "react-router-dom";
import axiosInstance from "../../axios";
import { useEffect, useState } from "react";
import { FiEdit, FiPlus, FiSearch, FiTrash } from "react-icons/fi";

const LahanList = () => {
  const [lahans, setLahans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getLahan();
  }, []);

  const getLahan = async () => {
    const response = await axiosInstance.get("/lahan");
    setLahans(response.data);
  };
  
  const deleteLahan = async (id) => {
    if (window.confirm("Apakah anda yakin ingin menghapus data lahan?")) {
      try {
        await axiosInstance.delete(`/lahan/${id}`);
        getLahan();
      } catch (error) {
        console.error("Error deleting Lahan:", error);
      }
    }
  };
  return (
    <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="font-bold text-2xl text-gray-800">Lahan Management</h1>
          <p className="text-gray-600">List off all Lahan</p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search Lahan...."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Link
            to="/lahan/add"
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="mr-2" />
            Add Lahan
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {lahans.map((lahan) => (
          <div key={lahan.uuid} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-gray-500 p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {lahan.name}
              </h3>
              <p className="text-sm text-gray-700 truncate">{lahan.alamat}</p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div>
                    <p className="text-xs text-gray-500">Luas</p>
                    <p className="font-medium">{lahan.luas || "-"} Ha</p>
                </div>
                <div className="flex justify-end space-x-2">
                    <Link
                    to={`/lahan/edit/${lahan.uuid}`}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-md text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <FiEdit className="mr-1.5 h-4 w-4" />
                    </Link>

                    <button
                    onClick={() => deleteLahan(lahan.uuid)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-md text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <FiTrash className="mr-1.5 h-4 w-4" />
                    </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LahanList;
