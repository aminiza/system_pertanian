import { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import { Link, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { FiEdit, FiPrinter, FiTrash, FiSearch, FiPlus } from "react-icons/fi";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";

const ListPengeluaran = () => {
  const [pengeluaran, setPengeluaran] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getPengeluaran();
  }, []);

  const getPengeluaran = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        "/pengeluaran"
      );
      setPengeluaran(response.data);
    } catch (error) {
      console.error("Error fetching pengeluaran:", error);
    } finally {
      setIsLoading(false);
    }
    setSelectAll(false);
    setSelectedItems([]);
  };

  const deletePengeluaran = async (id) => {
    if (window.confirm("Apakah anda yakin ingin menghapus data pengeluaran?")) {
      try {
        await axiosInstance.delete(`/pengeluaran/${id}`);
        getPengeluaran();
      } catch (error) {
        console.error("Error deleting pengeluaran:", error);
      }
    }
  };

  const handleSelectionItem = (uuid) => {
    setSelectedItems((prev) =>
      prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredPengeluaran.map((item) => item.uuid));
    }
    setSelectAll(!selectAll);
  };

  const formatDate = (dateString) => {
    const option = { day: "2-digit", month: "2-digit", year: "numeric" };

    return new Date(dateString.split("T")[0]).toLocaleDateString(
      "id-ID",
      option
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredPengeluaran = pengeluaran.filter(
    (item) =>
      item.nama_lahan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jenis_tanaman?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nama_pengeluaran?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = () => {
    const selectedData = filteredPengeluaran.filter(item => selectedItems.includes(item.uuid));

    if(selectedData.length === 0) {
      alert("Silakan pilih data terlebih dahulu");
      return 
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Laporan pengeluaran", 105, 15, { align: "center" });

    doc.setFontSize(12);
    doc.text(
      `Dicetak pada: ${new Date().toLocaleDateString("id-ID")}`,
      105,
      25,
      { align: "center" }
    );

    autoTable(doc, {
      startY: 30,
      head: [
        [
          "No",
          "Lahan",
          "Tanaman",
          "Pengeluaran",
          "Jumlah",
          "Tanggal",
          "Deskripsi",
        ],
      ],
      body: selectedData.map((item, index) => [
        index + 1,
        item.nama_lahan,
        item.jenis_tanaman,
        item.nama_pengeluaran,
        formatCurrency(item.jumlah_pengeluaran),
        formatDate(item.tanggal_pengeluaran),
        item.deskripsi,
      ]),
      styles: { fontSize: 10, cellPadding: 3, overflow: "linebreak" },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 20 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 20 },
        6: { cellWidth: 40 },
      },
    });

    const total = filteredPengeluaran.reduce(
      (sum, item) => sum + item.jumlah_pengeluaran,
      0
    );
    doc.setFontSize(12);
    doc.text(
      `Total pengeluaran: ${formatCurrency(total)}`,
      14,
      doc.lastAutoTable.finalY + 10
    );

    doc.save("laporan-pengeluaran.pdf");
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="font-bold text-2xl text-gray-800">
            Management Pengeluaran
          </h1>
          <p className="text-gray-600">Daftar seluruh pengeluaran pertanian</p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search Lahan...."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiPrinter className="mr-2" />
            </button>

            <Link
              to="/pengeluaran/add"
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="mr-2" />
              Add Pengeluaran
            </Link>
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="text-sm font-medium text-blue-800">
                Total Pengeluaran
              </h3>
              <p className="text-2xl font-medium text-blue-600">
                {formatCurrency(
                  filteredPengeluaran.reduce(
                    (sum, item) => sum + item.jumlah_pengeluaran,
                    0
                  )
                )}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h3 className="text-sm font-medium text-green-800">
                Jumlah Transaksi
              </h3>
              <p>{filteredPengeluaran.length}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <h3 className="text-sm font-medium text-purple-800">
                Rata-rata per Transaksi
              </h3>
              <p className="text-2xl font-medium text-color-600">
                {filteredPengeluaran.length > 0
                  ? formatCurrency(
                      filteredPengeluaran.reduce(
                        (sum, item) => sum + item.jumlah_pengeluaran,
                        0
                      ) / filteredPengeluaran.length
                    )
                  : formatCurrency(0)}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="form-checkbox"
                    />
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    No
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Lahan
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tanaman
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Jenis Pengeluaran
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Jumlah
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tanggal
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Deskripsi
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPengeluaran.length > 0 ? (
                  filteredPengeluaran.map((item, index) => (
                    <tr key={item.uuid} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input type="checkbox" checked={selectedItems.includes(item.uuid)} onChange={() => handleSelectionItem(item.uuid)} className="form-checkbox" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.nama_lahan}
                        </div>
                        <div className="text-sm font-medium text-gray-500">
                          {item.alamat}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.jenis_tanaman}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.nama_pengeluaran}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.jumlah_pengeluaran}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dayjs(item.tanggal_pengeluaran).format("DD-MM-YYYY")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.deskripsi}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex justify-end space-x-3">
                          <Link
                            to={`/pengeluaran/edit/${item.uuid}`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <FiEdit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => deletePengeluaran(item.uuid)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <FiTrash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      {pengeluaran.length > 0
                        ? "Sedang memuat data..."
                        : "Tidak ada data yagn sesuai dengan pencarian"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ListPengeluaran;
