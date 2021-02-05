import http from "./httpService";
import JwtDecode from "jwt-decode";

const apiEndpoint = "/Security/LoginUser";
const tokenKey = "token";

//Setting token to Axios in Http Service to ensure no-Bidirectional dependencies
http.setJwt(getJwt());

export async function login(email, password) {
  const { data: jwt } = await http.post(apiEndpoint, {
    email: email,
    password: password,
  });

  //Set To Local Browser
  localStorage.setItem(tokenKey, jwt["token"]);
}

export function loginWithJwt(jwt) {
  //Set To Local Browser
  localStorage.setItem(tokenKey, jwt);
}

export function logout() {
  //Removing item from Local Storage
  localStorage.removeItem(tokenKey);
}

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return JwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

export default {
  login,
  logout,
  loginWithJwt,
  getJwt,
  getCurrentUser,
};
