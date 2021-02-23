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

export async function CreateUserDetails(userId, address1, address2, city, province, country){
    await http.post(`${apiEndpoint}/CreateUserDetails`, {
        idUser: userId,
        address1: address1,
        address2: address2,
        city: city,
        province: province,
        country: country
    });
}

export async function UpdateUserDetails(userDetailsId, userId, address1, address2, city, province, country){
    await http.put(`${apiEndpoint}/UpdateUserDetails`, {
        idUserDetail: userDetailsId,
        idUser: userId,
        address1: address1,
        address2: address2,
        city: city,
        province: province,
        country: country
    });
}

export default{
    getAllRoles,
    GetAllItems,
    GetUserDetailsById,
    CreateUserDetails,
    UpdateUserDetails
};