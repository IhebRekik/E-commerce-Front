import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { deleteCommandes, fetchCommandesToDeliver } from "@/Api/c";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function Delivered() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadCommandes = async () => {
    try {
      setLoading(true);
      const data = await fetchCommandesToDeliver();
      setCommandes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommandes();
  }, []);

  const filteredCommandes = commandes.filter((commande) => {
    const matchesSearchTerm =
      commande.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commande.telephone1.toString().includes(searchTerm) ||
      commande.adresse.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearchTerm;
  });

  // Excel export
  const exportToExcel = () => {
    const data = filteredCommandes.map((c) => ({
      Nom: c.nom,
      Adresse: c.adresse,
      Gouvernorat1: c.gouvernorat,
      Gouvernorat2: c.gouvernorat2,
      "Téléphone 1": c.telephone1,
      "Téléphone 2": c.telephone2,
      "Nombre de commandes": c.nbreDeCommande,
      Prix: c.prix.toFixed(2),
      Désignation: c.designation,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "commandes.csv");
  };

  // Appel à ton backend pour clear
  const handleClearAll = async () => {
    setDeleting(true);
    try {
      await deleteCommandes();
      setCommandes([]); // vider localement
      setShowConfirm(false);
    } catch (err) {
      alert("Erreur lors de l'effacement : " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p>Loading commandes...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (commandes.length === 0) return <p>No commandes to confirm ✅</p>;

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-4 p-6">
          <Typography variant="h6" color="white">
            Commandes à livrer
          </Typography>
        </CardHeader>

        {/* 🔍 Search + Export + Clear */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 pb-4 gap-2">
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone ou adresse..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-1/2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-around space-x-4">
            <button
              onClick={() => setShowConfirm(true)}
              className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 transition"
            >
              Clear
            </button>

            <button
              onClick={exportToExcel}
              className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition"
            >
              Export to CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[
                  "Nom",
                  "Adresse",
                  "Gouvernorat1",
                  "Gouvernorat2",
                  "Téléphone 1",
                  "Téléphone 2",
                  "Nombre de commandes",
                  "Prix",
                  "Désignation",
                ].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredCommandes.map((c, key) => {
                const className = `py-4 px-6 ${
                  key === commandes.length - 1
                    ? ""
                    : "border-b border-gray-200"
                } hover:bg-gray-50`;
                return (
                  <tr key={key} className="transition-colors">
                    <td className={className}>
                      <span className="font-semibold text-sm text-gray-800">
                        {c.nom}
                      </span>
                    </td>
                    <td className={className}>
                      <span className="text-xs font-normal text-gray-600">
                        {c.adresse}
                      </span>
                    </td>
                    <td className={className}>
                      <span className="font-semibold text-sm text-gray-800">
                        {c.gouvernorat}
                      </span>
                    </td>
                    <td className={className}>
                      <span className="font-semibold text-sm text-gray-800">
                        {c.gouvernorat2}
                      </span>
                    </td>
                    <td className={className}>
                      <span className="text-xs font-normal text-gray-600">
                        {c.telephone1}
                      </span>
                    </td>
                    <td className={className}>
                      <span className="text-xs font-normal text-gray-600">
                        {c.telephone2}
                      </span>
                    </td>
                    <td className={className}>
                      <span className="text-xs font-normal text-gray-600">
                        {c.nbreDeCommande}
                      </span>
                    </td>
                    <td className={className}>
                      <span className="text-xs font-normal text-gray-600">
                        {c.prix.toFixed(2)}
                      </span>
                    </td>
                    <td className={className}>
                      <span className="text-xs font-normal text-gray-600">
                        {c.designation}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => !deleting && setShowConfirm(false)}
          />
          <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold">Confirmer l’effacement</h2>
            <p className="mt-2 text-sm text-gray-600">
              Voulez-vous vraiment effacer toutes les commandes à livrer ?
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={handleClearAll}
                disabled={deleting}
                className={`px-4 py-2 text-white rounded-md ${
                  deleting
                    ? "bg-red-300 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {deleting ? "Effacement..." : "Oui, effacer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Delivered;
