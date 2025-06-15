import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../axios";
import { IoSend } from "react-icons/io5";
import {
  FiCalendar,
  FiClock,
  FiDroplet,
  FiMapPin,
  FiSave,
  FiX,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { showNotif } from "../feature/penggunaanSlice";

const FormAddPenggunaanPupuk = () => {
  const { state } = useLocation();
  const [formData, setFormData] = useState({
    pupukId: "",
    namaPupuk: "",
    kandungan: "",
    lahanId: "",
    tanggalPenggunaan: "",
    usiaTanaman: "",
    usiaTanamCustom: "",
    jumlah: "",
    catatan: "",
  });
  const [lahans, setLahans] = useState([]);
  const [showMessage, setShowMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch(); 
  const navigate = useNavigate();

  useEffect(() => {
    const initializedData = async () => {
      try {
        let pupukData = state?.selectedPupuk;
        if (!pupukData) {
          const savedPupuk = sessionStorage.getItem("selectedPupuk");
          if (savedPupuk) {
            pupukData = JSON.parse(savedPupuk);
          }
        } else {
          sessionStorage.setItem("selectedPupuk", JSON.stringify(pupukData));
        }

        if (!pupukData) {
          setShowMessage({
            type: "error",
            text: "Silakan pilih pupuk dari halaman daftar terlebih dahulu",
          });
          return;
        }

        setFormData((prev) => ({
          ...prev,
          pupukId: pupukData.uuid,
          namaPupuk: pupukData.nama_pupuk,
          kandungan: pupukData.kandungan,
        }));

        const response = await axiosInstance.get("/lahan");
        setLahans(response.data);
      } catch (error) {
        setShowMessage({
          type: "error",
          text: error.response?.data?.message || "Gagal saat memuat data",
        });
      } finally {
        setIsInitializing(false);
      }
    };

    initializedData();
  }, [state, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const AddPenggunaanPupuk = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axiosInstance.post("/penggunaan", {
        pupukId: formData.pupukId,
        lahanId: formData.lahanId,
        tanggal_penggunaan: formData.tanggalPenggunaan,
        usia_tanaman:
          formData.usiaTanaman === "custom"
            ? formData.usiaTanamCustom
            : formData.usiaTanaman,
        jumlah: parseInt(formData.jumlah),
        status: user?.role === "Admin" ? "approve" : "pending",
      });

      sessionStorage.removeItem("selectedPupuk");

      if (user?.role !== "Admin") {
        dispatch(showNotif({type: "info", message: "Penggunaan pupuk berhasil ditambahkan, tunggu verifikasi admin"}));
      } else {
        dispatch(showNotif({type: "success", message: "Penggunaan pupuk berhasil ditambahkan"}));
      }
      setTimeout(() => {
        navigate("/pupuk");
      }, 4000);
    } catch (error) {
      if (error.response) {
        setShowMessage({
          type: "error",
          text: error.response.data.message || "Failed to add penggunaan pupuk",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formDateInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <FiDroplet className="mr-2 text-green-600" />
          Tambah penggunaan pupuk
        </h1>
        <h2 className="text--gray-600">
          Record penggunaan pupuk untuk lahan tertentu
        </h2>
      </div>

      {showMessage && (
        <div
          className={`mb-6 p-4 rounded-md ${
            showMessage.type === "error"
              ? "bg-red-100 border-red-500 text-red-700"
              : "bg-green-100 border-green-500 text-green-700"
          }`}
        >
          <p>{showMessage.text}</p>
        </div>
      )}

      <form onSubmit={AddPenggunaanPupuk} className="space-y-6">
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
              htmlFor="lahanId"
              className="block text-sm font-medium text-gray-700 mb-1  items-center"
            >
              <FiMapPin className="mr-1" />
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
              {lahans.map((option) => (
                <option key={option.uuid} value={option.uuid}>
                  {option.name} - {option.luas}
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
              max={formDateInput(new Date())}
              className="w-full px-4 py-2 border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Masukan jumlah"
              required
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1 items-center">
              Usia Tanaman
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
              ].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
              <option value="custom">Lainnya</option>
            </select>
            {formData.usiaTanaman === "custom" && (
              <input
                type="text"
                name="usiaTanamCustom"
                value={formData.usiaTanamCustom}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                required
              />
            )}
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1 items-center">
              Jumlah Pupuk (Bag)
            </label>
            <input
              type="number"
              name="jumlah"
              value={formData.jumlah}
              onChange={handleChange}
              className="w-full px-4 py-2 border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukan jumlah"
              min="0"
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/pupuk")}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <FiX className="mr-2" />
            Batal
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center px-4 py-2 border border-transparent rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            {user?.role === "Admin" ? (
              <>
                <FiSave className="mr-2" />
                {isLoading ? "Saving..." : "Save"}
              </>
            ) : (
              <>
                <IoSend className="mr-2" />
                {isLoading ? "Sending..." : "Send"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormAddPenggunaanPupuk;
