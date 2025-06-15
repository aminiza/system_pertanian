import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import FormAddUser from "./pages/AddUser.jsx";
import Users from "./pages/Users.jsx";
import EditUsers from "./pages/EditUsers.jsx";
import Lahan from "./pages/Lahan.jsx";
import AddLahan from "./pages/AddLahan.jsx";
import EditLahan from "./pages/EditLahan.jsx";
import JadwalTanam from "./pages/JadwalTanam.jsx";
import AddJadwal from "./pages/AddJadwal.jsx";
import EditJadwal from "./pages/EditJadwal.jsx";
import Pengeluaran from "./pages/Pengeluaran.jsx";
import AddPengeluaran from "./pages/AddPengeluaran.jsx";
import EditPengeluaran from "./pages/EditPengeluaran.jsx";
import Pupuk from "./pages/Pupuk.jsx";
import AddPupuk from "./pages/AddPupuk.jsx";
import EditPupuk from "./pages/EditPupuk.jsx";
import AddPenggunaanPupuk from "./pages/AddPenggunaanPupuk.jsx";
import PenggunaanPupuk from "./pages/PenggunaanPupuk.jsx";
import EditPenggunaanPupuk from "./pages/EditPenggunaanPupuk.jsx";
import ValidasiPenggunaan from "./pages/ValidasiPenggunaan.jsx";
import GlobalNotif from "./pages/GlobalNotive.jsx";

function App() {
  return (
    <div>
      <GlobalNotif />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/user/add" element={<FormAddUser />} />
          <Route path="/users/edit/:id" element={<EditUsers />} />
          <Route path="/lahan" element={<Lahan />} />
          <Route path="/lahan/add" element={<AddLahan />} />
          <Route path="/lahan/edit/:id" element={<EditLahan />} />
          <Route path="/jadwal" element={<JadwalTanam />} />
          <Route path="/jadwal/add" element={<AddJadwal />} />
          <Route path="/jadwal/edit/:id" element={<EditJadwal />} />
          <Route path="/pengeluaran" element={<Pengeluaran />} />
          <Route path="/pengeluaran/add" element={<AddPengeluaran />} />
          <Route path="/pengeluaran/edit/:id" element={<EditPengeluaran />} />
          <Route path="/pupuk" element={<Pupuk />} />
          <Route path="/pupuk/add" element={<AddPupuk />} />
          <Route path="/pupuk/edit/:id" element={<EditPupuk />} />
          <Route path="/penggunaan-pupuk" element={<PenggunaanPupuk />} />
          <Route
            path="/penggunaan-pupuk/add"
            element={<AddPenggunaanPupuk />}
          />
          <Route
            path="/penggunaan-pupuk/edit/:id"
            element={<EditPenggunaanPupuk />}
          />
          <Route path="/validasi-penggunaan" element={<ValidasiPenggunaan />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
