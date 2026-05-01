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

export const getManagerStats = () =>
  api.get("requests/manager-stats/");

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

// Enterprise Admin CRUD
export const adminGetRoles = () => api.get("accounts/admin/roles/");
export const adminCreateRole = (data) => api.post("accounts/admin/roles/", data);
export const adminUpdateRole = (id, data) => api.patch(`accounts/admin/roles/${id}/`, data);
export const adminDeleteRole = (id) => api.delete(`accounts/admin/roles/${id}/`);

export const adminGetUsersFull = () => api.get("accounts/admin/users-full/");
export const adminCreateUserFull = (data) => api.post("accounts/admin/users-full/", data);
export const adminUpdateUserFull = (id, data) => api.patch(`accounts/admin/users-full/${id}/`, data);
export const adminDeleteUser = (id) => api.delete(`accounts/admin/users-full/${id}/`);

export const adminGetGroups = () => api.get("accounts/admin/groups/");
export const adminCreateGroup = (data) => api.post("accounts/admin/groups/", data);
export const adminDeleteGroup = (id) => api.delete(`accounts/admin/groups/${id}/`);

export const adminGetRequestsFull = () => api.get("requests/admin/requests-full/");
export const adminDeleteRequest = (id) => api.delete(`requests/admin/requests-full/${id}/`);

export const adminGetWorkflowInstances = () => api.get("workflows/admin/instances/");
