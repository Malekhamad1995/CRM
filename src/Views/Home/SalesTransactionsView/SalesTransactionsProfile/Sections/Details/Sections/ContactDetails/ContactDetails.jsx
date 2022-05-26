import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { NoContentComponent, Spinner } from '../../../../../../../../Components';
import { GetSaleReservationClient } from '../../../../../../../../Services';
import { BuyerTable, SellerTable } from './Controls';

export const ContactDetails = ({
 unitId, parentTranslationPath, translationPath, unitTransactionId
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [saleReservations, setSaleReservations] = useState({
    buyers: [],
    sellers: [],
  });
  const [filter] = useState({
    pageSize: 9999999,
    pageIndex: 0,
    search: '',
  });
  const getSaleReservationClient = useCallback(async () => {
    setIsLoading(true);
    const saleTransactionDetailsId = localStorage.getItem('saleTransactionDetailsId');
    const res = await GetSaleReservationClient({ id: saleTransactionDetailsId, isForAccountTab: true });
    if (!((res && res.data && res.data.ErrorId) || !res)) {
      setSaleReservations({
        buyers: res.buyers || [],
        sellers: res.sellers || [],
      });
    } else {
      setSaleReservations({
        buyers: [],
        sellers: [],
      });
    }
    setIsLoading(false);
  }, [unitTransactionId]);

  useEffect(() => {
    if (unitTransactionId) getSaleReservationClient();
  }, [getSaleReservationClient, unitTransactionId]);
  return (
    <div className='contact-details-wrapper childs-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='d-flex-column'>
        <div className='w-100 px-3'>
          {saleReservations.buyers.length === 0 && saleReservations.sellers.length === 0 ? (
            <NoContentComponent />
          ) : (
            !isLoading && (
              <div>
                <SellerTable
                  sellers={saleReservations.sellers}
                  filter={filter}
                  translationPath={translationPath}
                  parentTranslationPath={parentTranslationPath}
                />
                <BuyerTable
                  buyers={saleReservations.buyers}
                  filter={filter}
                  translationPath={translationPath}
                  parentTranslationPath={parentTranslationPath}
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

ContactDetails.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  unitId: PropTypes.number.isRequired,
  unitTransactionId: PropTypes.number.isRequired,
};
