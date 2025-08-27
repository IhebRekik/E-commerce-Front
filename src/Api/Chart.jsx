import { API_URL } from "./Auth";

export async function fetchData() {
  const response = await fetch(`${API_URL}/data/`);

  if (response.status === 204) {
    return []; // no commandes
  }

  if (!response.ok) {
    throw new Error("Failed to fetch commandes");
  }

  return response.json();
}