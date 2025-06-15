import { useEffect, useState } from "react";
import {
  FiDroplet,
  FiEdit,
  FiPlus,
  FiSearch,
  FiTrash,
  FiTrendingUp,
} from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import axiosInstance from "../../axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const PupukList = () => {
  const [pupuk, setPupuk] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    getPupuk();
  }, []);

  const getPupuk = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/pupuk");
      setPupuk(response.data);
    } catch (error) {
      console.error("Error fetching pupuk:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPupuk = pupuk.filter(
    (item) =>
      item.nama_pupuk?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kandungan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deletePupuk = async (id) => {
    if (window.confirm("Apakah anda yakin ingin menghapus data pupuk?")) {
      try {
        await axiosInstance.delete(`/pupuk/${id}`);
        getPupuk();
      } catch (error) {
        console.error("Error deleting pupuk:", error);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white shadow-md rounded-xl overflow-hidden p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="font-bold text-2xl text-gray-800">
              <FiDroplet className="mr-2" />
              Pupuk
            </h1>
            <p className="text-gray-600">
              Daftar stok dan informasi pupuk pertanian
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search Pupuk...."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {user && user.role === "Admin" ? (
              <Link
                to="/pupuk/add"
                className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FiPlus className="mr-2" />
                Add Pupuk
              </Link>
            ) : (
              <Link
                to="/pengeluaran/add"
                className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FiPlus className="mr-2" />
                Add Pengajuan pengeluaran
              </Link>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gree-50 p-4 rounded-lg border border-green-100">
                <h3 className="text-sm font-medium text-green-800">
                  Total Jenis Pupuk
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {filteredPupuk.length}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounde-lg border border-blue-100">
                <h3 className="text-sm font-medium text-blue-800">
                  Total Stok Tersedia
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  {filteredPupuk.reduce(
                    (sum, item) => sum + (item.kuantitas || 0),
                    0
                  )}{" "}
                  Bag
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <h3 className="text-sm font-medium text-purple-800">
                  Nilai Total Stok
                </h3>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(
                    filteredPupuk.reduce(
                      (sum, item) =>
                        sum + (item.kuantitas || 0) * (item.harga || 0),
                      0
                    )
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredPupuk.length > 0 ? (
                filteredPupuk.map((item) => (
                  <div
                    key={item.uuid}
                    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 border-b border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {item.nama_pupuk}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.kandungan}
                          </p>
                        </div>
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                          {item.kuantitas} Bag
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Harga per Kg</p>
                          <p className="font-medium">
                            {formatCurrency(item.harga / 60)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Nilai Stok</p>
                          <p className="font-medium">
                            {formatCurrency(item.kuantitas * item.harga)}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4">
                        {item.deskripsi}
                      </p>
                      {user && user.role === "Admin" ? (
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            <Link
                              to={`/pupuk/edit/${item.uuid}`}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit"
                            >
                              <FiEdit className="h-5 w-5" />
                            </Link>

                            <button
                              onClick={() => deletePupuk(item.uuid)}
                              className="text-red-500 hover:text-red-800"
                              title="Delete"
                            >
                              <FiTrash className="w-5 h-5" />
                            </button>
                          </div>
                          <Link
                            to="/penggunaan-pupuk/add"
                            onClick={() => {
                              sessionStorage.setItem(
                                "selectedPupuk",
                                JSON.stringify({
                                  uuid: item.uuid,
                                  nama_pupuk: item.nama_pupuk,
                                  kandungan: item.kandungan,
                                })
                              );
                            }}
                            className="flex items-center text-sm text-green-600 hover:text-green-800"
                          >
                            <FiTrendingUp className="mr-1" />
                            Catat Penggunaan
                          </Link>
                        </div>
                      ) : (
                        <Link
                          to="/penggunaan-pupuk/add"
                          onClick={() => {
                            sessionStorage.setItem(
                              "selectedPupuk",
                              JSON.stringify({
                                uuid: item.uuid,
                                nama_pupuk: item.nama_pupuk,
                                kandungan: item.kandungan,
                              })
                            );
                          }}
                          className="flex items-center text-sm text-green-600 hover:text-green-800"
                        >
                          <FiTrendingUp className="mr-1" />
                          Catat Penggunaan
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-3 text-sm font-medium text-gray-900">
                    {searchTerm
                      ? "Tidak ada pupuk yang cocok"
                      : "Belum ada data pupuk"}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm
                      ? "Coba dengan kata kunci lain"
                      : "Tambahkan pupuk terlebih dahulu baru untuk memulai"}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
        {user?.role !== "Admin" && (
          <div className="fixed bottom-4 right-6 z-10">
            <Link
              to="/penggunaan-pupuk"
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors shadow-lg"
            >
              <IoIosArrowForward className="mr-2" />
              List Penggunaan pupuk
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PupukList;
