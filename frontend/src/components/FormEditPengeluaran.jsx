import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../axios";
import {
  FiCalendar,
  FiClipboard,
  FiDollarSign,
  FiMapPin,
  FiSave,
  FiX,
} from "react-icons/fi";
import { IoCloseCircleOutline } from "react-icons/io5";

const FormEditPengeluaran = () => {
  const [formData, setFormData] = useState({
    jadwalId: "",
    jenisPengeluaran: "",
    tanggalPengeluaran: "",
    jumlahPengeluaran: "",
    deskripsi: "",
    alamat: "",
  });
  const [dropDownOptions, setDropDownOptions] = useState([]);
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

  const handleJadwaleChange = (e) => {
    const selectedId = e.target.value;
    const selectedOptions = dropDownOptions.find(
      (opt) => opt.value === selectedId
    );

    setFormData((prev) => ({
      ...prev,
      jadwalId: selectedId,
      alamat: selectedOptions?.lokasi || "",
    }));
  };

  useEffect(() => {
    const getPengeluaranById = async () => {
      try {
        setIsLoading(true);
        const [pengeluaranResponse, lahanResponse] = await Promise.all([
          axiosInstance.get(`/pengeluaran/${id}`),
          axiosInstance.get(
            "/pengeluaran/jadwal/dropdown"
          ),
        ]);
        setDropDownOptions(lahanResponse.data.dropdown);
        const pengeluaranData = pengeluaranResponse.data;
        setFormData({
          jadwalId: pengeluaranData.jadwalTanam?.uuid || "",
          alamat: pengeluaranData.jadwalTanam?.lahan?.alamat || "",
          jenisPengeluaran: pengeluaranData.nama_pengeluaran || "",
          tanggalPengeluaran:
            formatDateInput(pengeluaranData.tanggal_pengeluaran) || "",
          jumlahPengeluaran:
            pengeluaranData.jumlah_pengeluaran?.toString() || "",
          deskripsi: pengeluaranData.deskripsi || "",
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
    getPengeluaranById();
  }, [id]);

  const updatePengeluaran = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axiosInstance.patch(`/pengeluaran/${id}`, {
        jadwalId: formData.jadwalId,
        nama_pengeluaran: formData.jenisPengeluaran,
        tanggal_pengeluaran: formData.tanggalPengeluaran,
        jumlah_pengeluaran: parseInt(formData.jumlahPengeluaran),
        deskripsi: formData.deskripsi,
      });

      setSuccessMessage(formData.message || "Pengeluaran updated successfully");

      setTimeout(() => {
        navigate("/pengeluaran");
      }, 3000);
    } catch (error) {
      if (error.response) {
        setMessage({
          type: "error",
          text:
            error.response?.data?.message ||
            "Failed to memperbarui pengeluaran",
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
          <FiDollarSign className="mr-2" />
          Edit Pengeluaran Baru
        </h1>
        <h2 className="text-xl font-bold">
          Perbarui Data pengeluaran pertanian
        </h2>
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

      <form onSubmit={updatePengeluaran} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <label
              htmlFor="lahan"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pilih lahan & tanaman
            </label>
            <select
              name="jadwalId"
              value={formData.jadwalId}
              onChange={handleJadwaleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Lahan</option>
              {dropDownOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1 items-center">
              <FiMapPin className="mr-2" /> Lokasi lahan
            </label>
            <input
              type="text"
              name="alamat"
              value={formData.alamat}
              readOnly
              className="w-full px-4 py-2 border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1 items-center">
              Jenis pengeluaran
            </label>
            <select
              name="jenisPengeluaran"
              value={formData.jenisPengeluaran}
              onChange={handleChange}
              className="w-full px-4 py-2 border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:rong-blue-500 focus:border-transparent"
              required
            >
              <option value="">Pilih Jenis</option>
              <option value="Benih">Benih</option>
              <option value="Pupuk">Pupuk</option>
              <option value="Pestisida">Pestisida</option>
              <option value="Alat">Alat Pertanian</option>
              <option value="Tenaga Kerja">Tenaga Kerja</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1 items-center">
              <FiDollarSign className="mr-1" /> Jumlah Pengeluaran (Rp)
            </label>
            <input
              type="number"
              name="jumlahPengeluaran"
              value={formData.jumlahPengeluaran}
              onChange={handleChange}
              className="w-full px-4 py-2 border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:rong-blue-500 focus:border-transparent"
              placeholder="Masukan jumlah"
              min="0"
              required
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1 items-center">
              <FiCalendar className="mr-1" /> Tanggal Pengeluaran
            </label>
            <input
              type="date"
              name="tanggalPengeluaran"
              value={formData.tanggalPengeluaran}
              onChange={handleChange}
              className="w-full px-4 py-2 border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:rong-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:rong-blue-500 focus:border-transparent"
              placeholder="Tambahkan deskripsi pertanian"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/pengeluaran")}
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

export default FormEditPengeluaran;
