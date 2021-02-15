import http from "./httpService";

const apiEndpoint = "/Security";

export async function getAllUsers(){
    return await http.get(`${apiEndpoint}/GetAllUsers`);
}

export async function deactivateUserAccount(userId){
    return await http.put(`${apiEndpoint}/DeactivateUserAccount`, {
        idUser: userId
      });
}

export default {
    getAllUsers,
    deactivateUserAccount
  };