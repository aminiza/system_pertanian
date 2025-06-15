import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import { FiSearch, FiPlus, FiEdit, FiTrash, FiCalendar } from "react-icons/fi";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const JadwalTanamList = () => {
  const [jadwalTanam, setJadwalTanam] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getJadwalTanam();
  }, []);

  const getJadwalTanam = async () => {
    const response = await axiosInstance.get("/jadwal");
    setJadwalTanam(response.data);
  };

  const deleteJadwal = async (id) => {
    if (window.confirm("Apakah anda yakin ingin menghapus data jadwal tanam?")) {
      try {
        await axiosInstance.delete(`/jadwal/${id}`);
        getJadwalTanam();
      } catch (error) {
        console.error("Error deleting jadwal tanam:", error);
      }
    }
  };
  return (
    <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="font-bold text-2xl text-gray-800 flex items-center">
            <FiCalendar className="mr-2" />
            Jadwal Tanam
          </h1>
          <p className="text-gray-600">Daftar seluruh jadwal tanam</p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search Jadwal...."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Link
            to="/jadwal/add"
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="mr-2" />
            Add Jadwal
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                No
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Lahan
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tanaman
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tanggal Tanam
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Estimasi Panen
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jadwalTanam.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {index + 1}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {item.lahan.name || "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {item.jenis_tanaman || "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {dayjs(item.tanggal_tanam).format("DD-MM-YYYY") || "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {dayjs(item.tanggal_panen).format("DD-MM-YYYY") || "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex justify-end space-x-3 md:mr-6 lg:mr-10">
                    <Link
                      to={`/jadwal/edit/${item.uuid}`}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit"
                    >
                      <FiEdit className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => deleteJadwal(item.uuid)}
                      title="Delete"
                      className="text-red-600 hover:text-red-900 "
                    >
                      <FiTrash className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JadwalTanamList;
