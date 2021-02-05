import http from "./httpService";

const apiEndpoint = "/Security";

/**
 * method to return url for specific functionalities based on option param
 * @param {*} option - Takes a string to define what functionality / data is needed from service
 * @param {*} id - Id of a pending mosque as a string or JSON (Optional)
 */
function approveUrl(option, id) {
  let url = null;
  switch (option) {
    case "approve":
      url = `${apiEndpoint}/ApproveAccount`;
      break;
    case "delete":
      url = `${apiEndpoint}/DeletePendingUser/${id}`;
      break;
    default:
      url = `${apiEndpoint}/GetAllPendingUsers`;
      break;
  }

  return url;
}

export function getAllPendingAccounts() {
  return http.get(approveUrl("all", null));
}

export function approveAccount(userId) {
  var userModel = { Uid: userId };
  return http.put(approveUrl("approve", null), userModel);
}

export function deleteAccount(userId) {
  return http.delete(approveUrl("delete", userId));
}
