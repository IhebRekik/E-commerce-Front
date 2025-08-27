import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { fetchCommandesHistorique } from "@/Api/c";
import { useEffect, useState } from "react";

export function Historique() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // state for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadCommandes = async () => {
    try {
      setLoading(true);
      const data = await fetchCommandesHistorique();
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
      commande.nomPrenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commande.telephone.toString().includes(searchTerm) ||
      commande.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || commande.statuts === statusFilter;

    return matchesSearchTerm && matchesStatus;
  });

  if (loading) return <p>Loading commandes...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (commandes.length === 0) return <p>No commandes to confirm ✅</p>;

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-4 p-6">
          <Typography variant="h6" color="white">
            Historique des Commandes
          </Typography>
        </CardHeader>

        {/* 🔍 Search + Filter Zone */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 pb-4 gap-2">
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone ou adresse..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-1/2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="New">New</option>
            <option value="confermad">Confirmé</option>
            <option value="annuler">Annulé</option>
            <option value="secondAttend">Second Attend</option>
          </select>
        </div>

        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[
                  "Nom et Prénom",
                  "Téléphone",
                  "Adresse",
                  "Produit",
                  "Quantité",
                  "Prix",
                  "Date de commande",
                  "Statut",
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
              {filteredCommandes.map(
                (
                  {
                    id,
                    nomPrenom,
                    telephone,
                    address,
                    produit,
                    qtit,
                    prix,
                    date,
                    statuts,
                  },
                  key
                ) => {
                  const className = `py-4 px-6 ${key === commandes.length - 1
                      ? ""
                      : "border-b border-gray-200"
                    } hover:bg-gray-50`;

                  return (
                    <tr key={id} className="transition-colors">
                      <td className={className}>
                        <span className="font-semibold text-sm text-gray-800">
                          {nomPrenom}
                        </span>
                      </td>
                      <td className={className}>
                        <span className="text-xs font-normal text-gray-600">
                          {telephone}
                        </span>
                      </td>
                      <td className={className}>
                        <span className="text-xs font-normal text-gray-600">
                          {address}
                        </span>
                      </td>
                      <td className={className}>
                        <span className="text-xs font-normal text-gray-600">
                          {produit}
                        </span>
                      </td>
                      <td className={className}>
                        <span className="text-xs font-normal text-gray-600">
                          {qtit}
                        </span>
                      </td>
                      <td className={className}>
                        <span className="text-xs font-normal text-gray-600">
                          ${prix.toFixed(2)}
                        </span>
                      </td>
                      <td className={className}>
                        <span className="text-xs font-semibold text-gray-700">
                          {new Date(date).toLocaleDateString("fr-FR")}
                        </span>
                      </td>
                      <td className={className}>
                        <span

                          className={`text-xs font-semibold rounded-md p-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 ${statuts === ""
                              ? "text-gray-500 border-gray-300"
                              : statuts === "confermad"
                                ? "text-green-500 border-green-300"
                                : statuts === "annuler"
                                  ? "text-red-500 border-red-300"
                                  : "text-blue-500 border-blue-300"
                            }`}
                        > {statuts} </span>

                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default Historique;
