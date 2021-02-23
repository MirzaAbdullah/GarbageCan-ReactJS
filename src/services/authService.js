import http from "./httpService";
import JwtDecode from "jwt-decode";

const apiEndpoint = "/Security";
const tokenKey = "token";

//Setting token to Axios in Http Service to ensure no-Bidirectional dependencies
http.setJwt(getJwt());

export async function login(email, password) {
  const { data: jwt } = await http.post(`${apiEndpoint}/LoginUser`, {
    email: email,
    password: password,
  });

  //Set To Local Browser
  localStorage.setItem(tokenKey, jwt["token"]);
}

export async function register(email, password, firstname, lastname, username,phoneno, roleId, setToken) {
  const { data: jwt } = await http.post(`${apiEndpoint}/RegisterUser`, {
    email: email,
    password: password,
    idRole:roleId,
    name: username,
    firstname: firstname,
    lastname: lastname,
    phoneNo:phoneno
  });

  if(setToken){
    //Set To Local Browser
  localStorage.setItem(tokenKey, jwt["token"]);
  } else {
    return jwt;
  }
}

export async function changePassword(userId, newPassword) {
  return await http.put(`${apiEndpoint}/ChangePassword`, {
    idUser: userId,
    password: newPassword
  });
}

export async function isPasswordValid(userId, oldPassword){
  return await http.get(`${apiEndpoint}/IsPasswordValid/${userId}/${oldPassword}`);
}

export async function forgetPassword(email){
  return await http.get(`${apiEndpoint}/ForgetPassword/${email}`);
}

export async function sendVerificationCode(userEmail){
  return await http.get(`${apiEndpoint}/SendVerificationCode/${userEmail}`);
}

export async function verifyUser(userEmail, verificationCode) {
  return await http.put(`${apiEndpoint}/VerifyUser`, {
    email: userEmail,
    verificationCode: verificationCode
  });
}

export async function getUserById(userId){
  return await http.get(`${apiEndpoint}/GetUserById/${userId}`);
}

export async function getUsersByRoleId(roleId){
  return await http.get(`${apiEndpoint}/GetUsersByRoleId/${roleId}`);
}

export async function isUserEmailExists(email){
  return await http.get(`${apiEndpoint}/IsUserExists/${email}`);
}

export async function isUserNameExists(username){
  return await http.get(`${apiEndpoint}/IsUserNameExists/${username}`);
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
  register,
  logout,
  loginWithJwt,
  isUserEmailExists,
  isUserNameExists,
  getJwt,
  getCurrentUser,
  isPasswordValid,
  changePassword,
  sendVerificationCode,
  verifyUser,
  getUserById,
  getUsersByRoleId,
  forgetPassword
};
