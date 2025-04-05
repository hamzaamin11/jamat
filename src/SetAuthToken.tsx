import axios from "axios";
const setAuthToken = (token: string) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = token;
    localStorage.setItem("jwtToken", JSON.stringify(token));
  } else {
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("jwtToken");
  }
};
export default setAuthToken;
