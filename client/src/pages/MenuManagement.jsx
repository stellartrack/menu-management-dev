import React, { useState, useEffect, useRef, useCallback } from "react";
import { Tree } from "@minoru/react-dnd-treeview";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaFolder, FaFolderOpen, FaInfoCircle } from 'react-icons/fa';
import './MenuManagement.css'
import axiosAuthInstance from "../api/axiosAuthInstance";
import axiosMenuInstance from "../api/axiosMenuInstance";
import { toast } from "react-toastify";
import { BsInfoCircle,BsArrowCounterclockwise,BsSearch,BsMenuButtonWide,BsBoxSeam,BsFolderFill  } from 'react-icons/bs';
import CustomSelect from "../components/styled/CustomSelect";
import CustomAsyncSelect from "../components/styled/CustomAsyncSelect";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { mapTreeData } from "../utils/mapTreeData";



const MenuManagement = () => {
  const [selectedCabinet, setSelectedCabinet] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [treeData, setTreeData] = useState([]);
  const [filteredTreeData, setFilteredTreeData] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState(null);
  const [openIds, setOpenIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const nodeRefs = useRef({});
  const treeRef = useRef(null);
  const formRef = useRef(null);


  const [highlightNodeId, setHighlightNodeId] = useState(null);

  const [newlyAddedNodeId, setNewlyAddedNodeId] = React.useState(null);
  const [addingNewMainMenu, setAddingNewMainMenu] = useState(false);

  const isSidebarVisible = selectedNode || addingNewMainMenu;
  const [showNoData, setShowNoData] = useState(false);



  const menuTypeOptions = [
    { value: "1", label: "Main Menu" },
    { value: "2", label: "Sub Menu" },
    { value: "3", label: "Action Menu" },
  ];

  const menuTypeLabelMap = menuTypeOptions.reduce((acc, option) => {
    acc[option.value] = option.label;
    return acc;
  }, {});

  const menuTypeOptionsWithAll = [
    { value: "", label: "All Menu Types" },
    ...menuTypeOptions,
  ];

  const [inputFields, setInputFields] = useState({
    menuName: '',
    url: '',
    target: '_self',
    icon: '',
    position: 1,
    menuType: '1',
  });

  const fetchTreeData = async (cabinetId, selectedNodeId = null, openNodeIds = []) => {
    if (!cabinetId) {
      setTreeData([]);
      setFilteredTreeData([]);
      setSelectedNode(null);
      setEditMode(false);
      setAddingNewMainMenu(false);
      setInputFields({ text: "", icon: "", url: "", position: 1, menuType: "1" ,target : '_self'});
      setOpenIds([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axiosMenuInstance.get("/api/proxy/menus", {
        params: { dept_cabinet_id: cabinetId },
      });

      const rawData = res.data?.data || [];
      const normalizedData = rawData.map(item => ({ ...item, parentId: item.parentId ?? 0 }));
      const flatTree = mapTreeData(normalizedData);

      setTreeData(flatTree);
      setFilteredTreeData(flatTree);

      const allNodeIds = flatTree.map(n => n.id);
      const filteredOpenIds = openNodeIds.filter(id => allNodeIds.includes(id));
      setOpenIds(filteredOpenIds);

      const restoredSelectedNode = selectedNodeId ? flatTree.find(n => n.id === selectedNodeId) : null;
      setSelectedNode(restoredSelectedNode);
      setHighlightNodeId(restoredSelectedNode?.id ?? null);

      if (!restoredSelectedNode) {
        setEditMode(false);
        setAddingNewMainMenu(false);
        setInputFields({ text: "", icon: "", url: "", position: 1, menuType: "1", target : '_self' });
      } else {
        setInputFields({
          text: restoredSelectedNode.text || "",
          icon: restoredSelectedNode.icon || "",
          url: restoredSelectedNode.url || "",
          position: restoredSelectedNode.position || 1,
          menuType: restoredSelectedNode.menuType || "1",
          target: restoredSelectedNode.target || "",
        });
      }
    } catch (err) {
      toast.error("Failed to fetch menu data");
    } finally {
      setLoading(false);
    }
  };


  const handleDrop = async (newTree, { dragSourceId, dropTargetId }) => {
    const draggedNode = treeData.find((node) => node.id === dragSourceId);
    if (!draggedNode) return;

    const dropTargetNode = treeData.find((node) => node.id === dropTargetId);
    const newParentId = dropTargetNode ? dropTargetNode.id : 0;

    // Calculate new position for dragged node among siblings
    // We'll update siblings position assuming dragged node is dropped last
    // You can adjust logic if you want different positioning
    const siblings = newTree
      .filter((node) => node.parent === newParentId)
      .sort((a, b) => a.position - b.position);

    // New position will be the next after current siblings count
    const newOrder = siblings.length + 1;

    const payload = {
      deptCabinetId: selectedCabinet.value, // always from your selected cabinet
      menuID: draggedNode.id,
      parentID: newParentId === 0 ? null : newParentId,
      position: newOrder,
      menuName: draggedNode.text || "",
      url: draggedNode.url || "",
      target: draggedNode.target || "_self",
      icon: draggedNode.icon || "",
      basePrice: draggedNode.basePrice || 0,
      isVisible: draggedNode.isVisible !== undefined ? draggedNode.isVisible : true,
      createdAt: draggedNode.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(), // updated now
      loguserNewEMPID: "115812",           // or get from context/auth
      MenuType: draggedNode.menuType || "1",
      type: "drop",                        // signal this is a drop reposition
    };

    try {
      // Call API first
      await axiosMenuInstance.post("/api/proxy/menu", payload);

      // After success, update local treeData accordingly
      // Update parent of dragged node
      const updatedTree = newTree.map((node) => {
        if (node.id === dragSourceId) {
          return { ...node, parent: newParentId, position: newOrder };
        }
        return node;
      });

      // Reposition siblings (including dragged node) based on new position
      const reorderedSiblings = updatedTree
        .filter((node) => node.parent === newParentId)
        .sort((a, b) => a.position - b.position)
        .map((node, index) => ({ ...node, position: index + 1 }));

      // Other nodes that are not siblings
      const others = updatedTree.filter((node) => node.parent !== newParentId);

      // Combine to final tree
      setTreeData([...others, ...reorderedSiblings]);
    } catch (error) {
      toast.error("Failed to update menu position");
      // optionally reload tree or revert UI
    }
  };




  const handleAddSubmenu = (parentNode) => {
    if (!parentNode.droppable) {
      const updatedTree = treeData.map((node) =>
        node.id === parentNode.id ? { ...node, droppable: true } : node
      );
      setTreeData(updatedTree);
    }

    const newMenuType = parentNode.parent === 0 ? "2" : "3";

    const childrenCount = treeData.filter((n) => n.parent === parentNode.id).length;

    const newNode = {
      id: null,
      parent: parentNode.id,
      droppable: false,
      text: "",
      icon: "",
      url: "",
      position: treeData.filter((n) => n.parent === parentNode.id).length + 1,
      menuType: newMenuType,
    };

    setOpenIds((prev) => {
      if (!prev.includes(parentNode.id)) {
        return [...prev, parentNode.id];
      }
      return prev;
    });

    treeRef.current?.open([parentNode.id]);

    // setTreeData((prev) => [...prev, newNode]);
    setSelectedNode(newNode);
    setEditMode(true);
    setAddingNewMainMenu(false);
    setInputFields({ text: newNode.text, icon: newNode.icon, url: newNode.url, position: newNode.position, menuType: newNode.menuType, target: newNode.target });
    setTimeout(() => {
      setNewlyAddedNodeId(newNode.id);
    }, 10);
  };

  const handleSelectNode = (node) => {
    setSelectedNode(node);
    setEditMode(false);
    setAddingNewMainMenu(false);

    const ancestorIds = getAncestorIds(node.id, treeData);
    const newOpenIdsSet = new Set(openIds);

    // Add all ancestor IDs
    ancestorIds.forEach((id) => newOpenIdsSet.add(id));

    // Optionally open the selected node if it's droppable
    if (node.droppable) {
      newOpenIdsSet.add(node.id);
    }

    const newOpenIds = Array.from(newOpenIdsSet);
    setOpenIds(newOpenIds);

    // Immediately open nodes using treeRef
    if (treeRef.current?.open) {
      treeRef.current.open(newOpenIds);
    }

    // Scroll into view & highlight
    setTimeout(() => {
      const el = nodeRefs.current[node.id];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add("highlighted");

        setHighlightNodeId(node.id);

        setTimeout(() => {
          el.classList.remove("highlighted");
          setHighlightNodeId(null);
        }, 1500);
      }
    }, 300);
  };


  const handleEditClick = () => {
    if (selectedNode) setEditMode(true);
  };

  const handleCancel = () => {
    if (addingNewMainMenu) {
      setAddingNewMainMenu(false);
      setSelectedNode(null);
    } else {
      setEditMode(false);
      setInputFields({
        text: selectedNode.text || "",
        icon: selectedNode.icon || "",
        url: selectedNode.url || "",
        position: selectedNode.position || 1,
        menuType: selectedNode.menuType || "1",
        target: selectedNode.target || "",
      });
    }
  };


  const handleSave = async () => {

    if (!inputFields.text.trim()) {
      toast.warning("Menu Name is required.");
      return;
    }

    const isMainMenu = addingNewMainMenu;
    const parentId = isMainMenu ? 0 : selectedNode?.parent ?? 0;

    const payload = {
      menuID: isMainMenu ? null : selectedNode?.id || null,
      deptCabinetId: selectedCabinet.value,
      position: Number(inputFields.position) || 1,
      menuName: inputFields.text,
      url: inputFields.url || "",
      parentId: parentId,
      target: inputFields.target || "_self",
      icon: inputFields.icon || "",
      basePrice: 0,
      isVisible: true,
      MenuType: inputFields.menuType,
    };



    try {

      const response = await axiosMenuInstance.post("/api/proxy/menu", payload);

      if (response.data.success) {
        toast.success(response.data.message || "Menu saved successfully.");

        await fetchTreeData(
          selectedCabinet.value,
          selectedNode?.id ?? null,  
          openIds ?? []
        );


        setEditMode(false);
        setAddingNewMainMenu(false);

      } else {
        toast.error(response.data.message || "Failed to save menu.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving menu.");
    }
  };


  const confirmDelete = (node) => {
    setNodeToDelete(node);
    setShowDeleteModal(true);
  };

  const performDelete = async () => {
  if (!nodeToDelete) {
    toast.warning("No menu selected for deletion.");
    return;
  }

  try {
    const payload = {
  menuID: nodeToDelete.id,
  deptCabinetId: selectedCabinet.value,
  position: Number(nodeToDelete.position) || 1,
  menuName: nodeToDelete.text || "",
  url: nodeToDelete.url || "",
  parentId: nodeToDelete.parent || 0,
  target: nodeToDelete.target || "_self",
  icon: nodeToDelete.icon || "",
  basePrice: nodeToDelete.basePrice || 0,
  isVisible: nodeToDelete.isVisible !== undefined ? nodeToDelete.isVisible : true,
  MenuType: nodeToDelete.menuType || "",
};


    const response = await axiosMenuInstance.post("/api/proxy/menu/delete", payload);

    if (response.data.success) {
      toast.success(response.data.message || "Menu deleted successfully.");

      // Remove the deleted node (and children if backend deleted them) from frontend tree
      // Since backend deletes children, just remove the node itself locally
      setTreeData(treeData.filter((node) => node.id !== nodeToDelete.id));

      // Clear selected node if it was deleted
      if (selectedNode?.id === nodeToDelete.id) setSelectedNode(null);

      setNodeToDelete(null);
      setShowDeleteModal(false);

      // Optionally refresh the entire tree from backend
      await fetchTreeData(selectedCabinet.value, null, []);
    } else {
      toast.error(response.data.message || "Failed to delete menu.");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Error deleting menu.");
  }
};



  const handleAddMainMenu = () => {
    if (!selectedCabinet) {
      toast.error("Please select a cabinet before adding a menu.");
      return;
    }

    // Prepare new menu data but don't add to treeData yet
    const newMenuDraft = {
      id: null, // will be set after save
      parent: 0,
      droppable: true,
      text: "",
      icon: "",
      url: "",
      position: treeData.filter((node) => node.parent === 0).length + 1,
      menuType: "1",
    };

    setSelectedNode(newMenuDraft);
    setEditMode(true);
    setAddingNewMainMenu(true);
    setInputFields({
      text: newMenuDraft.text,
      icon: newMenuDraft.icon,
      url: newMenuDraft.url,
      position: newMenuDraft.position,
      menuType: newMenuDraft.menuType,
      target: "_self",
    });
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);

  };



  const toggleNode = (id) =>
    setOpenIds((ids) =>
      ids.includes(Number(id))
        ? ids.filter((i) => i !== Number(id))
        : [...ids, Number(id)]
    );


  const [menuTypeFilter, setMenuTypeFilter] = useState("");

  const handleSearch = (value) => {
    setSearchText(value);
  };

  // Clear search handler
  const handleClearSearch = () => {
    setSearchText("");
    setMenuTypeFilter(""); // clear menu type filter if you want
  };

  const getAncestorIds = useCallback((nodeId, data) => {
    const ancestors = [];
    let currentNode = data.find((node) => node.id === nodeId);

    while (currentNode && currentNode.parent !== 0) {
      const parentId = currentNode.parent;
      ancestors.push(parentId);
      currentNode = data.find((node) => node.id === parentId);
    }

    return ancestors;
  }, []);


  // Effect to open nodes on tree once data and openIds are set
  useEffect(() => {
    if (!treeRef.current || treeData.length === 0 || openIds.length === 0) return;

    treeRef.current.open(openIds);
  }, [treeData]);


  useEffect(() => {
    let timeout;

    if (highlightNodeId && nodeRefs.current[highlightNodeId]) {
      timeout = setTimeout(() => {
        nodeRefs.current[highlightNodeId].scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } else {
      timeout = setTimeout(() => {
        openIds.forEach(id => {
          const el = nodeRefs.current[id];
          if (el && el.scrollIntoView) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
      }, 100);
    }

    return () => clearTimeout(timeout);
  }, [openIds, highlightNodeId]);


  useEffect(() => {
    fetchTreeData(selectedCabinet?.value);
  }, [selectedCabinet]);




  useEffect(() => {
    if (!loading && filteredTreeData.length === 0) {
      const timer = setTimeout(() => setShowNoData(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowNoData(false);
    }
  }, [loading, filteredTreeData]);




  useEffect(() => {
    if (selectedNode) {
      setInputFields({
        text: selectedNode.text || "",
        icon: selectedNode.icon || "",
        url: selectedNode.url || "",
        position: selectedNode.position || 1,
        menuType: selectedNode.menuType || "1",
        target: selectedNode.target || "",
      });

      setTimeout(() => {
        if (formRef.current) {
          formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  }, [selectedNode]);




  useEffect(() => {
    if (!newlyAddedNodeId) return;

    const newNode = treeData.find((n) => n.id === newlyAddedNodeId);
    if (!newNode) return;

    const parentId = newNode.parent;

    // Open the parent node (if Tree provides this method)
    if (treeRef.current?.open) {
      treeRef.current.open([parentId]);
    }

    // Delay to allow Tree re-render and DOM to update
    const timer = setTimeout(() => {
      const el = nodeRefs.current[newlyAddedNodeId];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("highlighted");
        setHighlightNodeId(newlyAddedNodeId);

        setTimeout(() => {
          el.classList.remove("highlighted");
          setHighlightNodeId(null);
          setNewlyAddedNodeId(null);
        }, 2000);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [newlyAddedNodeId, treeData]);



  useEffect(() => {
    if (!treeData?.length) {
      setFilteredTreeData([]);
      return;
    }

    let filtered = treeData;

    if (menuTypeFilter) {
      filtered = filtered.filter((node) => node.menuType === menuTypeFilter);
    }

    if (searchText.trim()) {
      const query = searchText.toLowerCase();
      const matchedNodes = filtered.filter((node) =>
        node.text.toLowerCase().includes(query)
      );

      const ancestorIds = new Set();
      matchedNodes.forEach((node) => {
        getAncestorIds(node.id, filtered).forEach((id) => ancestorIds.add(id));
      });

      filtered = filtered.filter(
        (node) => matchedNodes.includes(node) || ancestorIds.has(node.id)
      );
    }

    setFilteredTreeData(filtered);
  }, [treeData, menuTypeFilter, searchText, getAncestorIds]);


  const loadCabinets = async (inputValue) => {
    const response = await axiosAuthInstance.get(
      `/api/auth/cabinet/list?search_param=${inputValue}&discontinue_tag=N`
    );

    // response.data is the full JSON you shared
    const cabinets = response.data.data || []; // access the `data` key from your JSON response

    return cabinets.map((cabinet) => ({
      label: cabinet.Cabinet_Name,
      value: cabinet.CabinetID,
    }));
  };

  function getBadgeClass(menuTypeDesc) {
    switch (menuTypeDesc.toLowerCase()) {
      case 'main module':
        return 'badge-main-module';
      case 'sub module':
        return 'badge-sub-module';
      case 'menu':
        return 'badge-menu';
      default:
        return 'badge-secondary';
    }
  }

  return (

    <div className="card rounded-4 border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="card-title">
            <BsFolderFill className="me-2 icon-primary" size={12} />
            Menu Management
          </h6>
          <button
            className="btn btn-primary d-flex align-items-center justify-content-center gap-1"
            onClick={handleAddMainMenu}
          >
            <FaPlus size={12} />
            <span className="fw-semibold d-none d-md-block">Add Menu</span>
          </button>
        </div>

        <div className="row mt-3">
          <div className={isSidebarVisible ? "col-md-8" : "col-sm-12"}>

            <div className="border rounded-3 bg-light-subtle shadow-sm p-3">
              <div className="row g-3 align-items-center">

                {/* Cabinet Selector */}
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold d-flex align-items-center gap-1" htmlFor="searchInput">
                    <BsBoxSeam  size={12} />Cabinet
                    {!selectedCabinet && (
                      <span className="badge bg-danger-subtle text-danger small">Required</span>
                    )}
                  </label>
                  <CustomAsyncSelect
                    cacheOptions
                    defaultOptions
                    loadOptions={loadCabinets}
                    placeholder="Select Cabinet..."
                    onChange={(selected) => setSelectedCabinet(selected)}
                    isClearable
                    value={selectedCabinet}
                    classNamePrefix="react-select"
                  />
                </div>

                {/* Menu Type Filter */}
                <div className="col-12 col-sm-6 col-md-3">
                  <label className="form-label fw-semibold text-muted d-flex align-items-center gap-1" htmlFor="searchInput">
                    <BsMenuButtonWide size={12} /> Menu Type
                  </label>
                  <CustomSelect
                    options={menuTypeOptionsWithAll}
                    value={menuTypeOptionsWithAll.find(option => option.value === menuTypeFilter)}
                    onChange={(selected) => setMenuTypeFilter(selected.value)}
                    isClearable={false}
                    placeholder="All Menu Types"
                    menuPlacement="auto"
                    menuPortalTarget={document.body}
                    menuShouldScrollIntoView={false}
                    isDisabled={!selectedCabinet}
                  />
                </div>

                {/* Search Box */}
                <div className="col-12 col-sm-6 col-md-3">
                  <label
                    htmlFor="searchInput"
                    className="form-label fw-semibold text-muted d-flex align-items-center gap-1"
                  >
                    <BsSearch size={12} />
 Search Menus
                  </label>

                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      name="searchInput"
                      id="searchInput"
                      placeholder="Type to search..."
                      value={searchText}
                      onChange={(e) => handleSearch(e.target.value)}
                      disabled={!selectedCabinet}
                      style={{ height: "36px" }}
                    />
                    {searchText && (
                      <button
                        className="btn btn-outline-danger"
                        onClick={handleClearSearch}
                        style={{ width: "42px" }}
                        aria-label="Clear Search"
                        title="Clear Search"
                      >
                        <FaTimes size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Reset Filters Button */}
                <div className="col-12 col-md-2">

                  <button
                    className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2 px-3 py-2 mt-4"
                    onClick={() => {
                      setSearchText("");
                      setMenuTypeFilter("");
                      setSelectedCabinet(null);
                      setFilteredTreeData([]);
                    }}
                    disabled={!selectedCabinet && !menuTypeFilter && !searchText}
                    aria-label="Reset Filters"
                  >
                    <BsArrowCounterclockwise  size={12} />Reset
                    {!isSidebarVisible && <span> Filters</span>}
                  </button>


                </div>

              </div>
            </div>


            {selectedCabinet ? (
              loading ? (
                <div style={{ padding: '20px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Skeleton height={30} width={`80%`} style={{ marginBottom: 10 }} key={i} />
                  ))}
                </div>
              ) :
                filteredTreeData.length > 0 ? (
                  <Tree
                    ref={treeRef}
                    tree={filteredTreeData}
                    rootId={0}
                    open={openIds}               // ✅ controlled mode
                    onChangeOpen={setOpenIds}
                    dragPreviewRender={({ item }) => (
                      <div className="p-2 bg-secondary text-white rounded shadow-sm">{item.text}</div>
                    )}
                    sort={false}
                    insertDroppableFirst={false}
                    dropTargetOffset={5}
                    classes={{
                      root: "tree-root",
                      draggingSource: "dragging",
                      dropTarget: "drop-target",
                    }}
                    onDrop={handleDrop}
                    enableAnimateExpand={true}
                    onToggle={toggleNode}
                    render={(node, { depth, isOpen, onToggle }) => (
                      <div
                        key={node.id}
                        ref={(el) => {
                          if (el) nodeRefs.current[node.id] = el;
                        }}
                        style={{ marginLeft: depth * 20 }}
                        className={`tree-node ${highlightNodeId === node.id ? "node-highlighted" : ""} position-relative`}
                      >
                        <div
                          className="d-flex justify-content-between align-items-center gap-2 px-2 py-1 hover-actions-wrapper"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleSelectNode(node)}
                        >
                          <div
                            className="d-flex align-items-center gap-3 flex-wrap"
                            style={{ userSelect: "none" }}
                          >
                            {node.droppable && (
                              <span
                                className="folder-icon d-flex align-items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggle(node.id);
                                }}
                                style={{
                                  cursor: "pointer",
                                  color: isOpen ? "#5d78ff" : "#576572e0",
                                  transition: "color 0.3s",
                                }}
                                title={isOpen ? "Collapse folder" : "Expand folder"}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "#0a58ca")}
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.color = isOpen ? "#5d78ff" : "#576572e0")
                                }
                              >
                                {isOpen ? <FaFolderOpen size={20} /> : <FaFolder size={20} />}
                              </span>
                            )}

                            <span
                              className="node-title flex-grow-1 text-truncate"
                              style={{ minWidth: 0, fontWeight: 500, color: "#343a40" }}
                              title={node.text}
                            >
                              {node.text}
                            </span>

                            {node.menuTypeDesc && (
                              <span
                                className={`badge menu-type-badge ${getBadgeClass(node.menuTypeDesc)}`}
                                style={{
                                  padding: "0.3em 0.7em",
                                  whiteSpace: "nowrap",
                                  letterSpacing: "0.03em",
                                }}
                              >
                                {node.menuTypeDesc}
                              </span>
                            )}
                          </div>

                          <div className="d-flex align-items-center gap-1 node-actions">
                            <button
                              className="btn btn-sm btn-outline-secondary rounded-circle"
                              title="Add Submenu"
                              style={{ width: "28px", height: "28px", padding: "0" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddSubmenu(node);
                              }}
                            >
                              <FaPlus size={12} />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-success rounded-circle"
                              title="Edit Menu"
                              style={{ width: "28px", height: "28px", padding: "0" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectNode(node);
                                setEditMode(true);
                                setAddingNewMainMenu(false);
                              }}
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger rounded-circle"
                              title="Delete Menu"
                              style={{ width: "28px", height: "28px", padding: "0" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmDelete(node);
                              }}
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  />

                ) : (
                  showNoData && <div className="enhanced-alert">
                   <BsInfoCircle size={48} aria-hidden="true" />
                    <p>No menus found. Start by adding a new main menu.</p>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={handleAddMainMenu}
                    >
                      + Create New Menu
                    </button>
                  </div>

                )
            ) : (
              <div
                className="alert bg-primary-subtle-enhanced text-center p-4 "
                role="alert"
                aria-live="polite"
                aria-atomic="true"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  fill="currentColor"
                  className="mb-3 text-primary"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path d="M7.938 2.016a.13.13 0 0 1 .125 0l6.857 11.856c.05.086.007.21-.12.21H1.157c-.127 0-.17-.124-.12-.21L7.938 2.016zm.562 1.418-6.857 11.857h13.714L8.5 3.434zM8 6.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 6.5zm.002 5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0z" />
                </svg>
                <p className="mb-0">
                  Please select a cabinet to view and manage the menu tree.
                </p>
              </div>

            )}
          </div>

          {isSidebarVisible && (
            <div className="col-md-4">
              <div className="card shadow-sm border rounded">
                <div
                  className="card-header d-flex align-items-center justify-content-between shadow-sm ps-3 py-2"
                  style={{
                    backgroundColor: "#f8f9fa",
                    color: "#343a40",
                    borderBottom: "1px solid #dee2e6",
                    borderTopLeftRadius: "0.5rem",
                    borderTopRightRadius: "0.5rem",
                    padding: "1rem",
                  }}
                >
                  <h6 className="mb-0 d-flex align-items-center gap-2  fw-semibold" >
                    {addingNewMainMenu ? (
                      <>
                        {`Add ${menuTypeLabelMap[inputFields.menuType] || "Menu"}`}
                      </>
                    ) : editMode ? (
                      <>
                        {`Edit ${menuTypeLabelMap[inputFields.menuType] || "Menu"}`}
                      </>
                    ) : (
                      <>
                        {`View ${menuTypeLabelMap[inputFields.menuType] || "Menu"}`}
                      </>
                    )}
                  </h6>

                  <button
                    type="button"
                    onClick={() => setSelectedNode(null)}
                    className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center"
                    aria-label="Close"
                    style={{ width: 32, height: 32, padding: 0, borderRadius: "50%" }}
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="card-body" ref={formRef} >
                  {!selectedNode && !addingNewMainMenu ? (
                    <div className="text-center text-muted py-5">
                      <p className="mb-0">
                        Select a menu to view details or click <strong>Add Menu</strong>.
                      </p>
                    </div>
                  ) : editMode || addingNewMainMenu ? (
                    <>
                      {/* Menu Type Select */}
                      <div className="form-floating mb-3">
                        <select
                          id="menuTypeSelect"
                          className="form-select"
                          disabled={!editMode && !addingNewMainMenu}
                          value={inputFields.menuType || "1"}
                          onChange={(e) =>
                            setInputFields({ ...inputFields, menuType: e.target.value })
                          }
                        >
                          {menuTypeOptions.map(({ value, label }) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                        <label htmlFor="menuTypeSelect" className="small fw-semibold">
                          Menu Type
                        </label>
                      </div>

                      {/* Parent info */}
                      {selectedNode?.parent !== 0 && selectedNode?.parent && (
                        <div className="form-floating mb-3">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={
                              treeData.find((n) => n.id === selectedNode.parent)?.text || "Unknown"
                            }
                            disabled
                            readOnly
                            placeholder="Parent"
                          />
                          <label className="small fw-semibold" htmlFor="parentInput">
                            Parent
                          </label>
                        </div>
                      )}


                      {/* Menu Name */}
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          id="menuNameInput"
                          className="form-control form-control-sm"
                          placeholder="Dashboard"
                          value={inputFields.menuName || inputFields.text || ""}
                          disabled={!editMode && !addingNewMainMenu}
                          onChange={(e) =>
                            setInputFields({
                              ...inputFields,
                              menuName: e.target.value,
                              text: e.target.value,
                            })
                          }
                        />
                        <label htmlFor="menuNameInput" className="small fw-semibold">
                          Menu Name
                        </label>
                      </div>

                      {/* URL */}
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          id="urlInput"
                          className="form-control form-control-sm"
                          placeholder="/dashboard"
                          disabled={!editMode && !addingNewMainMenu}
                          value={inputFields.url || ""}
                          onChange={(e) =>
                            setInputFields({
                              ...inputFields,
                              url: e.target.value,
                            })
                          }
                        />
                        <label htmlFor="urlInput" className="small fw-semibold">
                          URL
                        </label>
                      </div>

                      {/* Icon */}
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          id="iconInput"
                          className="form-control form-control-sm"
                          placeholder="dashboard-icon or FaTachometerAlt"
                          disabled={!editMode && !addingNewMainMenu}
                          value={inputFields.icon || ""}
                          onChange={(e) =>
                            setInputFields({ ...inputFields, icon: e.target.value })
                          }
                        />
                        <label htmlFor="iconInput" className="small fw-semibold">
                          Icon Name
                        </label>
                      </div>

                      {/* Note for Icon */}
                      <div
                        className="px-3 py-2 rounded mb-3 small"
                        style={{
                          backgroundColor: "#e8f0f8",
                          border: "1px solid rgb(51, 122, 183)",
                          color: "#33527b",
                        }}
                      >
                        <strong>Note:</strong> Kindly use only valid and supported icons.
                      </div>

                      {/* Order (Position) */}
                      {!addingNewMainMenu && (
                        <div className="form-floating mb-3">
                          <input
                            type="number"
                            id="positionInput"
                            min={1}
                            className="form-control form-control-sm"
                            disabled={!editMode}
                            value={inputFields.position || ""}
                            onChange={(e) =>
                              setInputFields({ ...inputFields, position: e.target.value })
                            }
                          />
                          <label htmlFor="positionInput" className="small fw-semibold">
                            Position
                          </label>
                        </div>
                      )}

                      {/* Target Select */}
                      <div className="form-floating mb-4">
                        <select
                          id="targetSelect"
                          className="form-select form-select-sm"
                          disabled={!editMode && !addingNewMainMenu}
                          value={inputFields.target || "_self"}
                          onChange={(e) =>
                            setInputFields({ ...inputFields, target: e.target.value })
                          }
                        >
                          <option value="_self">_self</option>
                          <option value="_blank">_blank</option>
                          <option value="_parent">_parent</option>
                          <option value="_top">_top</option>
                        </select>
                        <label htmlFor="targetSelect" className="small fw-semibold">
                          Target
                        </label>
                      </div>

                      {/* Buttons */}
                      <div className="row mt-4 gx-3">
                        <div className="col-12 col-sm-6">
                          <button
                            type="button"
                            className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2 px-4"
                            onClick={handleSave}
                          >
                            <FaSave />
                            Save
                          </button>
                        </div>

                        <div className="col-12 col-sm-6 mt-3 mt-sm-0">
                          <button
                            type="button"
                            className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2 px-4"
                            onClick={handleCancel}
                          >
                            <FaTimes />
                            Cancel
                          </button>
                        </div>
                      </div>



                    </>

                  ) : (
                    // VIEW MODE
                    <div className="text-dark">
                      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                        <h6 className="text-muted fw-semibold d-flex align-items-center m-0">
                          <FaInfoCircle className="me-2 text-primary" />
                          Menu Details
                        </h6>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                            onClick={handleEditClick}
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                            onClick={() => confirmDelete(selectedNode)}
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>

                      {/* Menu Details */}
                      <ul className="list-unstyled  mb-4">
                        <li className="mb-1">
                          <span className="text-muted">📂 Menu Type:</span>{" "}
                          {{
                            "1": "Main Module",
                            "2": "Sub Module",
                            "3": "Menu",
                          }[selectedNode.menuType] || "-"}
                        </li>

                        {selectedNode?.parent !== 0 && selectedNode?.parent && (
                          <li className="mb-1">
                            <span className="text-muted">🧷 Parent:</span>{" "}
                            {treeData.find((n) => n.id === selectedNode.parent)?.text || "Unknown"}
                          </li>
                        )}

                        <li className="mb-1">
                          <span className="text-muted">📛 Menu Name:</span>{" "}
                          {selectedNode.menuName || selectedNode.text}
                        </li>

                        <li className="mb-1">
                          <span className="text-muted">🔗 URL:</span> {selectedNode.url || "-"}
                        </li>

                        <li className="mb-1">
                          <span className="text-muted">🎯 Target:</span>{" "}
                          {selectedNode.target || "_self"}
                        </li>

                        <li className="mb-1">
                          <span className="text-muted">🖼️ Icon:</span>{" "}
                          {selectedNode.icon || "-"}
                        </li>

                        <li className="mb-1">
                          <span className="text-muted">🔢 Position:</span>{" "}
                          {selectedNode.position || "-"}
                        </li>
                      </ul>

                      {/* Bottom Buttons */}
                      <div className="row g-2">
                        <div className="col-12 col-sm-6">
                          <button
                            className="btn btn-outline-success w-100 d-flex align-items-center justify-content-center gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddSubmenu(selectedNode);
                            }}
                          >
                            <FaPlus /> Add Sub Menu
                          </button>
                        </div>

                        <div className="col-12 col-sm-6">
                          <button
                            className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
                            onClick={() => setSelectedNode(null)}
                          >
                            <FaTimes /> Close
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
          }



          {/* Delete Confirmation Modal */}
          {
            showDeleteModal && (
              <div
                className="modal fade show"
                style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                tabIndex="-1"
                role="dialog"
                aria-modal="true"
              >
                <div className="modal-dialog modal-dialog-centered" role="document">
                  <div className="modal-content shadow-lg border-0 rounded-4">
                    <div className="modal-header  bg-primary">
                      <h6 className="modal-title fw-semibold text-white">
                        Confirm Deletion
                      </h6>
                      <button
                        type="button"
                        className="btn-close text-white"
                        aria-label="Close"
                        onClick={() => setShowDeleteModal(false)}
                      ></button>
                    </div>

                    <div className="modal-body">
                      <p className="text-muted">
                        Are you sure you want to delete{" "}
                        <strong className="text-dark">{nodeToDelete?.text}</strong> and all its child menus?
                      </p>
                      <p className="mb-0 text-muted">
                        This action <span className="text-danger fw-semibold">cannot be undone</span>.
                      </p>
                    </div>

                    <div className="modal-footer border-0 d-flex justify-content-end gap-3 mt-2">
                      <button className="btn btn-outline-primary px-4" onClick={performDelete}>
                        <FaTrash className="me-2" />
                        Delete
                      </button>
                      <button
                        className="btn btn-outline-secondary px-4"
                        onClick={() => setShowDeleteModal(false)}
                      >
                        <FaTimes className="me-2" />
                        Cancel
                      </button>
                    </div>

                  </div>
                </div>
              </div>

            )
          }
        </div >
      </div>
    </div>


  );
};

export default MenuManagement;
