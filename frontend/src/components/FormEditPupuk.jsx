import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GiFertilizerBag } from "react-icons/gi";
import { FiClipboard, FiDollarSign, FiFile, FiSave, FiX } from "react-icons/fi";
import axiosInstance from "../../axios";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { showNotif } from "../feature/penggunaanSlice";

const FormEditPupuk = () => {
  const [formData, setFormData] = useState({
    namaPupuk: "",
    kandungan: "",
    harga: "",
    kuantitas: "",
    deskripsi: "",
  });
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const getPupukById = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(
          `/pupuk/${id}`
        );
        const pupukData = response.data;
        setFormData({
          namaPupuk: pupukData.nama_pupuk || "",
          kandungan: pupukData.kandungan || "",
          kuantitas: parseInt(pupukData.kuantitas) || "",
          harga: parseInt(pupukData.harga)|| "",
          deskripsi: pupukData.deskripsi || "",
        });
      } catch (error) {
        if (error.message) setMessage(error.message);
        setMessage({
          type: "error",
          text: error.response?.data?.message || "Failed to get pengeluaran",
        });
      } finally {
        setIsLoading(false);
      }
    };
    getPupukById();
  }, [id]);

  const updatePupuk = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axiosInstance.patch(`/pupuk/${id}`, {
        nama_pupuk: formData.namaPupuk,
        kandungan: formData.kandungan,
        kuantitas: parseInt(formData.kuantitas),
        harga: parseInt(formData.harga),
        deskripsi: formData.deskripsi,
      });

      setSuccessMessage(formData.message || "Pupuk updated successfully");
      setTimeout(() => {
        navigate("/pupuk");
      }, 1500)
    } catch (error) {
      if (error.response) {
        setMessage({
          type: "error",
          text: error.response.data.message || "Failed to update pupuk",
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
            Edit Data Pupuk
        </h1>
        <h2 className="text-xl font-bold">Perbarui data pupuk pertanian</h2>
      </div>

      {successMessage && (
        <div className="w-1/2 mb-6 p-4 bg-blue-100 border-t-4 border-green-blue-500 rounded-lg text-blue-700 flex items-center" role="alert">
            {successMessage}
            <IoCloseCircleOutline className="ml-2 cursor-pointer" onClick={() => setSuccessMessage("")}/>
        </div>
      )}

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

      <form onSubmit={updatePupuk} className="space-y-6">
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

export default FormEditPupuk;
