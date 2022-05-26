import { all } from 'redux-saga/effects';
import { watchSetLoading } from './genric/Saga';
import { watchLogin } from './login/Saga';
import { watchLog } from './Logger/LoggerSaga';
import {
  watchFilesByProcessIDSuccess,
  watchFilesByProcessIDFail,
  watchApproveImportedFile,
} from './file/Saga';
import {
  watchContactsGet,
  watchContactsPost,
  watchContactsPut,
  watchContactsSearchGet,
  watchContactsDetailsDialogGet,
  watchContactsDetailsFieldGet,
  watchContactsDetailsGet,
  watchContactsDetailsPut,
} from './contacts/Saga';
import {
  watchLeadsPost,
  watchLeadsDetailsGet,
  watchLeadsDetailsDialogGet,
  watchLeadsDetailsPut,
} from './lead/Saga';
import {
  watchFormGet,
  watchFormPost,
  watchFormbyIdGet,
  watchFormbyIdPut,
  watchFormbyIdGetDialog,
} from './forms/Saga';

import {
  watchPropertyPost,
  watchPropertyDetailsGet,
  watchPropertyDetailsPut,
  watchPropertyDetailsDialogGet,
} from './property/Saga';

import {
  watchUnitsPost,
  watchUnitsPut,
  watchUnitsDetailsGet,
  watchUnitsDetailsPut,
  watchUnitsDetailsDialogGet,
} from './unit/Saga';
import { watchLookupItems, watchLookupTypes } from './lookups/Saga';
import { watchActiveItem, watchUnitDetailsGet } from './ActiveItem/ActiveItemSaga';
import { watchGlobalFilterFilter } from './GlobalOrderFilter/GlobalOrderFilterSaga';
import { watchTableColumnsFilter } from './TableColumnsFilter/TableColumnsFilterSaga';

export default function* rootSaga() {
  yield all([
    watchSetLoading(),
    watchLogin(),
    watchFormGet(),
    watchFormPost(),
    watchFormbyIdGet(),
    watchFormbyIdGetDialog(),
    watchFormbyIdPut(),
    watchContactsGet(),
    watchContactsPost(),
    watchContactsPut(),
    watchContactsSearchGet(),
    watchContactsDetailsGet(),
    watchContactsDetailsDialogGet(),
    watchContactsDetailsFieldGet(),
    watchContactsDetailsPut(),
    watchLeadsPost(),
    watchLeadsDetailsGet(),
    watchLeadsDetailsDialogGet(),
    watchLeadsDetailsPut(),
    watchPropertyPost(),
    watchPropertyDetailsGet(),
    watchPropertyDetailsPut(),
    watchUnitsPost(),
    watchUnitsPut(),
    watchUnitsDetailsGet(),
    watchUnitsDetailsDialogGet(),
    watchUnitsDetailsPut(),
    watchPropertyDetailsDialogGet(),
    watchFilesByProcessIDSuccess(),
    watchFilesByProcessIDFail(),
    watchApproveImportedFile(),
    watchLookupTypes(),
    watchLookupItems(),
    watchLog(),
    watchActiveItem(),
    watchTableColumnsFilter(),
    watchUnitDetailsGet(),
    watchGlobalFilterFilter(),
  ]);
}
