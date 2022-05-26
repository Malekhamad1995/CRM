import { combineReducers } from 'redux';
import genric from './genric/Reducer';
import login from './login/Reducer';
import forms from './forms/Reducer';
import formbuilder from './formbuilder';
import contacts from './contacts/Reducer';
import leads from './lead/Reducer';
import properties from './property/Reducer';
import units from './unit/Reducer';
import files from './file/Reducer';
import lookups from './lookups/Reducer';
import { LoggerReducer } from './Logger/LoggerReducer';
import { ActiveItemReducer } from './ActiveItem/ActiveItemReducer';
import { TableColumnsFilterReducer } from './TableColumnsFilter/TableColumnsFilterReducer';
import { GlobalOrderFilterReducer } from './GlobalOrderFilter/GlobalOrderFilterReducer';

const rootReducer = combineReducers({
  genric,
  login,
  forms,
  formbuilder,
  contacts,
  leads,
  properties,
  units,
  files,
  lookups,
  LoggerReducer,
  ActiveItemReducer,
  TableColumnsFilterReducer,
  GlobalOrderFilterReducer,
});
export default rootReducer;
