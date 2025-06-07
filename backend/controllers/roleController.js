exports.createRole = (req, res) => {
  res.status(200).json({ message: "Role created (mock)" });
};

exports.mapRoleToMenus = (req, res) => {
  res.status(200).json({ message: "Role-to-Menu mapping saved (mock)" });
};

exports.getMenusByRole = (req, res) => {
  const roleId = req.params.id;
  res.status(200).json({ message: `Menus for role ${roleId} fetched (mock)` });
};