import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { AutocompleteComponent } from '../../../../../../../Components';
import { MyLeadsTypesEnum } from '../../../../../../../Enums';
import { getErrorByName } from '../../../../../../../Helper';

export const LeadTypeComponent = ({
  parentTranslationPath,
  translationPath,
  onStateChanged,
  state,
  schema,
  isSubmitted,
  values,
  rotationEdit
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [isInValidleadType, setIsInValidleadTypeId] = useState(false);
  const [selected, setSelected] = useState([]);

  let leadsTypes = []
    MyLeadsTypesEnum.map((e) => {
      if (e.value === 'buyer' || e.value === 'tenant') leadsTypes.push(e);
    })

  useEffect(() => {
    if (state && state.rotationSchemeLeadType && state.rotationSchemeLeadType.length < 1) setIsInValidleadTypeId(true);
    else setIsInValidleadTypeId(false);
  }, [state]);

  useEffect(() => {
    if (rotationEdit !== null && values && values[0] && values[0].leadClass.length > 1) {
      values.forEach(item => {
        let findItem = MyLeadsTypesEnum.find((e) => e.value === item.leadClass)
        setSelected((e) => [...e, findItem])
      });
    }
  }, [state.rotationSchemaLeadsType]);


  return (
    <div className='dialog-content-item'>
      <AutocompleteComponent
        idRef='leadTypeRef'
        labelValue={t(`${translationPath}leadType`)}
        // inputClasses={isInValidleadType ? 'invalid' : ''}
        value={selected || []}
        data={leadsTypes || []}
        multiple
        displayLabel={(option) => (option && option.value) || ''}
        chipsLabel={(option) => (option && option.value) || ''}
        withoutSearchButton
        selectedValues={selected}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={(event, newValue) => {
          const localNewValue = {
            id: 'rotationSchemaLeadsType',
            value: [
              ...newValue.map((el) => ({ ...el, leadClass: el.id })),
            ],
          };
          onStateChanged(localNewValue);
          setSelected(newValue)
        }}
        isSubmitted={isSubmitted}
        helperText={getErrorByName(schema, 'rotationSchemeLeadType').message}
        error={getErrorByName(schema, 'rotationSchemeLeadType').error}
      />
    </div>
  );
};
const convertJsonValueShape = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
  PropTypes.number,
]);
LeadTypeComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  state: PropTypes.objectOf(convertJsonValueShape).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isInValidleadType: PropTypes.bool.isRequired,
  setIsInValidleadTypeId: PropTypes.func.isRequired,
};
