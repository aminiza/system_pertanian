import { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { FiArrowLeft, FiEdit, FiPlus, FiSearch, FiTrash } from "react-icons/fi";
import { useSelector } from "react-redux";

const ListPenggunaanPupuk = () => {
  const [penggunaan, setPenggunaan] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    getPenggunaan();
  }, []);

  const getPenggunaan = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/penggunaan?status=approve");
      setPenggunaan(response.data);

      if (response.data.length === 0) {
        setMessage({
          type: "error",
          text: "Tidak ada data yang ditemukan dalam filter ini",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Data anda belum ada",
      });
      console.error("Error fetching pengeluaran:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePenggunaan = async (id) => {
    if (
      window.confirm("Apakah anda yakin ingin menghapus data penggunaan pupuk?")
    ) {
      try {
        await axiosInstance.delete(`/penggunaan/${id}`);
        getPenggunaan();
      } catch (error) {
        console.error("Error deleting pengeluaran:", error);
      }
    }
  };

  const filteredPenggunaan = penggunaan.filter(
    (item) =>
      item.tanggal_penggunaan
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.lahan.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pupuk.nama_pupuk?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lahan.user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="font-bold text-2xl text-gray-800">
            Management Penggunaan pupuk
          </h1>
          <p className="text-gray-600">Daftar seluruh penggunaan pupuk</p>
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

          <div className="flex gap-3">
            <Link
              to="/pupuk"
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Select pupuk
            </Link>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-md ${
            message.type === "error"
              ? "bg-red-100 border-red-500 text-red-700"
              : "bg-green-100 border-green-500 text-green-700"
          }`}
        >
          <p>{message.text}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
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
                    Nama & Lokasi
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Luas lahan
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nama pupuk
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Jumlah
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tanggal penggunaan
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nama pengelola
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPenggunaan.length > 0 ? (
                  filteredPenggunaan.map((item, index) => (
                    <tr key={item.uuid} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.lahan.name}
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.lahan.alamat}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.lahan.luas} Ha
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.pupuk.nama_pupuk} - {item.pupuk.kandungan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.jumlah}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dayjs(item.tanggal_penggunaan).format("DD-MM-YYYY")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.lahan.user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex justify-end space-x-3">
                          {user?.role === "Admin" ? (
                            <>
                              <Link
                                to={`/penggunaan-pupuk/edit/${item.uuid}`}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit"
                              >
                                <FiEdit className="w-5 h-5" />
                              </Link>
                              <button
                                onClick={() => deletePenggunaan(item.uuid)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <FiTrash className="h-5 w-5" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => deletePenggunaan(item.uuid)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <FiTrash className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      {penggunaan.length > 0
                        ? "Sedang memuat data..."
                        : "Tidak ada data yang sesuai dengan pencarian"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ListPenggunaanPupuk;
