import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Inputs, SelectComponet } from '../../../../../Components';
import { AreaSizeEnum, BedroomEnum, ProjectStatusEnum } from '../../../../../Enums';
import { UntZeroMatchingConditionalFields } from './UntZeroMatchingConditionalFields';

const parentTranslationPath = 'SalesAvailabilityView';
const translationPath = '';
export const UntZeroMatchingFieldsRightSection = ({ data, selected, setSelected }) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const getAskingPriceData = useCallback(() => {
    const askingArr = [100000, 500000];
    let counter = 1;
    while (askingArr[askingArr.length - 1] !== 7000000) {
      askingArr.push(askingArr[counter] + 50000);
      counter += 1;
    }
    askingArr.push(10000000, 15000000, 20000000);
    return askingArr;
  }, []);
  return (
    <div className='form-wrapper px-5 w-50'>
      <div className='form-item mb-2'>
        <Inputs
          idRef='firstNameRef'
          labelValue={t(`${translationPath}more-about-location-requirements`)}
          value={selected.locationRequirements || ''}
          onInputChanged={(event) =>
            setSelected({ id: 'locationRequirements', value: event.target.value })}
        />
      </div>
      <div className='form-item mb-3'>
        <SelectComponet
          data={data.unitViews || []}
          textInput='lookupItemName'
          valueInput='lookupItemName'
          labelValue={t(`${translationPath}primary-view`)}
          idRef='relatedToTypeRef'
          onSelectChanged={(newValue) =>
            setSelected({
              id: 'unitPrimaryViews',
              value: newValue || null,
            })}
          value={selected.unitPrimaryViews}
          wrapperClasses='over-input-select pr-2 w-50'
          translationPathForData={translationPath}
        />
        <SelectComponet
          data={data.unitViews || []}
          textInput='lookupItemName'
          valueInput='lookupItemName'
          labelValue={t(`${translationPath}secondary-view`)}
          idRef='relatedToTypeRef'
          onSelectChanged={(newValue) =>
            setSelected({
              id: 'unitSecondaryViews',
              value: newValue || null,
            })}
          value={selected.unitSecondaryViews}
          wrapperClasses='over-input-select w-50'
          translationPathForData={translationPath}
        />
      </div>
      <div className='form-item mb-3'>
        <SelectComponet
          data={BedroomEnum}
          labelValue={t(`${translationPath}bedroom`)}
          textInput='value'
          valueInput='value'
          idRef='relatedToTypeRef'
          onSelectChanged={(newValue) =>
            setSelected({
              id: 'bedroom',
              value: (newValue && newValue) || null,
            })}
          value={selected.bedroom}
          wrapperClasses='over-input-select'
          translationPathForData={translationPath}
        />
      </div>
      <div className='form-item mb-3'>
        <SelectComponet
          data={AreaSizeEnum}
          labelValue={t(`${translationPath}area-size-sqft`)}
          idRef='relatedToTypeRef'
          textInput='value'
          valueInput='value'
          onSelectChanged={(newValue) =>
            setSelected({
              id: 'areaSize',
              value: (newValue && newValue) || null,
            })}
          value={selected.areaSize}
          wrapperClasses='over-input-select'
          translationPathForData={translationPath}
        />
      </div>
      <div className='form-item mb-3'>
        <SelectComponet
          data={getAskingPriceData()}
          labelValue={t(`${translationPath}client-budget`)}
          idRef='relatedToTypeRef'
          onSelectChanged={(newValue) =>
            setSelected({
              id: 'askingMinPrice',
              value: (newValue && newValue) || null,
            })}
          value={selected.askingMinPrice}
          wrapperClasses='over-input-select pr-2 w-50'
          translationPathForData={translationPath}
        />
        <SelectComponet
          data={getAskingPriceData()}
          idRef='relatedToTypeRef'
          onSelectChanged={(newValue) =>
            setSelected({
              id: 'askingMaxPrice',
              value: (newValue && newValue) || null,
            })}
          value={selected.askingMaxPrice}
          wrapperClasses='over-input-select w-50 mt-3 pt-1'
          translationPathForData={translationPath}
        />
      </div>
      <div className='form-item mb-3 pt-2'>
        <SelectComponet
          data={data.paymentMethod || []}
          labelValue={t(`${translationPath}payment-method`)}
          textInput='lookupItemName'
          valueInput='lookupItemName'
          idRef='relatedToTypeRef'
          onSelectChanged={(newValue) =>
            setSelected({
              id: 'paymentMethod',
              value: newValue || null,
            })}
          value={selected.paymentMethod}
          wrapperClasses='over-input-select pr-2 w-50'
          translationPathForData={translationPath}
        />
        <SelectComponet
          data={ProjectStatusEnum}
          idRef='relatedToTypeRef'
          textInput='value'
          valueInput='value'
          labelValue={t(`${translationPath}project-status`)}
          onSelectChanged={(newValue) =>
            setSelected({
              id: 'projectStatus',
              value: (newValue && newValue) || null,
            })}
          value={selected.projectStatus}
          wrapperClasses='over-input-select w-50'
          translationPathForData={translationPath}
        />
      </div>
      <UntZeroMatchingConditionalFields selected={selected} setSelected={setSelected} />
    </div>
  );
};
UntZeroMatchingFieldsRightSection.propTypes = {
  setSelected: PropTypes.func.isRequired,
  selected: PropTypes.instanceOf(Object).isRequired,
  data: PropTypes.instanceOf(Object).isRequired,
};
