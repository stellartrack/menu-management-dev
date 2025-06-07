import AsyncSelect from "react-select/async";
import { customStyles } from "./selectCustomStyles";

export default function CustomAsyncSelect(props) {
  return <AsyncSelect styles={customStyles} {...props} />;
}
