import http from "./httpService";

const apiEndpoint = "/PickupRequest";

export async function getAllPickupsByUserId(userId){
    return await http.get(`${apiEndpoint}/GetPickupRequestByUserId/${userId}`);
}

export async function getPickupRequestById(requestId){
    return await http.get(`${apiEndpoint}/GetPickupRequestById/${requestId}`);
}

export async function getPickupRequestByStatus(status){
    return await http.get(`${apiEndpoint}/GetPickupRequestByStatus/${status}`);
}

export async function deletePickupRequest(pcikupId){
    return await http.delete(`${apiEndpoint}/DeletePickupRequest/${pcikupId}`);
}

export async function updatePickupStatus(idRequest, pickupStatus){
    return await http.put(`${apiEndpoint}/UpdatePickupStatus`,{
        idRequest: idRequest,
        pickupStatus: pickupStatus
    });
}

export async function updateRequestDetailsByDriver(idRequest, pickupCost, requestDetails){
    return await http.put(`${apiEndpoint}/UpdatePickupStatus`,{
        idRequest: idRequest,
        pickup_Cost: pickupCost,
        requestDetails: requestDetails
    });
}

export async function createPickupRequest(userId, pickupDate, pickupTime, latitude, longitude, requestDetails ){
    return await http.post(`${apiEndpoint}/CreatePickupRequest`, {
        idUser: userId,
        pickupDate: pickupDate,
        pickupTime: pickupTime,
        pickup_Cost: 0,
        latitudes: latitude,
        longitudes: longitude,
        createdDate: new Date(),
        requestDetails: requestDetails
      });
}

export default{
    getAllPickupsByUserId,
    deletePickupRequest,
    createPickupRequest,
    getPickupRequestByStatus,
    getPickupRequestById,
    updateRequestDetailsByDriver
}