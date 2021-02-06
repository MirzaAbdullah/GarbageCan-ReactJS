import http from "./httpService";

const apiEndpoint = "/GarbageCan";

export async function getAllRoles(){
    return http.get(`${apiEndpoint}/GetAllRoles`);
}

export default{
    getAllRoles
};