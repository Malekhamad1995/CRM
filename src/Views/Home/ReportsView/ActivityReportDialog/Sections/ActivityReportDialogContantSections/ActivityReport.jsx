
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { ButtonBase } from '@material-ui/core';
import { SelectComponet, DatePickerComponent } from '../../../../../../Components';

export const ActivityReport = ({
  parentTranslationPath,
  translationPath,

}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (

    <div className='d-flex px-2'>
      <span className='px-2 d-flex'>
        <div className='px-2'>
          <SelectComponet
            idRef='filterByRef'
            data={[
              { id: 1, filterByProprty: 'created-on' },
              { id: 2, filterByProprty: 'last-updated' },
            ]}
            defaultValue={0}
            menuClasses='theme-default'
            emptyItem={{
              value: 0, text: 'specific-proprty', isDisabled: false
            }}
            onSelectChanged={() => { }}
            wrapperClasses='mb-2 px-2'
            themeClass='theme-transparent'
            valueInput='id'
            textInput='filterByProprty'
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            translationPathForData={translationPath}
          />
        </div>
        <div className='verticalLine mt-1' />
        <div className='px-2'>
          <SelectComponet
            idRef='filterByRef'
            data={[
              { id: 1, filterByQaAgent: 'created-on' },
              { id: 2, filterByQaAgent: 'last-updated' },
            ]}
            defaultValue={0}
            menuClasses='theme-default'
            emptyItem={{
              value: 0, text: 'qa-Agent', isDisabled: false
            }}
            onSelectChanged={() => { }}
            wrapperClasses='mb-2 px-2'
            themeClass='theme-transparent'
            valueInput='id'
            textInput='filterByQaAgent'
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            translationPathForData={translationPath}
          />
        </div>
        <div className='verticalLine mt-1' />

        <div className='px-2'>
          <DatePickerComponent
            idRef='curredonDateRef'
            labelValue='Date'
            placeholder='DD/MM/YYYY'
            // value={ }
            wrapperClasses='theme-underline'
            themeClasses='theme-solid'
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          // onDateChanged={(newValue) => {
          //   setstartDate((newValue && moment(newValue).format()) || null);
          // }}
          />
        </div>
      </span>
    </div>
  );
};

ActivityReport.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,

};
