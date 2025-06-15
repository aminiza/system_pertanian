import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios";
import { useDispatch } from "react-redux";
import { showNotif } from "../feature/penggunaanSlice";

const FormAddJadwal = () => {
  const [lahanId, setLahanId] = useState("");
  const [tanggalTanam, setTanggalTanam] = useState("");
  const [jenisTanaman, setJenisTanaman] = useState("");
  const [tanggalPanen, setTanggalPanen] = useState("");
  const [message, setMessage] = useState("");
  const [lahans, setLahans] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const saveJadwalTanam = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/jadwal", {
        lahanId: lahanId,
        jenis_tanaman: jenisTanaman,
        tanggal_tanam: tanggalTanam,
        tanggal_panen: tanggalPanen,
      });

      dispatch(
        showNotif({
          type: "info",
          message: "Jadwal tanam berhasil ditambahkan",
        })
      );
      setTimeout(() => {
        navigate("/jadwal");
      }, 3000);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    getDropDownLahan();
  }, []);

  const getDropDownLahan = async () => {
    const response = await axiosInstance.get(
      "/jadwal/lahan/dropdown"
    );
    setLahans(response.data.dropdown);
    console.log(response.data.dropdown);
  };
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Jadwal Tanam</h1>
        <h2 className="text-xl font-bold">Add New Jadwal Tanam</h2>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-red-100 border-1-4 border-red-500 text-red-700">
          <p>{message}</p>
        </div>
      )}

      <form onSubmit={saveJadwalTanam} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label
              htmlFor="lahan"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pilih lahan
            </label>
            <select
              id="lahan"
              value={lahanId}
              onChange={(e) => setLahanId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Lahan</option>
              {lahans.map((lahan) => (
                <option key={lahan.value} value={lahan.value}>
                  {lahan.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="jenis_tanaman"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Jenis Tanaman
            </label>
            <input
              type="text"
              id="jenis_tanaman"
              value={jenisTanaman}
              onChange={(e) => setJenisTanaman(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2  focus:outline-none focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter Jenis Tanaman"
              required
            />
          </div>
          <div>
            <label
              htmlFor="tanggal_tanam"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tanggal Tanam
            </label>
            <input
              type="date"
              id="tanggal_tanam"
              value={tanggalTanam}
              onChange={(e) => setTanggalTanam(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter Tanggal tanam"
              required
            />
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tanggal Panen
            </label>
            <input
              type="date"
              id="tanggal_panen"
              value={tanggalPanen}
              onChange={(e) => setTanggalPanen(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter Tanggal panen"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/jadwal")}
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

export default FormAddJadwal;
