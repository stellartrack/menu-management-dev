import React, { useEffect, useState, useMemo, lazy, Suspense } from "react";
import DataTable from "react-data-table-component";
import { FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";
import axiosAuthInstance from "../../api/axiosAuthInstance";
import axiosMenuInstance from "../../api/axiosMenuInstance";
import columns from "./columns";
import useFilteredData from "../../utils/hooks/useFilteredData";

const ManageForm = lazy(() => import("./ManageForm"));

const Roles = () => {
  const [data, setData] = useState([]);
  const [pending, setPending] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [updateData, setUpdateData] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [cabinetOptions, setCabinetOptions] = useState([]);
  const filteredData = useFilteredData(data, filterText);

  useEffect(() => {
    fetchRecords();
    fetchAllCabinetOptions();
  }, []);

  const fetchAllCabinetOptions = async () => {
    try {
      const response = await axiosAuthInstance.get(
        `/api/auth/cabinet/list?discontinue_tag=N&search_param=`
      );
      const cabinets = response.data.data || [];
      const options = cabinets.map((cabinet) => ({
        label: cabinet.Cabinet_Name,
        value: cabinet.CabinetID,
      }));
      setCabinetOptions(options);
    } catch (error) {
      toast.error("Failed to load the list of cabinets.");
    }
  };

  const fetchRecords = async () => {
    setPending(true);
    try {
      const response = await axiosMenuInstance.get(
        "api/proxy/role/roles/global",
        {
          params: { RoleName: "%", log_NewEmpid: 1 },
        }
      );

      const enrichedData = response.data.data.map((apiItem) => ({
        id: apiItem.roleID,
        name: apiItem.roleName,
        CabinetID: apiItem.cabinetID,
        CabinetName: apiItem.cabinetName,
      }));

      setData(enrichedData);
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch role records";
      toast.error(`Error fetching roles: ${errorMsg}`);
    } finally {
      setPending(false);
    }
  };

  const handleDelete = async (row) => {
    if (
      window.confirm(`Are you sure you want to delete the role: "${row.name}"?`)
    ) {
      try {
        await axiosMenuInstance.post(`/api/proxy/role/role/${row.id}`, {
          Role_CMPID_ID: Number(row.id),
          CMPID: 1,
          log_NewEmpid: 115812,
          RoleName: row.name, // ensure exact match
        });
        toast.success("Role deleted successfully!");
        fetchRecords();
      } catch (error) {
        const errorMsg =
          error?.response?.data?.message ||
          error.message ||
          "Failed to delete role";
        toast.error(`Error: ${errorMsg}`);
      }
    }
  };

  const handleModal = (row = {}) => {
    setUpdateData(row);
    setShowModal(true);
  };

  const subHeaderComponent = useMemo(
    () => (
      <div className="row w-100 text-start">
        <div className="col-sm-4">
          <div className="input-group">
            <input
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="form-control"
              placeholder="Search roles..."
            />
            <span className="input-group-text">
              <FiSearch />
            </span>
          </div>
        </div>
        <div className="col-sm-3">
          <button className="btn btn-primary" onClick={() => handleModal()}>
            Add New
          </button>
        </div>
      </div>
    ),
    [filterText]
  );

  return (
    <>
      <div className="card m-4">
        <div className="card-body">
          <h5 className="card-title">Role Management</h5>
          <DataTable
            columns={columns(handleModal, handleDelete)}
            data={filteredData}
            pagination
            progressPending={pending}
            subHeader
            subHeaderComponent={subHeaderComponent}
            persistTableHead
          />
        </div>
      </div>

      <Suspense fallback={<div>Loading Form...</div>}>
        {showModal && (
          <ManageForm
            updateData={updateData}
            showModal={showModal}
            setShowModal={setShowModal}
            fetchRecords={fetchRecords}
            cabinetOptions={cabinetOptions}
          />
        )}
      </Suspense>
    </>
  );
};

export default Roles;
