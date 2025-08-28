import { getToken, getToken3 } from "@/configs";

export const API_URL = "https://e-commerce-back-production-bd14.up.railway.app";

export async function loginUser(email, motdepasse) {
  try {
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, motdepass: motdepasse })
    });

    const data = await response.json();
    console.log("Login response:", data, response.status);
    if (response.status === 200) {
      const now = new Date();
      const item = {
        value: data.token,
        expiry: now.getTime() + 10 * 60 * 60 * 1000, 
      };
       const item2 = {
        value: data.token2,
        expiry: now.getTime() + 10 * 60 * 60 * 1000, 
      };
      const item3 = {
        value: data.entreprise,
        expiry: now.getTime() + 10 * 60 * 60 * 1000, 
      };
      const item4 = {
        value: data.userName,
        expiry: now.getTime() + 10 * 60 * 60 * 1000,
      };
      localStorage.setItem("token", JSON.stringify(item));
      localStorage.setItem("token2", JSON.stringify(item2));
      localStorage.setItem("token3", JSON.stringify(item3));
      localStorage.setItem("token4", JSON.stringify(item4));
      return { success: true, message: "Login successful" };
    } else {
      return { success: false, message: data.message || "Login failed" };
    }
  } catch (error) {
    console.error("Erreur fetch:", error);
    return { success: false, message: "Erreur serveur" };
  }
}



export async function fetchUsers() {
  const response = await fetch(`${API_URL}/all`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: getToken3() })
  });

  if (response.status === 204) {
    return [];
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Aucune ustilisateur");
    }
    throw new Error("Failed to fetch commandes");
  }

  return response.json();
}


export function useOfflineNotifier() {
  const token = getToken();
  if (token) {
    navigator.sendBeacon(
      `${API_URL}/offline`,
      JSON.stringify({ username: token })
    );
  }
}
export function useOnlineNotifier() {
  const token = localStorage.getItem("token");
  if (token) {
    navigator.sendBeacon(
      `${API_URL}/online`,
      JSON.stringify({ username: token })
    );
  }
}
