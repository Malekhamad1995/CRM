import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { lookupItemsGetId } from '../../../../../../../../Services';
import { CheckboxesComponent, Spinner } from '../../../../../../../../Components';
import { FinanceMarketing } from '../../../../../../../../assets/json/StaticLookupsIds.json';

export const PropertyMarketingFinance = ({
  state,
  onStateChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [finances, setFinances] = useState([]);
  const getAllFinances = useCallback(async () => {
    setIsLoading(true);
    const res = await lookupItemsGetId({
      lookupTypeId: FinanceMarketing,
    });
    if (!(res && res.status && res.status !== 200)) setFinances(res || []);
    else setFinances([]);
    setIsLoading(false);
  }, []);
  const onSelectHandler = useCallback(
    (row) => {
      const itemIndex = state && state.financeIds ?
      state.financeIds.findIndex((item) => item === row.lookupItemId) :
        -1;
      if (itemIndex !== -1) state.financeIds.splice(itemIndex, 1);
      else state.financeIds.push(row.lookupItemId);
      onStateChanged({ id: 'financeIds', value: state.financeIds });
    },
    [onStateChanged, state]
  );

  const getIsSelected = useCallback(
    (row) =>
      state.financeIds && state.financeIds.findIndex((item) => item === row.lookupItemId) !== -1,
    [state.financeIds]
  );
  const onSelectAllHandler = (event) => {
    if (event.target.checked) {
      finances.map((item) => {
        if (!getIsSelected(item)) state.financeIds.push(item.lookupItemId);
      });
    } else {
      finances.map((item) => {
        if (getIsSelected(item)) {
          const isSelectedIndex = state.financeIds.findIndex(
            (element) => element === item.lookupItemId
          );
          if (isSelectedIndex !== -1) state.financeIds.splice(isSelectedIndex, 1);
        }
      });
    }
    onStateChanged({ id: 'financeIds', value: state.financeIds });
  };

  useEffect(() => {
    getAllFinances();
  }, [getAllFinances]);
  return (
    <div className='property-marketing-finance-wrapper presentational-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='title-wrapper'>
        <span className='title-text'>{t(`${translationPath}finance`)}</span>
      </div>
      <div className='w-100'>
        <CheckboxesComponent
          idRef='tableSelectAllRef'
          singleIndeterminate={
            state.financeIds &&
            state.financeIds.length > 0 &&
            finances.length > state.financeIds.length
          }
          label='select-all'
          singleChecked={
            state.financeIds &&
            state.financeIds.length > 0 &&
            finances.length !== state.financeIds.length
          }
          onSelectedCheckboxClicked={onSelectAllHandler}
          parentTranslationPath={parentTranslationPath}
          translationPathForData={translationPath}
        />
      </div>
      <CheckboxesComponent
        data={finances}
        wrapperClasses='w-100'
        formControlLabelClasses='form-item'
        isRow
        idRef='financesRef'
        labelInput='lookupItemName'
        checked={getIsSelected}
        onSelectedCheckboxChanged={onSelectHandler}
      />
    </div>
  );
};

PropertyMarketingFinance.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
