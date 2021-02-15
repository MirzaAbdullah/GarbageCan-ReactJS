import http from "./httpService";

const apiEndpoint = "/PickupRequest";

export async function getAllPickupsByUserId(userId){
    return await http.get(`${apiEndpoint}/GetPickupRequestByUserId/${userId}`);
}

export async function deletePickupRequest(pcikupId){
    return await http.delete(`${apiEndpoint}/DeletePickupRequest/${pcikupId}`);
}

export async function createPickupRequest(userId, pickupDate, pickupTime, latitude, longitude, requestDetails ){
    return await http.put(`${apiEndpoint}/CreatePickupRequest`, {
        idUser: userId,
        pickupDate: pickupDate,
        pickupTime: pickupTime,
        pickupCost: 0,
        latitude: latitude,
        longitude: longitude,
        requestDetails: requestDetails
      });
}

export default{
    getAllPickupsByUserId,
    deletePickupRequest,
    createPickupRequest
}