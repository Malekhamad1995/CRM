import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Inputs } from '../../../../../../../Components';
import { getErrorByName } from '../../../../../../../Helper';

export const SummarySaleRelatedComponent = ({
  state,
  selected,
  unitData,
  schema,
  isSubmitted,
  onStateChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <div className='summary-sale-related-wrapper childs-wrapper'>
      <div className='summary-box-wrapper'>
        <div className='summary-box'>
          <div className='summary-details-section'>
            <div className='summary-item-wrapper'>
              <span className='summary-title'>{t(`${translationPath}ref-no`)}</span>
              <span className='summary-value'>{(unitData && unitData.refNo) || 'N/A'}</span>
            </div>
            {/* <div className='summary-item-wrapper'>
              <span className='summary-title'>{t(`${translationPath}unit-no`)}</span>
              <span className='summary-value'>{state.unitNumber || 'N/A'}</span>
            </div> */}
            {/* <div className='summary-item-wrapper'>
              <span className='summary-title'>{t(`${translationPath}community`)}</span>
              <span className='summary-value'>{state.community || 'N/A'}</span>
            </div> */}
            <div className='summary-item-wrapper'>
              <span className='summary-title'>{t(`${translationPath}property`)}</span>
              <span className='summary-value'>{(unitData && unitData.name) || 'N/A'}</span>
            </div>
            <div className='summary-item-wrapper'>
              <span className='summary-title'>{t(`${translationPath}will-be-sold-to`)}</span>
              <span className='summary-value'>
                {(selected.tableContacts &&
                  selected.tableContacts.map(
                    (item, index) =>
                      `${item.contactName}${
                        (index < selected.tableContacts.length - 1 && ', ') || ''
                      }`
                  )) ||
                  'N/A'}
              </span>
            </div>
            <div className='summary-item-wrapper'>
              <span className='summary-title'>{t(`${translationPath}phone-number`)}</span>
              <span className='summary-value'>
                {(selected.tableContacts &&
                  selected.tableContacts.length > 0 &&
                  selected.tableContacts[0].phone) ||
                  'N/A'}
              </span>
            </div>
            <div className='summary-item-wrapper'>
              <span className='summary-title'>{t(`${translationPath}in-the-name`)}</span>
              <span className='summary-value'>{(unitData && unitData.ownerName) || 'N/A'}</span>
            </div>
            <div className='summary-item-wrapper'>
              <span className='summary-title'>{t(`${translationPath}for-the-sale-price-of`)}</span>
              <span className='summary-value'>{state.sellingPrice || 'N/A'}</span>
            </div>
          </div>
          <div className='summary-input-section'>
            <Inputs
              idRef='noteRef'
              labelValue='notes'
              value={state.note || ''}
              helperText={getErrorByName(schema, 'note').message}
              error={getErrorByName(schema, 'note').error}
              isWithError
              isSubmitted={isSubmitted}
              multiline
              rows={6}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onInputChanged={(event) => {
                onStateChanged({ id: 'note', value: event.target.value });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

SummarySaleRelatedComponent.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  selected: PropTypes.instanceOf(Object).isRequired,
  unitData: PropTypes.instanceOf(Object).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
