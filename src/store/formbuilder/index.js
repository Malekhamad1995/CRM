import { combineReducers } from "redux";

import form from "./form";
import notifications from "./notifications";
import serverStatus from "./serverStatus";
import records from "./records";
import dragndrop from "./dragndrop";
import jsonForm from "./jsonForm";

const formbuilder = combineReducers({
  notifications,
  form,
  serverStatus,
  records,
  dragndrop,
  jsonForm
});

export default formbuilder;
