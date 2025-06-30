// apis/role.api.js
export const create = (client, payload) =>
  client.post("/Roles_Insert", payload);

export const update = (client, payload) =>
  client.post("/Roles_Modify", payload);
export const remove = (client, payload) =>
  client.post("/Roles_delete", payload);
export const fetchGlobal = (client, params) =>
  client.get("/get_Roles_Global", { params });
export const fetchCompany = (client, params) =>
  client.get("/get_CompanyRoles_List", { params });
