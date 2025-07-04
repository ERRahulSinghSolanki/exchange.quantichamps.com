export const isUserLoggedIn = () => {
  const token = localStorage.getItem("authToken");
  return !!token;
};

export const userId = localStorage.getItem("loggedUserId") || null;
export const shouldHideInfo = userId !== "1";
  
 export const API_URL = "https://api.quantichamps.com/api";  

 //export const API_URL = "http://localhost/quantichamps/api.quantichamps.com/public/api";
