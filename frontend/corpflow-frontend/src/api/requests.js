import api from "./axios";

export const createRequest = (data) =>
  api.post("requests/create/", data);

export const myRequests = () =>
  api.get("requests/my/");

export const myDocuments = () =>
  api.get("requests/my-documents/");

export const myHistory = () =>
  api.get("requests/my-history/");

export const getRequestDetail = (id) =>
  api.get(`requests/${id}/`);




// manager actions

export const approveRequest = (id) =>
  api.post(`requests/approve/${id}/`);

export const rejectRequest = (id) =>
  api.post(`requests/reject/${id}/`);

export const managerPendingRequests = () =>
  api.get("requests/pending-for-me/");

export const getDepartmentDashboard = (department) =>
  api.get(`requests/dashboard/${department}/`);

export const getAssets = () =>
  api.get("requests/assets/");

export const assignAsset = (id, data) =>
  api.patch(`requests/assets/${id}/`, data);

export const getAdminStats = () =>
  api.get("requests/admin-stats-dashboard/");

export const getFlows = () =>
  api.get("workflows/flows/");

export const createFlow = (data) =>
  api.post("workflows/flows/", data);

export const deleteFlow = (id) =>
  api.delete(`workflows/flows/${id}/`);

export const addWorkflowStep = (flowId, data) =>
  api.post(`workflows/flows/${flowId}/steps/`, data);

export const deleteWorkflowStep = (id) =>
  api.delete(`workflows/steps/${id}/`);
