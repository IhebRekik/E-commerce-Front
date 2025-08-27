import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { fetchCommandes, updateCommandeStatus } from "@/Api/c";
import { useEffect, useState } from "react";

export function Confirmation() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commandesChanged, setCommandesChanged] = useState([]);
  const [commande, setCommande] = useState({
    nomPrenom: "",
    telephone: "",
    address: "",
    produit: "",
    quantite: 0,
    prix: 0,
    dateCommande: "",
    statuts: "",
  });

  // state for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const updateCommandes = async () => {
    let i = 0;
    const updatedCommandes = commandes.map((commande) => {
      i++;
      if (parseFloat(commande.prix) <= 0 || isNaN(parseFloat(commande.prix))) {
        alert("vérifier le prix à la ligne " + i);
        return false;
      }
    });
    if (updatedCommandes.includes(false)) {
      alert("Veuillez corriger les erreurs avant de soumettre.");
      return;
    }
    try {
      setLoading(true);
      await updateCommandeStatus(commandesChanged);
      loadCommandes();
      setCommandesChanged([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCommandes = async () => {
    try {
      setLoading(true);
      const data = await fetchCommandes();
      setCommandes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const setPrix = (id, value) => {
    const regex = /^\d+([.,]\d{0,3})?$/;
    if (!regex.test(value)) return;
    if (parseFloat(value.replace(",", ".")) < 0) return;

    setCommandes((prevCommandes) =>
      prevCommandes.map((commande) =>
        commande.id === id ? { ...commande, prix: value } : commande
      )
    );
  };

  useEffect(() => {
    loadCommandes();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setCommandes((prevCommandes) => {
      return prevCommandes.map((commande) =>
        commande.id === id ? { ...commande, statuts: newStatus } : commande
      );
    });

    setCommandesChanged((prevChanged) => {
      const index = prevChanged.findIndex((c) => c.id === id);
      if (index !== -1) {
        return prevChanged.map((c) =>
          c.id === id ? { ...c, statuts: newStatus } : c
        );
      } else {
        const updatedCommande = commandes.find((c) => c.id === id);
        if (!updatedCommande) return prevChanged;
        return [...prevChanged, { ...updatedCommande, statuts: newStatus }];
      }
    });
  };

  // FILTRAGE COMMANDES
  const filteredCommandes = commandes.filter((commande) => {
    const matchesSearchTerm =
      commande.nomPrenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commande.telephone.toString().includes(searchTerm) ||
      commande.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || commande.statuts === statusFilter;

    const commandeDate = new Date(commande.date);
    const matchesDate =
      (!startDate || commandeDate >= new Date(startDate)) &&
      (!endDate || commandeDate <= new Date(endDate));
      alert(commandeDate + " ++++++++++++ " + new Date(startDate))
    return matchesSearchTerm && matchesStatus && matchesDate;
  });

  if (loading) return <p>Loading commandes...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (commandes.length === 0) return <p>No commandes to confirm ✅</p>;

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-4 p-6">
          <Typography variant="h6" color="white">
            Commandes à confirmer
          </Typography>
        </CardHeader>

        {/* 🔍 Zone filtres */}
        <div className="flex flex-wrap items-center gap-4 px-6 pb-4">
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone ou adresse..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-1/3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="confirmed">Confirmé</option>
            <option value="rejected">Annulé</option>
            <option value="secondAttempt">Second Tentative</option>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[
                  "Nom et Prenom",
                  "Telephone",
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
                    nomPrenom,
                    telephone,
                    address,
                    produit,
                    qtit,
                    prix,
                    date,
                    id,
                    statuts,
                  },
                  key
                ) => {
                  const className = `py-4 px-6 ${
                    key === commandes.length - 1
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
                          <input
                            type="number"
                            onChange={(e) => setPrix(id, e.target.value)}
                            value={prix}
                            min="0"
                            className="border border-gray-300 rounded-md p-1 text-xs"
                            pattern="[0-9]*"
                          />
                        </span>
                      </td>
                      <td className={className}>
                        <span className="text-xs font-semibold text-gray-700">
                          {date}
                        </span>
                      </td>
                      <td className={className}>
                        <select
                          value={statuts}
                          onChange={(e) =>
                            handleStatusChange(id, e.target.value)
                          }
                          className={`text-xs font-semibold rounded-md p-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            statuts === ""
                              ? "text-gray-500 border-gray-300"
                              : statuts === "confirmed"
                              ? "text-green-500 border-green-300"
                              : statuts === "rejected"
                              ? "text-red-500 border-red-300"
                              : "text-blue-500 border-blue-300"
                          }`}
                        >
                          <option value="">Select option</option>
                          <option value="confirmed">Confirmer</option>
                          <option value="rejected">Annuler</option>
                          <option value="secondAttempt">
                            Deuxième Tentative
                          </option>
                        </select>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="8" className="py-4 px-6">
                  <div className="flex flex-wrap gap-4 justify-end">
                    <button
                      className="bg-red-600 text-white text-sm font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
                      onClick={() => document.location.reload()}
                    >
                      Clear
                    </button>
                    <button
                      className="bg-green-600 text-white text-sm font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
                      onClick={() => updateCommandes()}
                    >
                      Enregistrer
                    </button>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default Confirmation;
