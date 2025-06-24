// apis/role.api.js
export const create = (client, payload) => client.post("/role", payload);
export const update = (client, payload) => client.put("/role/update", payload);
export const remove = (client, payload) => client.post("/role/delete", payload);
export const fetchGlobal = (client, payload) => client.post("/roles/global", payload);
export const fetchCompany = (client, payload) => client.post("/roles/company", payload);
