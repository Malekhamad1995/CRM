import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { lookupItemsGetId } from '../../../../../../../../Services';
import { CheckboxesComponent, Spinner } from '../../../../../../../../Components';
import { LuxuryMarketing } from '../../../../../../../../assets/json/StaticLookupsIds.json';

export const PropertyMarketingLuxury = ({
  state,
  onStateChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [luxuries, setLuxuries] = useState([]);

  const getAllLuxuries = useCallback(async () => {
    setIsLoading(true);
    const res = await lookupItemsGetId({
      lookupTypeId: LuxuryMarketing,
    });
    if (!(res && res.status && res.status !== 200)) setLuxuries(res || []);
    else setLuxuries([]);
    setIsLoading(false);
  }, []);
  const onSelectHandler = useCallback(
    (row) => {
      const itemIndex = state.luxuryIds ?
        state.luxuryIds.findIndex((item) => item === row.lookupItemId) :
        -1;
      if (itemIndex !== -1) state.luxuryIds.splice(itemIndex, 1);
      else state.luxuryIds.push(row.lookupItemId);
      onStateChanged({ id: 'luxuryIds', value: state.luxuryIds });
    },
    [onStateChanged, state.luxuryIds]
  );
  const getIsSelected = useCallback(
    (row) =>
      state.luxuryIds && state.luxuryIds.findIndex((item) => item === row.lookupItemId) !== -1,
    [state.luxuryIds]
  );
  const onSelectAllHandler = (event) => {
    if (event.target.checked) {
      luxuries.map((item) => {
        if (!getIsSelected(item)) state.luxuryIds.push(item.lookupItemId);
      });
    } else {
      luxuries.map((item) => {
        if (getIsSelected(item)) {
          const isSelectedIndex = state.luxuryIds.findIndex(
            (element) => element === item.lookupItemId
          );
          if (isSelectedIndex !== -1) state.luxuryIds.splice(isSelectedIndex, 1);
        }
      });
    }
    onStateChanged({ id: 'luxuryIds', value: state.luxuryIds });
  };

  useEffect(() => {
    getAllLuxuries();
  }, [getAllLuxuries]);
  return (
    <div className='property-marketing-luxury-wrapper presentational-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='title-wrapper'>
        <span className='title-text'>{t(`${translationPath}luxury`)}</span>
      </div>
      <div className='w-100'>
        <CheckboxesComponent
          idRef='tableSelectAllRef'
          singleIndeterminate={
            state.luxuryIds &&
            state.luxuryIds.length > 0 &&
            luxuries.length > state.luxuryIds.length
          }
          label='select-all'
          singleChecked={
            state.luxuryIds &&
            state.luxuryIds.length > 0 &&
            luxuries.length !== state.luxuryIds.length
          }
          onSelectedCheckboxClicked={onSelectAllHandler}
          parentTranslationPath={parentTranslationPath}
          translationPathForData={translationPath}
        />
      </div>
      <CheckboxesComponent
        data={luxuries}
        wrapperClasses='w-100'
        formControlLabelClasses='form-item'
        isRow
        idRef='luxuriesRef'
        labelInput='lookupItemName'
        checked={getIsSelected}
        onSelectedCheckboxChanged={onSelectHandler}
      />
    </div>
  );
};

PropertyMarketingLuxury.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
