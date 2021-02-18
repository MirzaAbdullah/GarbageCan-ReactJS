import http from "./httpService";

const apiEndpoint = "/GarbageCan";

export async function getAllRoles(){
    return http.get(`${apiEndpoint}/GetAllRoles`);
}

export async function GetAllItems(){
    return http.get(`${apiEndpoint}/GetAllItems`);
}

export async function GetUserDetailsById(userId){
    return http.get(`${apiEndpoint}/GetUserDetailsById/${userId}`);
}

export default{
    getAllRoles,
    GetAllItems
};