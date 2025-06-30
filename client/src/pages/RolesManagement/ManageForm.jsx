import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FaSave, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import axiosMenuInstance from "../../api/axiosMenuInstance";
import { handleFormSubmit } from "../../utils/handleFormSubmit";
import CustomSelect from "../../components/styled/CustomSelect";
import "./CustomModal.css";

const initialState = {
  id: "",
  name: "",
  CabinetID: "",
};

const ManageForm = ({ updateData, showModal, setShowModal, fetchRecords, cabinetOptions }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
   
     const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialState,
    mode: "onChange",
  });

  
   useEffect(() => {
    if (updateData?.id) {
      reset({
        id: updateData.id,
        name: updateData.name,
        CabinetID: updateData.CabinetID,
      });
    } else {
      reset(initialState);
    }
  }, [updateData, reset]);



  const handleCancel = () => {
    setShowModal(false);
    reset(initialState);
  };

   const onSubmit = (formData) => {
    const requestFn = () => {
      const commonPayload = { CMPID: 1, log_NewEmpid: 1 };
      if (formData.id) {
        // UPDATE action with CabinetID
        const modifyPayload = { ...commonPayload, RoleName: formData.name, CabinetID: Number(formData.CabinetID),Role_CMPID_ID: Number(formData.id) };
        // CORRECTED URL
        return axiosMenuInstance.put(`api/proxy/role/role/${formData.id}`, modifyPayload);
      } else {
        // CREATE action with CabinetID
        const insertPayload = { ...commonPayload, RoleName: formData.name, CabinetID: Number(formData.CabinetID) };
        // CORRECTED URL
        return axiosMenuInstance.post("api/proxy/role/role", insertPayload);
      }
    };

     handleFormSubmit({
      requestFn,
      onSuccess: () => { handleCancel(); fetchRecords(); },
      onError: (error) => {
        const rawMsg = error?.response?.data?.message || error?.message || "Something went wrong.";
        toast.error(`Submission failed: ${rawMsg}`);
      },
      setSubmitting: setIsSubmitting,
    });
  };

  if (!showModal) {
    return null;
  }

    return (
    <div className="modal-backdrop" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h5 className="modal-title">{updateData?.id ? "Edit Role" : "Add New Role"}</h5>
          <button type="button" className="modal-close-btn" onClick={handleCancel}>×</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit(onSubmit)} className="row gx-3">
            <div className="col-md-6 mb-3">
              <label className="form-label">Role Name</label>
              <Controller
                name="name"
                control={control}
                rules={{ required: "Role Name is required" }}
                render={({ field }) => (
                  <input {...field} className={`form-control ${errors.name ? "is-invalid" : ""}`} type="text" />
                )}
              />
              {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
            </div>

            {/* --- ADDED: The Cabinet dropdown field --- */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Cabinet</label>
              <Controller
                name="CabinetID"
                control={control}
                rules={{ required: "Cabinet is required" }}
                render={({ field }) => (
                  <CustomSelect
                    classNamePrefix="select"
                    options={cabinetOptions}
                    value={cabinetOptions.find(c => c.value === field.value)}
                    onChange={(option) => field.onChange(option ? option.value : "")}
                    isClearable
                    placeholder="Select a cabinet..."
                  />
                )}
              />
              {errors.CabinetID && <small className="text-danger">{errors.CabinetID.message}</small>}
            </div>

            <div className="col-12 d-flex gap-2 mt-4 justify-content-start">
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                <FaSave /> {isSubmitting ? "Saving..." : "Save"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={isSubmitting}>
                <FaTimes /> Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManageForm;