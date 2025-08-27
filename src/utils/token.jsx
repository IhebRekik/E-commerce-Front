export function getToken() {
  const itemStr = localStorage.getItem("token");
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date();

  // Compare current time with stored expiry
  if (now.getTime() > item.expiry) {
    localStorage.removeItem("token"); // expired, cleanup
    return null;
  }

  return item.value; // return the JWT if valid
}

export const isLoggedIn = () => {
  return !!getToken(); // valid token exists and not expired
};


export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("token2");
  localStorage.removeItem("token3");
  localStorage.removeItem("token4");
};

export const getToken2 = () => {
  const itemStr = localStorage.getItem("token2");
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date();

  // Compare current time with stored expiry
  if (now.getTime() > item.expiry) {
    localStorage.removeItem("token2"); // expired, cleanup
    return null;
  }

  return item.value; // return the JWT if valid
};
export const getToken3 = () => {
  const itemStr = localStorage.getItem("token3");
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date();

  // Compare current time with stored expiry
  if (now.getTime() > item.expiry) {
    localStorage.removeItem("token3"); // expired, cleanup
    return null;
  }

  return item.value; // return the JWT if valid
};
export const getToken4 = () => {
  const itemStr = localStorage.getItem("token4");
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date();

  // Compare current time with stored expiry
  if (now.getTime() > item.expiry) {
    localStorage.removeItem("token4"); // expired, cleanup
    return null;
  }

  return item.value; // return the JWT if valid
};