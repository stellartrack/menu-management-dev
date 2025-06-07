const { validationResult } = require("express-validator");
const apiClient = require("../utils/apiClient");

exports.menuInsertUpdate = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return res.status(400).json({
      success: false,
      message: firstError.msg,
    });
  }

  try {
    const payload = {
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      loguserNewEMPID: req.user?.sub.new_emp_id || null,
    };

    const response = await apiClient.post("/Menu_Insert_Update", payload);

    if (response.data?.result == 1) {
      // Determine message based on presence of menuID
      const isUpdate = !!req.body.menuID;  // truthy means update
      const message = isUpdate
        ? "Menu updated successfully"
        : "Menu inserted successfully";

      return res.status(201).json({
        success: true,
        message,
        data: response.data,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: response.data?.message || "Failed to insert/update menu",
        data: response.data,
      });
    }
  } catch (error) {
    const errMsg = error.response?.data?.error || error.message;
    return res.status(500).json({
      success: false,
      message: errMsg || "Internal server error",
    });
  }
};

exports.getMenuTree = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return res.status(400).json({ success: false, message: firstError.msg });
  }

  try {
    const {
      dept_cabinet_id = '%',
      ParentMenuID = '%',
      MenuID = '%'
    } = req.query;

    const response = await apiClient.get(
      `/Get_Menu_list_tree?dept_cabinet_id=${dept_cabinet_id || '%'}&ParentMenuID=${ParentMenuID || '%'}&MenuID=${MenuID || '%'}`
    );

    if (response.data) {
      return res.status(200).json({
        success: true,
        message: 'Menu list fetched successfully',
        data: response.data
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'No menu data found'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }


};



exports.menuDelete = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return res.status(400).json({
      success: false,
      message: firstError.msg,
    });
  }

  try {
    const payload = {
      ...req.body,
      loguserNewEMPID: req.user?.sub?.new_emp_id || null,
    };

    const response = await apiClient.post("/Menu_Delete", payload);

    if (response.data?.result == 1) {
      return res.status(200).json({
        success: true,
        message: response.data.message || "Menu deleted successfully",
        data: response.data,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: response.data?.message || "Failed to delete menu",
        data: response.data,
      });
    }
  } catch (error) {
    const errMsg = error.response?.data?.error || error.message;
    return res.status(500).json({
      success: false,
      message: errMsg || "Internal server error",
    });
  }
};
