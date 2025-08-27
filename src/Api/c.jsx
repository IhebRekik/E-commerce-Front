import { getToken, getToken3 } from "@/configs";
import { API_URL } from "./Auth";

export async function fetchCommandes() {
  const response = await fetch(`${API_URL}/commande/confermation`);

  if (response.status === 204) {
    return []; // no commandes
  }

  if (!response.ok) {
    throw new Error("Failed to fetch commandes");
  }

  return response.json();
}
export async function updateCommandeStatus(commandes) {
  await fetch(`${API_URL}/commande/confermation/${getToken()}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(commandes), // commandes is an array
  });
}

export async function fetchCommandesHistorique() {
  const response = await fetch(`${API_URL}/commande/`);

  if (response.status === 204) {
    return []; // no commandes
  }

  if (!response.ok) {
    throw new Error("Failed to fetch commandes");
  }

  return response.json();
}

export async function fetchCommandesToDeliver() {
  const response = await fetch(`${API_URL}/commande/delivered`);

  if (response.status === 204) {
    return []; // no commandes
  }

  if (!response.ok) {
    throw new Error("Failed to fetch commandes");
  }

  return response.json();
}
export async function fetchUserHistorique() {
  const response = await fetch(
    `${API_URL}/commande/historique/${getToken3()}`,
    {
      method: "GET",
      headers: {
   
        "Content-Type": "application/json",
      },
    }
  );

  if (response.status === 204) {
    return {}; // no data
  }

  if (!response.ok) {
    throw new Error("Failed to fetch data" + console.error());
  }

  return response.json();
}

export async function deleteCommandes() {
  await fetch(`${API_URL}/commande/clear-to-delivered`, {
    method: "DELETE",
  });
}