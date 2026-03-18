import api from "./axios";

export const createRequest = (data) =>
  api.post("requests/create/", data);

export const myRequests = () =>
  api.get("requests/my/");

export const getRequestDetail = (id) =>
  api.get(`requests/${id}/`);




// manager actions

export const approveRequest = (id) =>
  api.post(`requests/approve/${id}/`);

export const rejectRequest = (id) =>
  api.post(`requests/reject/${id}/`);

export const managerPendingRequests = () =>
  api.get("requests/pending-for-me/");
