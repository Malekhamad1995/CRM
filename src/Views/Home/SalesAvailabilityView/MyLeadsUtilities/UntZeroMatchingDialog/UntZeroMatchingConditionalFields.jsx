import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { DatePickerComponent, SelectComponet } from '../../../../../Components';
import { ExpectedRoiEnum, MovingMonthEnum } from '../../../../../Enums';

const parentTranslationPath = 'SalesAvailabilityView';
const translationPath = '';
export const UntZeroMatchingConditionalFields = ({ selected, setSelected }) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  return (
    <>
      {selected.unitFor && selected.unitFor.key === 1 && (
        <div className='form-item mb-3'>
          <SelectComponet
            data={ExpectedRoiEnum}
            textInput='value'
            labelValue={t(`${translationPath}expected-roi`)}
            idRef='relatedToTypeRef'
            valueInput='value'
            onSelectChanged={(newValue) =>
              setSelected({
                id: 'expectedRoi',
                value: newValue || null,
              })}
            value={selected.expectedRoi}
            wrapperClasses='over-input-select w-100'
            translationPathForData={translationPath}
          />
        </div>
      )}
      {selected.unitFor && selected.unitFor.key === 2 && (
        <>
          <div className='form-item mb-3'>
            <DatePickerComponent
              idRef='activityDateRef'
              labelValue={t(`${translationPath}move-in-date`)}
              placeholder='DD/MM/YYYY'
              value={selected.moveInDate}
              minDate={moment().format('YYYY-MM-DDTHH:mm:ss')}
              onDateChanged={(newValue) =>
                setSelected({
                  id: 'moveInDate',
                  value: newValue || null,
                })}
            />
          </div>
          <div className='form-item mb-3'>
            <SelectComponet
              data={MovingMonthEnum}
              textInput='value'
              labelValue={t(`${translationPath}moving-month`)}
              idRef='relatedToTypeRef'
              valueInput='value'
              onSelectChanged={(newValue) =>
                setSelected({
                  id: 'movingMonth',
                  value: newValue || null,
                })}
              value={selected.movingMonth}
              wrapperClasses='over-input-select w-100'
              translationPathForData={translationPath}
            />
          </div>
        </>
      )}
    </>
  );
};
UntZeroMatchingConditionalFields.propTypes = {
  setSelected: PropTypes.func.isRequired,
  selected: PropTypes.instanceOf(Object).isRequired,
};
