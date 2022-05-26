import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AutocompleteComponent } from '../../../../../../Components';
import { IncidentsGetAllPropertyByPortfolioId } from '../../../../../../Services';

export const PropertyComponent = ({
  parentTranslationPath,
  translationPath,
  portfolioId,
  setpropertyId,
  selected,
  setSelected,
  isDisabled , 
  helperText ,
  error , 
 isSubmitted
}) => {
  // propertyId
  const [AllProperty, setAllProperty] = useState([]);
  const [loadings, setLoadings] = useState(false);

  const GetAllPropertyByPortfolioId = useCallback(async (PortfolioId) => {

    setLoadings(true);
    const res = await IncidentsGetAllPropertyByPortfolioId(PortfolioId, 1, 100);
    if (!(res && res.status && res.status !== 200)) setAllProperty((res && res.result) || []);
    else setAllProperty([]);
    setLoadings(false);
  }, []);

  useEffect(() => {
    
    GetAllPropertyByPortfolioId(portfolioId);
  }, [GetAllPropertyByPortfolioId, portfolioId]);

  return (
    <div>
      <AutocompleteComponent
        idRef='PortfolioRef'
        labelValue='Property'
        selectedValues={selected}
        multiple={false}
        isDisabled={isDisabled}
        data={AllProperty}
        displayLabel={(option) => option.propertyName || ''}
        getOptionSelected={(option) => option.propertyId === selected.propertyId}
        withoutSearchButton
        isSubmitted={isSubmitted}
        helperText={helperText}
        error={error}
        isWithError
        isLoading={loadings}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={(event, newValue) => {
          setSelected(newValue && newValue);
          setpropertyId((newValue && +newValue.propertyId) || '');
        }}
      />
    </div>
  );
};
PropertyComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  portfolioId: PropTypes.string.isRequired,
  setpropertyId: PropTypes.string.isRequired,
  selected: PropTypes.string.isRequired,
  setSelected: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool.isRequired,
};
