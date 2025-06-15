import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GiFertilizerBag } from "react-icons/gi";
import { FiClipboard, FiDollarSign, FiFile, FiSave, FiX } from "react-icons/fi";
import axiosInstance from "../../axios";
import { useDispatch } from "react-redux";
import { showNotif } from "../feature/penggunaanSlice";

const FormAddPupuk = () => {
  const [formData, setFormData] = useState({
    namaPupuk: "",
    kandungan: "",
    harga: "",
    kuantitas: "",
    deskripsi: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const savePupuk = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axiosInstance.post("/pupuk", {
        nama_pupuk: formData.namaPupuk,
        kandungan: formData.kandungan,
        kuantitas: parseInt(formData.kuantitas),
        harga: parseInt(formData.harga),
        deskripsi: formData.deskripsi,
      });

      dispatch(
        showNotif({
          type: "info",
          message: "Data pupuk berhasil ditambahkan",
        })
      );

      setTimeout(() => {
        navigate("/pupuk");
      }, 3000);
    } catch (error) {
      if (error.response) {
        setMessage({
          type: "error",
          text: error.response.data.message || "Failed to add pupuk",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <GiFertilizerBag className="mr-2" />
          Tambah Data Pupuk Baru
        </h1>
        <h2 className="text-xl font-bold">Catat data pupuk pertanian</h2>
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

      <form onSubmit={savePupuk} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1 items-center">
              <GiFertilizerBag className="mr-2" /> Nama Pupuk
            </label>
            <input
              type="text"
              name="namaPupuk"
              value={formData.namaPupuk}
              onChange={handleChange}
              className="w-full px-4 py-2 border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              placeholder="Nama pupuk"
              required
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1 items-center">
              <FiFile className="mr-2" /> Kandungan Pupuk
            </label>
            <input
              type="text"
              name="kandungan"
              value={formData.kandungan}
              onChange={handleChange}
              className="w-full px-4 py-2 border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              placeholder="Kandungan pupuk"
              required
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1 items-center">
              Kuantitas
            </label>
            <select
              name="kuantitas"
              value={formData.kuantitas}
              onChange={handleChange}
              className="w-full px-4 py-2 border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Pilih Kuantitas</option>
              {[1, 2, 3, 5, 10, 20, 50].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
              <option value="custom">Lainnya</option>
            </select>
            {formData.kuantitas === "custom" && (
              <input
                type="number"
                name="kuantitas"
                value={formData.kuantitas}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                required
              />
            )}
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1 items-center">
              <FiDollarSign className="mr-1" /> Harga (Rp)
            </label>
            <input
              type="number"
              name="harga"
              value={formData.harga}
              onChange={handleChange}
              className="w-full px-4 py-2 border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukan jumlah"
              min="0"
              required
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1 items-center">
              <FiClipboard className="mr-1" /> Deskripsi
            </label>
            <textarea
              type="text"
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tambahkan deskripsi pertanian"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/pupuk")}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FiX className="mr-2" />
            Batal
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center px-4 py-2 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <FiSave className="mr-2" />
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormAddPupuk;
