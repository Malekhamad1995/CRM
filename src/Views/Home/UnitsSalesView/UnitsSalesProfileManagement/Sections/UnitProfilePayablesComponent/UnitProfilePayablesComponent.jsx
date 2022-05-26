import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import { RadiosGroupComponent, Spinner } from '../../../../../../Components';
import {
  bottomBoxComponentUpdate,
  GetParams,
  GlobalHistory,
  showError,
  showSuccess,
} from '../../../../../../Helper';
import {
  lookupItemsGetId,
  GetAllUnitPayablesByUnitId,
  UnitPayablesPost,
} from '../../../../../../Services';
import { PayablesEnum } from '../../../../../../Enums';

export const UnitProfilePayablesComponent = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [radioValue, setRadioValue] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [payableResponse, setPayableResponse] = useState(null);
  const defaultState = {
    unitId: +GetParams('id'),
    createUnitPayables: [],
  };
  const [state, setState] = useState(defaultState);

  const getPayablesLookupItems = useCallback(async () => {
    setLoading(true);
    const result = await lookupItemsGetId({ lookupTypeId: PayablesEnum.lookupTypeId });
    if (!(result && result.status && result.status !== 200)) {
      setResponse(result);
      const arr = result.map((item) => `${item.lookupItemId}-owner`);
      setRadioValue(JSON.parse(JSON.stringify(arr)));
    } else setResponse(null);
    setLoading(false);
  }, []);

  const getAllUnitPayablesById = useCallback(async () => {
    setLoading(true);
    const result = await GetAllUnitPayablesByUnitId(+GetParams('id'));
    if (!(result && result.status && result.status !== 200)) setPayableResponse(result);
    setLoading(false);
  }, []);

  const radioValueChange = useCallback(() => {
    if (payableResponse) {
      setTimeout(() => {
        payableResponse.map((item) => {
          setRadioValue((items) => {
            const index = items.findIndex((el) => +item.payableId === +el.split('-')[0]);
            if (index !== -1) {
              items.splice(index, 1);
              items.push(item.isOwner ? `${item.payableId}-owner` : `${item.payableId}-tenant`);
            }
            return [...items];
          });
        });
      }, 50);
    }
  }, [payableResponse]);

  useEffect(() => {
    radioValueChange();
  }, [radioValueChange]);

  useEffect(() => {
    if (payableResponse) setSelectedRows(payableResponse.map((item) => `${item.payableId}`));
  }, [payableResponse]);

  useEffect(() => {
    getAllUnitPayablesById();
  }, [getAllUnitPayablesById]);

  useEffect(() => {
    getPayablesLookupItems();
  }, [getPayablesLookupItems]);

  const cancelHandler = () => {
    GlobalHistory.push('/home/units-sales/view');
  };
  const saveHandler = async () => {
    const result = await UnitPayablesPost(state);
    if (!(result && result.status && result.status !== 200)) {
      showSuccess(t(`${translationPath}payable-saved-successfully`));
      setState(defaultState);
    } else showError(t(`${translationPath}payable-saved-failed`));
  };

  useEffect(() => {
    bottomBoxComponentUpdate(
      <div className='d-flex-v-center-h-end flex-wrap'>
        <ButtonBase className='btns theme-transparent mb-2' onClick={cancelHandler}>
          <span>{t('Shared:cancel')}</span>
        </ButtonBase>
        <ButtonBase className='btns theme-solid mb-2' onClick={saveHandler}>
          <span>{t('Shared:save')}</span>
        </ButtonBase>
      </div>
    );
  });
  useEffect(
    () => () => {
      bottomBoxComponentUpdate(null);
    },
    []
  );

  const handleRadioValueChange = useCallback(
    (value, index) => {
      let res;
      if (radioValue[index].split('-')[1] === 'owner')
        res = `${radioValue[index].split('-')[0]}-owner`;
      else res = `${radioValue[index].split('-')[0]}-tenant`;
      const i = radioValue.findIndex((el) => el === res);
      setRadioValue((items) => {
        items[i] = value;
        return [...items];
      });

      let id;
      if (radioValue[index].split('-')[1] === 'owner') id = `${radioValue[index].split('-')[0]}`;
      else id = `${radioValue[index].split('-')[0]}`;
      setState((items) => {
        const itemIndex = items.createUnitPayables.findIndex((item) => +item.payableId === +id);
        if (itemIndex !== -1) items.createUnitPayables.splice(itemIndex, 1);
        items.createUnitPayables.push({
          payableId: +id,
          isOwner: radioValue[index].split('-')[1] === 'owner',
          isTenant: radioValue[index].split('-')[1] === 'tenant',
        });
        return items;
      });
    },
    [radioValue]
  );

  const handleChange = (value, index) => {
    setSelectedRows((items) => {
      const i = items.findIndex((item) => item === value);
      if (i !== -1) items.splice(i, 1);
      else items.push(value);
      return [...items];
    });

    let id;
    if (radioValue[index].split('-')[1] === 'owner') id = `${radioValue[index].split('-')[0]}`;
    else id = `${radioValue[index].split('-')[0]}`;
    setState((items) => {
      const itemIndex = items.createUnitPayables.findIndex((item) => +item.payableId === +value);
      if (itemIndex !== -1) items.createUnitPayables.splice(itemIndex, 1);
      else {
        items.createUnitPayables.push({
          payableId: +id,
          isOwner: radioValue[index].split('-')[1] === 'owner',
          isTenant: radioValue[index].split('-')[1] === 'tenant',
        });
      }
      return items;
    });
  };

  return (
    <div className='unit-profile-payables-wrapper childs-wrapper'>
      <Spinner isActive={loading} />
      <div className='w-100 payables-wrapper'>
        <div className='payable-header w-100'>
          <span>{t(`${translationPath}payables`)}</span>
          <span>{t(`${translationPath}owner`)}</span>
          <span>{t(`${translationPath}tenant`)}</span>
        </div>
        {response &&
          response.map((item, index) => (
            <div className={`payables-table ${index % 2 === 0 ? 'gray-index' : ''} w-100`}>
              <div className='payable-content w-100'>
                <div className='payable-name'>
                  <Checkbox
                    size='small'
                    key={`${index + 1}-payable`}
                    value={`${item.lookupItemId}`}
                    checked={selectedRows.findIndex((el) => +el === +item.lookupItemId) !== -1}
                    onChange={(e) => handleChange(e.target.value, index)}
                  />
                  <span>{item.lookupItemName}</span>
                </div>
                <div
                  className={
                    !selectedRows.map((el) => +el === item.lookupItemId).includes(true) ?
                      'payable-radio' :
                      'payable-disabled'
                  }
                >
                  <RadiosGroupComponent
                    isDisabled={!selectedRows.map((el) => +el === item.lookupItemId).includes(true)}
                    idRef='payables-actions'
                    data={[
                      { value: `${item.lookupItemId}-owner` },
                      { value: `${item.lookupItemId}-tenant` },
                    ]}
                    onSelectedRadioChanged={(e) => handleRadioValueChange(e.target.value, index)}
                    value={radioValue.find((el) => +el.split('-')[0] === +item.lookupItemId)}
                    valueInput='value'
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

UnitProfilePayablesComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
