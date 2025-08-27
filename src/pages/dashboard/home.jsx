import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faUsers,
  faStar,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { StatisticsCard } from "@/widgets/cards";
import CustomPieChart from "@/widgets/charts/pie";
import MultipleBarChart from "@/widgets/charts/bar";
import { fetchData } from "@/Api/Chart";
import { fetchUserHistorique } from "@/Api/c";

export function Home() {
  const iconsMap = {
    news: faUserPlus,
    dup: faUsers,
    good: faStar,
    bad: faExclamationTriangle,
  };

  const colorsMap = {
    news: "text-green-500",
    dup: "text-blue-500",
    good: "text-yellow-500",
    bad: "text-red-500",
  };

  const [statsCardsData, setStatsCardsData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [historiqueRaw, setHistoriqueRaw] = useState([]);
  const [groupBy, setGroupBy] = useState("day"); // default day

  // Fonction pour regrouper les données par utilisateur
const groupDataByUser = (data = [], groupBy = "day") => {
  if (!Array.isArray(data)) {
    console.warn("Expected array, got:", data);
    return {};
  }
  const result = {};
  data.forEach((item) => {
    const user = item.user;
    const d = new Date(item.date);
    let key;

    if (groupBy === "day") key = d.toISOString().slice(0, 10);
    else if (groupBy === "month") key = d.toISOString().slice(0, 7);
    else key = d.getFullYear();

    if (!result[user]) result[user] = {};
    if (!result[user][key])
      result[user][key] = { name: key, confirmed: 0, rejected: 0 };

    if (item.activity === "confirmed") result[user][key].confirmed += 1;
    else if (item.activity === "rejected") result[user][key].rejected += 1;
  });

  const finalResult = {};
  Object.keys(result).forEach((user) => {
    finalResult[user] = Object.values(result[user]);
  });

  return finalResult;
};

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData();
        const histo = await fetchUserHistorique();
        setHistoriqueRaw(histo);

        const cardsData = Object.entries(result)
          .filter(
            ([key]) => !["total", "autre", "reje", "conf"].includes(key)
          )
          .map(([key, value]) => ({
            title: key.toUpperCase(),
            footer: {
              value,
              label:
                key === "news"
                  ? "Nouveaux clients : "
                  : key === "dup"
                  ? "Clients fidèles : "
                  : key === "good"
                  ? "Bons clients : "
                  : "Mauvais clients : ",
              color: colorsMap[key],
            },
            icon: iconsMap[key],
          }));

        setStatsCardsData(cardsData);
        setChartData([
          { name: "Confirmé", value: result.conf },
          { name: "Rejeté", value: result.reje },
          { name: "Autre", value: result.autre },
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, []);

  // Regrouper les données par utilisateur et par période
  const chartByUser = groupDataByUser(historiqueRaw, groupBy);

  return (
    <div className="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     

      <div className="mb-12 grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 mt-12">
        {statsCardsData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            title={
              <span className="text-xl font-semibold">
                {footer.label + footer.value}
              </span>
            }
            {...rest}
            className="shadow-md hover:shadow-lg transition-shadow duration-200"
            icon={React.createElement(FontAwesomeIcon, {
              icon,
              className: "w-8 h-8 text-white bg-gray-900 p-2",
              "aria-label": footer.label,
            })}
            footer={
              <Typography
                className={`font-normal mt-3 text-center text-base ${footer.color}`}
              >
              </Typography>
            }
          />
        ))}
      </div>

      <Card className="p-6 shadow-md border border-gray-100">
        <CardHeader
          variant="gradient"
          color="blue-gray"
          className="mb-4 p-4"
          floated={false}
        >
          <Typography variant="h6" color="white" className="text-center">
            Statistiques des Commandes
          </Typography>
        </CardHeader>
        <CardBody>
          <CustomPieChart data={chartData}  />
        </CardBody>
      </Card>
       <div className="my-6 flex items-center gap-4">
        <label>Afficher par :</label>
        <select
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value)}
          className="border rounded p-1"
        >
          <option value="day">Jour</option>
          <option value="month">Mois</option>
          <option value="year">Année</option>
        </select>
      </div>

      {/* Générer un graphique pour chaque utilisateur */}
   <div className="flex flex-wrap gap-6">
  {Object.entries(chartByUser).map(([user, data]) => (
    <div key={user} className="flex-1 min-w-[300px]">
      <h3 className="text-lg font-semibold mb-2">{user}</h3>
      <MultipleBarChart data={data} title={`Historique de ${user}`} />
    </div>
  ))}
</div>
    </div>
  );
}

export default Home;
