import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Spinner, PaginationComponent } from '../../../../../../Components';
import { GetAllLandLordByPortfolioId } from '../../../../../../Services';
import { bottomBoxComponentUpdate, GetParams } from '../../../../../../Helper';
import { LandlordsCard } from '../LandlordsCardCompoent/LandlordsCard';

export const LandlordsView = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({});
  const [PortfolioId, SetPortfolioId] = useState(null);
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
  });

  useEffect(() => {
    SetPortfolioId(+GetParams('id'));
  }, []);

  const getCompanyFinanceById = useCallback(async () => {
    setLoading(true);
    if (PortfolioId) {
      const result = await GetAllLandLordByPortfolioId(
        PortfolioId,
        filter.pageIndex,
        filter.pageSize
      );
      if (!(result && result.status && result.status !== 200)) setResponse(result);
      else setResponse({});
    }
    setLoading(false);
  }, [filter, PortfolioId]);
  useEffect(() => {
    getCompanyFinanceById();
  }, [getCompanyFinanceById]);

  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };

  useEffect(() => {
    bottomBoxComponentUpdate(
      <PaginationComponent
        pageIndex={filter.pageIndex}
        pageSize={filter.pageSize}
        totalCount={response.totalCount}
        onPageIndexChanged={onPageIndexChanged}
        onPageSizeChanged={onPageSizeChanged}
      />
    );
  });
  useEffect(
    () => () => {
      bottomBoxComponentUpdate(null);
    },
    []
  );
  return (
    <div className='associated-contacts-wrapper childs-wrapper properties-finance-wrapper'>
      <Spinner isActive={loading} />
      <div className='title-section'>
        <span>{t(`${translationPath}Landlords`)}</span>
      </div>
      <div className='w-100 px-2 land-container'>
        <LandlordsCard
          data={response.result}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
    </div>
  );
};

LandlordsView.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
