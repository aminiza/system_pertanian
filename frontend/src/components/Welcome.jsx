import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axiosInstance from "../../axios";
import { showNotif } from "../feature/penggunaanSlice";
import { useEffect } from "react";

const Welcome = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const cekValidasi = async () => {
      if (!user || !user?.uuid || user?.role === "Admin") return;

      const shownKey = `notifikasi-validasi-${user?.uuid}`;
      const lastStatus = localStorage.getItem(shownKey);

      try {
        const res = await axiosInstance.get("/penggunaan/cek-validasi");
        //hanya tampilkan notifikasi jika status validasi berubah
        if (res.data.status !== lastStatus) {
          if(res.data.status === "pending") return;
          dispatch(
            showNotif({
              type: res.data.status === "approve" ? "success" : "error",
              message:
                res.data.status === "approve"
                  ? "Pengajuan anda berhasil diverifikasi"
                  : "Pengajuan anda ditolak oleh admin",
              persistent: true,
            })
          );

          localStorage.setItem(shownKey, res.data.status);
        }
      } catch (error) {
        console.error("Gagal cek status validasi", error);
      }
    };

    cekValidasi();
  }, [user, dispatch]);

  return (
    <div className="p-4 md:p-6">
      <h1>Dashboard</h1>
      <h2 className="text-2xl font-bold mb-4">
        Welcome back <strong>{user && user.name}</strong>
      </h2>
      {user?.role === "Admin" && (
        <Link
          to={"/validasi-penggunaan"}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 items-center "
        >
          Validasi penggunaan
        </Link>
      )}
    </div>
  );
};

export default Welcome;
