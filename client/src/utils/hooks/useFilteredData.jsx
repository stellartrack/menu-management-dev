import { useMemo } from "react";

const useFilteredData = (data = [], filterText = "") => {
  return useMemo(() => {
    if (!filterText) {
      return data;
    }
    const lowerCaseFilter = filterText.toLowerCase();

    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(lowerCaseFilter)
      )
    );
  }, [data, filterText]);
};

export default useFilteredData;
