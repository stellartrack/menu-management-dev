export const customStyles = {
  control: (base) => ({
    ...base,
    height: 36,
    minHeight: 36, 
    fontSize: "0.8125rem",
    borderRadius: "0.25rem",
    boxShadow: "none",
  }),
  indicatorsContainer: (base) => ({
    ...base,
    height: 36,
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 8px",
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
    borderRadius: "0.25rem",
    marginTop: 0,
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  }),
  menuList: (base) => ({
    ...base,
    maxHeight: 150,
    padding: 0,
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    backgroundColor: isSelected
      ? "#0d6efd"
      : isFocused
      ? "#e7f1ff"
      : "white",
    color: isSelected ? "white" : "#212529",
    cursor: "pointer",
    padding: "8px 12px",
    fontSize: "0.8125rem",
  }),
};
