import React from 'react';
import Button from '@material-ui/core/Button';
import { PropTypes } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { SelectComponet, RadiosGroupComponent } from '../../../../../Components';

const parentTranslationPath = 'LeadsView';
const translationPath = 'utilities.advanceSearchComponent.';
const AdvanceSearchComponent = ({
  onAdvanceSearchSaved,
  onSelectChanged,
  city,
  userAccountType,
  type,
  sellerType,
  onSelectedRadioChanged,
  actionRadio,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onAdvanceSearchSaved();
      }}
      className='advance-search-wrapper'
    >
      <div className='d-flex-v-center-h-between'>
        <p className='texts primary-bold px-2'>{t(`${translationPath}search`)}</p>
        <Button type='submit' className='btns theme-solid mb-2 mx-2'>
          <span>{t(`${translationPath}save-search`)}</span>
        </Button>
      </div>
      <SelectComponet
        idRef='cityRef'
        data={[
          { id: 1, city: 'Dubai' },
          { id: 2, city: 'Amman' },
        ]}
        defaultValue={city}
        wrapperClasses='mb-2 px-2'
        themeClass='theme-underline'
        valueInput='id'
        textInput='city'
        onSelectChanged={(value) => onSelectChanged('city', value)}
        emptyItem={{ value: 0, text: 'select-city', isDisabled: false }}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
      <SelectComponet
        idRef='userAccountRef'
        data={[
          { id: 1, userAccountType: 'VIP' },
          { id: 2, userAccountType: 'Platinum' },
        ]}
        defaultValue={userAccountType}
        wrapperClasses='mb-2 px-2'
        themeClass='theme-underline'
        valueInput='id'
        textInput='userAccountType'
        onSelectChanged={(value) => onSelectChanged('userAccountType', value)}
        emptyItem={{ value: 0, text: 'select-user-account-type', isDisabled: false }}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
      <SelectComponet
        idRef='typeRef'
        data={[
          { id: 1, type: 'Individual' },
          { id: 2, type: 'Group' },
        ]}
        defaultValue={type}
        wrapperClasses='mb-3 px-2'
        themeClass='theme-underline'
        valueInput='id'
        textInput='type'
        onSelectChanged={(value) => onSelectChanged('type', value)}
        emptyItem={{ value: 0, text: 'select-type', isDisabled: false }}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
      <RadiosGroupComponent
        data={[
          { id: 1, value: 'Rent' },
          { id: 2, value: 'Sale' },
        ]}
        valueInput='id'
        labelInput='value'
        value={actionRadio}
        onSelectedRadioChanged={onSelectedRadioChanged}
        name='radioGroups'
        titleClasses='texts gray-primary-bold'
        wrapperClasses='mb-3'
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        labelValue='action'
      />
      <p className='texts gray-primary-bold px-3 mb-0'>{t(`${translationPath}seller-type`)}</p>
      <SelectComponet
        idRef='sellerTypeRef'
        data={[
          { id: 1, type: 'Owner' },
          { id: 2, type: 'Group' },
        ]}
        defaultValue={sellerType}
        wrapperClasses='mb-3 px-2'
        themeClass='theme-underline'
        valueInput='id'
        textInput='type'
        onSelectChanged={(value) => onSelectChanged('sellerType', value)}
        emptyItem={{ value: 0, text: 'select-seller-type', isDisabled: false }}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
      <div className='mb-3 px-2'>
        <Button className='btns theme-solid bg-secondary w-100'>
          <span>{t(`${translationPath}update-search`)}</span>
        </Button>
      </div>
      <div className='mb-3 px-2'>
        <Button className='btns theme-transparent w-100'>
          <span>{t(`${translationPath}clear-search`)}</span>
        </Button>
      </div>
      <div className='mb-3 px-2'>
        <Button type='submit' className='btns theme-solid w-100'>
          <span>{t(`${translationPath}save-search`)}</span>
        </Button>
      </div>
    </form>
  );
};
AdvanceSearchComponent.propTypes = {
  onAdvanceSearchSaved: PropTypes.func.isRequired,
  onSelectChanged: PropTypes.func.isRequired,
  onSelectedRadioChanged: PropTypes.func.isRequired,
  city: PropTypes.number.isRequired,
  userAccountType: PropTypes.number.isRequired,
  type: PropTypes.number.isRequired,
  sellerType: PropTypes.number.isRequired,
  actionRadio: PropTypes.number.isRequired,
};
export { AdvanceSearchComponent };
