import { useEffect, useState } from "react";
import { FiCalendar } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../axios";
import { IoCloseCircleOutline } from "react-icons/io5";

const FormEditJadwal = () => {
  const [lahanId, setLahanId] = useState("");
  const [tanggalTanam, setTanggalTanam] = useState("");
  const [jenisTanaman, setJenisTanaman] = useState("");
  const [tanggalPanen, setTanggalPanen] = useState("");
  const [message, setMessage] = useState("");
  const [availableLahans, setAvailableLahans] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const formDateInput = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    const getJadwalById = async () => {
      try {
        const jadwalResponse = await axiosInstance.get(
          `/jadwal/${id}`
        );
        const lahanResponse = await axiosInstance.get(
          "/jadwal/lahan/dropdown"
        );
        setAvailableLahans(lahanResponse.data.dropdown);
        setJenisTanaman(jadwalResponse.data.jenis_tanaman);
        setTanggalTanam(formDateInput(jadwalResponse.data.tanggal_tanam));
        setTanggalPanen(formDateInput(jadwalResponse.data.tanggal_panen));
      } catch (error) {
        if (error.response) {
          setMessage(response.data.message);
        }
      }
    };
    getJadwalById();
  }, [id]);

  const updateJadwal = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.patch(
        `/jadwal/${id}`,
        {
          lahanId: lahanId,
          jenis_tanaman: jenisTanaman,
          tanggal_tanam: tanggalTanam,
          tanggal_panen: tanggalPanen,
        }
      );
      setSuccessMessage(
        response.data.message || "Jadwal updated successfully."
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

  return (
    <div className="p-6 bg-white rounded-lg shadow-md relative">
      <div className="flex flex-col mb-8">
        <h1 className="text-2xl font-bold flex items-center">
          <FiCalendar className="mr-2" />
          Edit Jadwal Tanam
        </h1>
        <h2 className="text-lg font-semibold">Update Jadwal Tanam</h2>
      </div>

      {successMessage && (
        <div className="w-1/2 mb-6 p-4 bg-green-100 border-1-4 border-green-500 text-green-700 flex items-center">
          <p className="flex items-center justify-between">{successMessage} <IoCloseCircleOutline className="ml-2 w-5 h-5" /></p>
        </div>
      )}

      {message && (
        <div className="mb-6 p-4 bg-red-100 border-1-4 border-red-500 text-red-700">
          <p>{message}</p>  
        </div>
      )}

      <form onSubmit={updateJadwal} className="space-y-6">
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
              {availableLahans.map((lahan) => (
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

export default FormEditJadwal;
