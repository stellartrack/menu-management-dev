// apis/menu.api.js

const create = (client, payload) =>
  
  client.post("/Menu_Insert_Update", payload);

const fetchTree = (
  client,
  { dept_cabinet_id = "%", ParentMenuID = "%", MenuID = "%" } = {}
) =>
  client.get("/Get_Menu_list_tree", {
    params: { dept_cabinet_id, ParentMenuID, MenuID },
  });

const remove = (client, payload) =>
  client.post("/Menu_Delete", payload);

// Export only aliased names
export { create, fetchTree, remove };
