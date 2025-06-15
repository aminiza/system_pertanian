import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../axios";

const FormEditLahan = () => {
  const [name, setName] = useState("");
  const [alamat, setAlamat] = useState("");
  const [luas, setLuas] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getLahanById = async () => {
      try {
        const response = await axiosInstance.get(
          `/lahan/${id}`
        );
        setName(response.data.name);
        setLuas(response.data.luas);
        setAlamat(response.data.alamat);
      } catch (error) {
        if (error.response) {
          setMessage(response.data.message);
        }
      }
    };
    getLahanById();
  }, [id]);

  const updateLahan = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.patch(`/lahan/${id}`, {
        name: name,
        luas: luas,
        alamat: alamat,
      });
      navigate("/lahan");
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Lahan</h1>
        <h2 className="text-xl font-bold">Update Lahan</h2>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-red-100 border-1-4 border-red-500 text-red-700">
          <p>{message}</p>
        </div>
      )}

      <form onSubmit={updateLahan} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name Lahan
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter nama lahan"
              required
            />
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Luas
            </label>
            <input
              type="number"
              id="luas"
              value={luas}
              onChange={(e) => setLuas(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2  focus:outline-none focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter luas lahan"
              required
            />
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Lokasi Lahan
            </label>
            <input
              type="text"
              id="lokasi"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter Lokasi lahan"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/lahan")}
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

export default FormEditLahan;