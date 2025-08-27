import {
    Card,
    CardHeader,
    CardBody,
    Typography,
} from "@material-tailwind/react";
import { fetchCommandesToDeliver } from "@/Api/c";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { fetchUsers } from "@/Api/Auth";
import { Circle } from "lucide-react";

export function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // state for filters
    const [searchTerm, setSearchTerm] = useState("");

    const loadCommandes = async () => {
        try {
            setLoading(true);
            const data = await fetchUsers();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
        const loadCommandesAuto = async () => {
        try {
            const data = await fetchUsers();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        }
    };

   useEffect(() => {
  // première exécution immédiate
  loadCommandes();

  // ensuite exécution chaque 1s
  const interval = setInterval(() => {
    loadCommandesAuto();
  }, 1000 * 3);

  // nettoyage quand le composant se démonte
  return () => clearInterval(interval);
}, []);

    const filteredUsers = users.filter((user) => {
        const matchesSearchTerm =
            user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.telephone.toString().includes(searchTerm) ||
            user.userName.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearchTerm;
    });

    // Excel export function


    if (loading) return <p>Loading commandes...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    if (users.length === 0) return <p>No commandes to confirm ✅</p>;

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-4 p-6">
                    <Typography variant="h6" color="white">
                        Les utilisateurs
                    </Typography>
                </CardHeader>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 pb-4 gap-2">
                    <input
                        type="text"
                        placeholder="Rechercher par nom, téléphone ou adresse..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-1/2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>

                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {[
                                    "Nom",
                                    "Prenom",
                                    "nom d'utilisateur",
                                    "Téléphone ",
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
                            {filteredUsers.map(
                                (
                                    {
                                        nom,
                                        prenom,
                                        userName,
                                        telephone,
                                        statut
                                    },
                                    key
                                ) => {
                                    const className = `py-4 px-6 ${key === users.length - 1 ? "" : "border-b border-gray-200"
                                        } hover:bg-gray-50`;

                                    return (
                                        <tr key={key} className="transition-colors">
                                            <td className={className}>
                                                <span className="font-semibold text-sm text-gray-800">
                                                    {nom}
                                                </span>
                                            </td>
                                            <td className={className}>
                                                <span className="text-xs font-normal text-gray-600">
                                                    {prenom}
                                                </span>
                                            </td>
                                            <td className={className}>
                                                <span className="font-semibold text-sm text-gray-800">
                                                    {userName}
                                                </span>
                                            </td>
                                            <td className={className}>
                                                <span className="text-xs font-normal text-gray-600">
                                                    {telephone}
                                                </span>
                                            </td>
                                            <td className={className}>
                                                <div className="flex items-center space-x-2">
                                                    <span className="relative flex h-4 w-4">
                                                        <Circle
                                                            className={`absolute top-0 left-0 ${statut == "online" ? "text-green-500" : statut == "offline" ? "text-red-500" : "text-gray-400"
                                                                }`}
                                                            size={16}
                                                        />
                                                        {statut == "online" ? 
                                                            <span className="absolute inline-flex h-4 w-4 rounded-full bg-green-400 opacity-75 animate-ping"></span>
                                                        : statut == "offline" ? (
                                                            <span className="absolute inline-flex h-4 w-4 rounded-full bg-red-400 opacity-75 animate-ping"></span>
                                                        ) : (
                                                            <span className="absolute inline-flex h-4 w-4 rounded-full bg-gray-400 opacity-75 animate-ping"></span>
                                                        )}
                                                    </span>
                                                    <span
                                                        className={`text-sm font-semibold ${statut == "online" ? "text-green-600" : statut == "offline" ? "text-red-600" : "text-gray-500"
                                                            }`}
                                                    >
                                                        {statut == "online" ? "Online" : statut == "offline" ? "Offline" : "Unknown"}
                                                     
                                                    </span>
                                                </div>
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

export default Users;
