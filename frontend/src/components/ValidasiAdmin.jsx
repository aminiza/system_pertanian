import { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import { FiCheck, FiClock, FiX } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { showNotif } from "../feature/penggunaanSlice";
import dayjs from "dayjs";

const ValidasiAdmin = () => {
  const [pendingData, setPendingData] = useState([]);
  const [loading, setIsLoasing] = useState(true);
  const dispatch = useDispatch({});

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await axiosInstance.get("/penggunaan?status=pending");
        setPendingData(res.data);
      } catch (error) {
        console.error("Gagal memuat data pending", error);
      } finally {
        setIsLoasing(false);
      }
    };
    fetchPending();
  }, []);

  const handleValidasi = async (id, status) => {
    try {
      await axiosInstance.patch(`/penggunaan/${id}/validasi`, { status });
      setPendingData((prev) => prev.filter((item) => item.uuid !== id));

      dispatch(
        showNotif({
          type: `${status === "approve" ? "success" : "error"}`,
          message: `Penggunaan pupuk berhasil di${
            status === "approve" ? "validasi" : "tolak"
          }`,
        })
      );
    } catch (error) {
      console.error("Gagal memvalidasi data", error);
    }
  };

  if (loading) return <p>Loading....</p>;
  if (pendingData.length === 0)
    return <p>Tidak ada data yang menunggu validasi</p>;
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 flex items-center text-yellow-600">
        <FiClock className="mr-2" /> validasi permintaan penggunaan pupuk
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pendingData.map((item) => (
          <div
            key={item.uuid}
            className="p-3 bg-white rounded shadow-md border border-yellow-400"
          >
            <h2 className="text-md font-semibold text-gray-800 flex justify-end mb-3">
              {dayjs(item.tanggal_penggunaan).format("DD-MM-YYYY")}
            </h2>
            <p className="mb-1 font-semibold text-gray-700">
              <strong>
                Lahan & luas <span className="text-gray-500 mr-2">:</span>
              </strong>
              {item?.lahan.name} - {item?.lahan.luas} Ha
            </p>
            <p className="mb-1 font-semibold text-gray-700">
              <strong>
                Pupuk <span className="text-gray-500 mr-2">:</span>
              </strong>
              {item?.pupuk.nama_pupuk}
            </p>
            <p className="mb-1 font-semibold text-gray-700">
              <strong>
                Jumlah <span className="text-gray-500 mr-2">:</span>
              </strong>
              {item?.jumlah}
            </p>
            <div className="flex gap-2 mt-3">
              <button
                className="bg-green-600 text-white px-4 py-1 rounded flex items-center"
                onClick={() => handleValidasi(item.uuid, "approve")}
              >
                <FiCheck className="mr-1" /> Validasi
              </button>
              <button
                className="bg-red-600 text-white px-4 py-1 rounded flex items-center"
                onClick={() => handleValidasi(item.uuid, "rejected")}
              >
                <FiX className="mr-1" /> Tolak
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValidasiAdmin;
