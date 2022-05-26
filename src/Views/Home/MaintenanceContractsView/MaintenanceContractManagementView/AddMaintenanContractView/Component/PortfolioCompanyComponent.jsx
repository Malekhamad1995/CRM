import React, { useCallback, useEffect, useState } from 'react'; // useRef, useEffect, useCallback   useState,

import PropTypes from 'prop-types';
import { AutocompleteComponent } from '../../../../../../Components';
import { GetAllPortfolioMaintenance } from '../../../../../../Services/MaintenanceContractsServices';

export const PortfolioCompanyComponent = ({
  parentTranslationPath,
  translationPath,
  selected,
  setSelected,
  portfolioId,
  setportfolioId,
  setSelectedProperty,
  setisDisabled,
  helperText,
  error,
  isSubmitted

}) => {
  const [filter, seFilter] = useState({
    pageSize: 100,
    pageIndex: 0,
    search: '',
  });
  const [Portfolio, setPortfolio] = useState({});
  const [loadings, setloadings] = useState(false);
  const getAllPortfolio = useCallback(async () => {
    setloadings(true);
    const res = await GetAllPortfolioMaintenance(filter);
    if (!(res && res.status && res.status !== 200)) setPortfolio((res && res.result) || []);
    else setPortfolio([]);
    setloadings(false);
  }, [filter]);

  useEffect(() => {
    getAllPortfolio();
  }, [getAllPortfolio]);
  return (
    <div>
      <AutocompleteComponent
        idRef='PortfolioRef'
        labelValue='Portfolio'
        selectedValues={selected}
        multiple={false}
        data={Portfolio}
        displayLabel={(option) => option.portfolioName || ''}
        getOptionSelected={(option) => option.portfolioId === portfolioId}
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
          setportfolioId((newValue && +newValue.portfolioId) || '');
          setSelectedProperty({});
         if (setisDisabled) setisDisabled();
        }}
      />
    </div>
  );
};
PortfolioCompanyComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  portfolioId: PropTypes.number,
  selected: PropTypes.string.isRequired,
  setSelected: PropTypes.string.isRequired,
  setportfolioId: PropTypes.string.isRequired,
  setSelectedProperty: PropTypes.string.isRequired,
  setisDisabled: PropTypes.bool.isRequired,
};
PortfolioCompanyComponent.defaultProps = {
  portfolioId: null,
};
