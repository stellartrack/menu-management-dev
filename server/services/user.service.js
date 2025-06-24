// services/user.service.js

export const UserService = {
  getProfile: (user, laravelToken, nodeToken) => {
    if (!user?.sub) {
      throw new Error("User profile data missing");
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
      fin_year,
    } = user.sub;

    return {
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
      nodeToken,
    };
  },
};
