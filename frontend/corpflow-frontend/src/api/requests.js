import api from "./axios";

export const createRequest = (data) =>
  api.post("requests/create/", data);

export const myRequests = () =>
  api.get("requests/my/");

export const getRequestDetail = (id) =>
  api.get(`requests/${id}/`);

// export const getDashboardData = () =>
//   api.get("requests/dashboard/");