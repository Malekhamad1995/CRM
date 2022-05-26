import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { lookupItemsGetId } from '../../../../../../../../Services';
import { CheckboxesComponent, Spinner } from '../../../../../../../../Components';
import { ViewsMarketing } from '../../../../../../../../assets/json/StaticLookupsIds.json';

export const PropertyMarketingViews = ({
  state,
  onStateChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [views, setViews] = useState([]);
  const getAllViews = useCallback(async () => {
    setIsLoading(true);
    const res = await lookupItemsGetId({
      lookupTypeId: ViewsMarketing,
    });
    if (!(res && res.status && res.status !== 200)) setViews(res || []);
    else setViews([]);
    setIsLoading(false);
  }, []);
  const onSelectHandler = useCallback(
    (row) => {
      const itemIndex = state.viewIds ?
        state.viewIds.findIndex((item) => item === row.lookupItemId) :
        -1;
      if (itemIndex !== -1) state.viewIds.splice(itemIndex, 1);
      else state.viewIds.push(row.lookupItemId);
      onStateChanged({ id: 'viewIds', value: state.viewIds });
    },
    [onStateChanged, state.viewIds]
  );
  const getIsSelected = useCallback(
    (row) =>
      state.viewIds && state.viewIds.findIndex((item) => item === row.lookupItemId) !== -1,
    [state.viewIds]
  );
  const onSelectAllHandler = (event) => {
    if (event.target.checked) {
      views.map((item) => {
        if (!getIsSelected(item)) state.viewIds.push(item.lookupItemId);
      });
    } else {
      views.map((item) => {
        if (getIsSelected(item)) {
          const isSelectedIndex = state.viewIds.findIndex(
            (element) => element === item.lookupItemId
          );
          if (isSelectedIndex !== -1) state.viewIds.splice(isSelectedIndex, 1);
        }
      });
    }
    onStateChanged({ id: 'viewIds', value: state.viewIds });
  };

  useEffect(() => {
    getAllViews();
  }, [getAllViews]);
  return (
    <div className='property-marketing-views-wrapper presentational-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='title-wrapper'>
        <span className='title-text'>{t(`${translationPath}views`)}</span>
      </div>
      <div className='w-100'>
        <CheckboxesComponent
          idRef='tableSelectAllRef'
          singleIndeterminate={
            state.viewIds &&
            state.viewIds.length > 0 &&
            views.length > state.viewIds.length
          }
          label='select-all'
          singleChecked={
            state.viewIds &&
            state.viewIds.length > 0 &&
            views.length !== state.viewIds.length
          }
          onSelectedCheckboxClicked={onSelectAllHandler}
          parentTranslationPath={parentTranslationPath}
          translationPathForData={translationPath}
        />
      </div>
      <CheckboxesComponent
        data={views}
        wrapperClasses='w-100'
        formControlLabelClasses='form-item'
        isRow
        idRef='viewsRef'
        labelInput='lookupItemName'
        checked={getIsSelected}
        onSelectedCheckboxChanged={onSelectHandler}
      />
    </div>
  );
};

PropertyMarketingViews.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
