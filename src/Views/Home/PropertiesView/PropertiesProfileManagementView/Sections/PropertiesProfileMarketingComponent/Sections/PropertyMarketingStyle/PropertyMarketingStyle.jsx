import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { lookupItemsGetId } from '../../../../../../../../Services';
import { CheckboxesComponent, Spinner } from '../../../../../../../../Components';
import { StyleMarketing } from '../../../../../../../../assets/json/StaticLookupsIds.json';

export const PropertyMarketingStyle = ({
  state,
  onStateChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [styles, setStyles] = useState([]);
  const getAllStyles = useCallback(async () => {
    setIsLoading(true);
    const res = await lookupItemsGetId({
      lookupTypeId: StyleMarketing,
    });
    if (!(res && res.status && res.status !== 200)) setStyles(res || []);
    else setStyles([]);
    setIsLoading(false);
  }, []);
  const onSelectHandler = useCallback(
    (row) => {
      const itemIndex = state.styleIds ?
        state.styleIds.findIndex((item) => item === row.lookupItemId) :
        -1;
      if (itemIndex !== -1) state.styleIds.splice(itemIndex, 1);
      else state.styleIds.push(row.lookupItemId);
      onStateChanged({ id: 'styleIds', value: state.styleIds });
    },
    [onStateChanged, state.styleIds]
  );
  const getIsSelected = useCallback(
    (row) =>
      state.styleIds && state.styleIds.findIndex((item) => item === row.lookupItemId) !== -1,
    [state.styleIds]
  );
  const onSelectAllHandler = (event) => {
    if (event.target.checked) {
      styles.map((item) => {
        if (!getIsSelected(item)) state.styleIds.push(item.lookupItemId);
      });
    } else {
      styles.map((item) => {
        if (getIsSelected(item)) {
          const isSelectedIndex = state.styleIds.findIndex(
            (element) => element === item.lookupItemId
          );
          if (isSelectedIndex !== -1) state.styleIds.splice(isSelectedIndex, 1);
        }
      });
    }
    onStateChanged({ id: 'styleIds', value: state.styleIds });
  };

  useEffect(() => {
    getAllStyles();
  }, [getAllStyles]);
  return (
    <div className='property-marketing-style-wrapper presentational-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='title-wrapper'>
        <span className='title-text'>{t(`${translationPath}style`)}</span>
      </div>
      <div className='w-100'>
        <CheckboxesComponent
          idRef='tableSelectAllRef'
          singleIndeterminate={
            state.styleIds &&
            state.styleIds.length > 0 &&
            styles.length > state.styleIds.length
          }
          label='select-all'
          singleChecked={
            state.styleIds &&
            state.styleIds.length > 0 &&
            styles.length !== state.styleIds.length
          }
          onSelectedCheckboxClicked={onSelectAllHandler}
          parentTranslationPath={parentTranslationPath}
          translationPathForData={translationPath}
        />
      </div>
      <CheckboxesComponent
        data={styles}
        wrapperClasses='w-100'
        formControlLabelClasses='form-item'
        isRow
        idRef='stylesRef'
        labelInput='lookupItemName'
        checked={getIsSelected}
        onSelectedCheckboxChanged={onSelectHandler}
      />
    </div>
  );
};

PropertyMarketingStyle.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
