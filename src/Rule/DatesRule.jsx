import { GlobalTranslate, showError } from '../Helper';
import moment from 'moment';

export const handleDatesRule = (index, e) => {
    if (localStorage.getItem("ReportDateFrom") && index == 1 && moment(e).diff(moment(localStorage.getItem("ReportDateFrom"))) < 0) {
        showError(GlobalTranslate.t('Shared:invalid-period'));
        return true;
    }
    if (localStorage.getItem("ReportDateTo") && index == 0 && moment(e).diff(moment(localStorage.getItem("ReportDateTo"))) > 0) {
        showError(GlobalTranslate.t('Shared:invalid-period'));
        return true;
    }
    else if (index == 0)
        return false;
}
