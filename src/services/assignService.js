import http from "./httpService";

const apiEndpoint = "/Assign";

export async function assignPickup(driverId, requestIds ){
    return await http.post(`${apiEndpoint}/CreatePickupRequest`, {
        IdUser: driverId,
        ListRequestIds: requestIds
      });
}

export async function getAllAssignPickupsByDriverId(driverId){
    return await http.get(`${apiEndpoint}/GetAllAssignPickupsByDriverId/${driverId}`);
}

export default{
    assignPickup,
    getAllAssignPickupsByDriverId
}