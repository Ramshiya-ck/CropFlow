import api from "./axios";

export const createRequest = (data) =>
  api.post("requests/create/", data);

export const myRequests = () =>
  api.get("requests/my/");

export const getRequestDetail = (id) =>
  api.get(`requests/${id}/`);




// manager actions
 
export const approveRequest = (id) =>
  api.post(`manager/requests/${id}/approve/`);

export const rejectRequest = (id) =>
  api.post(`manager/requests/${id}/reject/`);

export const managerPendingRequests = () =>
  api.get("manager/requests/pending-for-me/");
