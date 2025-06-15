import { useEffect, useState } from "react";
import { FiCalendar, FiClipboard, FiDroplet, FiPaperclip, FiSave, FiX } from "react-icons/fi";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../axios";

const FormEditPenggunaanPupuk = () => {
  const [formData, setFormData] = useState({
    lahanId: "",
    pupukId: "",
    tanggalPenggunaan: "",
    usiaTanaman: "",
    usiaTanamCustom: "",
    jumlah: "",
    namaPupuk: "",
    kandungan: "",
  });
  const [lahans, setLahans] = useState([]);
  const [message, setMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const formatDateInput = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const getPenggunaanById = async () => {
      try {
        setIsLoading(true);
        const [responsePenggunaan, lahanResponse] = [await axiosInstance.get(
          `/penggunaan/${id}`
        ), await axiosInstance.get("/lahan")];
        setLahans(lahanResponse.data);
        const penggunaanResponse = responsePenggunaan.data;
        setFormData({
          lahanId: penggunaanResponse.lahan.uuid || "",
          pupukId: penggunaanResponse.pupuk.uuid || "",
          tanggalPenggunaan:
            formatDateInput(penggunaanResponse.tanggal_penggunaan) || "",
          usiaTanaman: penggunaanResponse.usia_tanaman || "",
          jumlah: penggunaanResponse.jumlah?.toString() || "",
          namaPupuk: penggunaanResponse.pupuk?.nama_pupuk || "",
          kandungan: penggunaanResponse.pupuk?.kandungan || "",
        });
      } catch (error) {
        if (error.message) setMessage(error.message);
        setMessage({
          type: "error",
          text: error.response?.data?.message || "Failed to get penggunaan",
        });
      } finally {
        setIsLoading(false);
      }
    };
    getPenggunaanById();
  }, [id]);

  const updatePenggunaan = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axiosInstance.patch(`/penggunaan/${id}`, {
        lahanId: formData.lahanId,
        pupukId: formData.pupukId,
        tanggal_penggunaan: formData.tanggalPenggunaan,
        usia_tanaman: formData.usiaTanaman === "custom" ? formData.usiaTanamCustom : formData.usiaTanaman,
        jumlah: parseInt(formData.jumlah),
      });

      setSuccessMessage(
        formData.message || "Penggunaan pupuk updated successfully"
      );

      setTimeout(() => {
        navigate("/penggunaan-pupuk");
      }, 3000);
    } catch (error) {
      if (error.response) {
        setMessage({
          type: "error",
          text:
            error.response?.data?.message ||
            "Failed to memperbarui penggunaan pupuk",
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
          <FiClipboard className="mr-2" />
          Edit Penggunaan Pupuk Baru
        </h1>
        <h2 className="text-xl font-bold">Perbarui Data Penggunaan Pupuk</h2>
      </div>

      {successMessage && (
        <div className="w-1/2 mb-6 p-4 bg-green-100 border-t-4 border-green-500 rounded-lg text-green-700 flex items-center">
          <p className="flex items-center justify-between">
            {successMessage}{" "}
            <IoCloseCircleOutline
              className="ml-2 cursor-pointer"
              onClick={() => setSuccessMessage(null)}
            />
          </p>
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

      <form onSubmit={updatePenggunaan} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1 items-center">
              <FiDroplet className="mr-2" /> Jenis Pupuk
            </label>

            <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
              <p className="font-medium">{formData.namaPupuk}</p>
              <p className="text-sm text-gray-600">{formData.kandungan}</p>
            </div>
          </div>

          <div className="col-span-1">
            <label
              htmlFor="lahan"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pilih lahan & luas
            </label>
            <select
              name="lahanId"
              value={formData.lahanId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Lahan</option>
              {lahans.map((item) => (
                <option key={item.uuid} value={item.uuid}>
                  {item.name} - {item.luas}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1 items-center">
              <FiCalendar className="mr-1" /> Tanggal Penggunaan
            </label>
            <input
              type="date"
              name="tanggalPenggunaan"
              value={formData.tanggalPenggunaan}
              onChange={handleChange}
              className="w-full px-4 py-2 border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:rong-blue-500 focus:border-transparent"
              min="0"
              required
            />

             <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1 items-center">
              <FiPaperclip className="mr-1" />Usia Tanaman
            </label>
            <select
              name="usiaTanaman"
              value={formData.usiaTanaman}
              onChange={handleChange}
              className="w-full px-4 py-2 border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Pilih usia tanaman</option>
              {[
                "1 minggu",
                "2 minggu",
                "3 minggu",
                "5 minggu",
                "1 bulan",
                "2 bulan",
                "3 bulan",
                "> 3 bulan",
              ].map((value, index) => (
                <option key={index} value={value}>
                  {value}
                </option>
              ))}
              <option value="custom">Lainnya</option>
            </select>
            {formData.usiaTanaman === "custom" && (
              <input
                type="text"
                name="usiaTanamanCustom"
                value={formData.usiaTanamCustom}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                placeholder="Masukan usia tanaman"
                required
              />
            )}
          </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1 items-center">
                <FiClipboard className="mr-1" /> Jumlah Pupuk
              </label>
              <input
                type="number"
                name="jumlah"
                value={formData.jumlah}
                onChange={handleChange}
                className="w-full px-4 py-2 border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:rong-blue-500 focus:border-transparent"
                placeholder="Masukan jumlah pupuk"
                min="0"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/penggunaan-pupuk")}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FiX className="mr-2" />
            Batal
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center px-4 py-2 border border-transparent rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          >
            <FiSave className="mr-2" />
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormEditPenggunaanPupuk;
