exports.getUserProfile = (req, res) => {

  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const userSub = req.user.sub;
  const laravelToken = req.laravelToken;
  const nodeToken = req.nodeToken;

  if (!userSub) {
    // Optional: Log warning, then respond with empty or error
    console.warn("Warning: req.user.sub is missing");
    return res.status(400).json({ success: false, message: "User profile data missing" });
  }

  const {
    emp_code,
    emp_id,
    emp_name,
    company_id,
    company_name,
    email_id,
    mobile_no,
    designation,
    region_name,
    branch_name,
    employee_type,
    fin_year
  } = userSub;

  res.json({
    success: true,
    data: {
      emp_code,
      emp_id,
      emp_name,
      company_id,
      company_name,
      email_id,
      mobile_no,
      designation,
      region_name,
      branch_name,
      employee_type,
      fin_year,
      laravelToken,
      nodeToken
    },
  });
};
