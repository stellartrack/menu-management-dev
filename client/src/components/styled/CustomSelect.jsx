import Select from "react-select";
import { customStyles } from "./selectCustomStyles";

export default function CustomSelect(props) {
  return <Select {...props} styles={customStyles} />;
}
