import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { NoContentComponent, Spinner } from '../../../../../../../../Components';
import { GetLeaseReservationTenants } from '../../../../../../../../Services';
import { LandlordsTable, TenantsTable } from './Controls';

export const ContactDetails = ({ unitId, parentTranslationPath, translationPath }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [leaseReservations, setLeaseReservations] = useState({
    landLords: [],
    tenants: [],
  });
  const [filter] = useState({
    pageSize: 9999999,
    pageIndex: 0,
    search: '',
  });
  const getLeaseReservationClient = useCallback(async () => {
    setIsLoading(true);
    const leaseTransactionDetailsId = localStorage.getItem('leaseTransactionDetailsId');
    const res = await GetLeaseReservationTenants({ id: leaseTransactionDetailsId, isForAccountTab: true });
    if (!((res && res.data && res.data.ErrorId) || !res)) {
      setLeaseReservations({
        landLords: res.landLords || [],
        tenants: res.tenants || [],
      });
    } else {
      setLeaseReservations({
        landLords: [],
        tenants: [],
      });
    }
    setIsLoading(false);
  }, [unitId]);

  useEffect(() => {
    if (unitId) getLeaseReservationClient();
  }, [getLeaseReservationClient, unitId]);
  return (
    <div className='contact-details-wrapper childs-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='d-flex-column'>
        <div className='w-100 px-3'>
          {leaseReservations.landLords.length === 0 && leaseReservations.tenants.length === 0 ? (
            <NoContentComponent />
          ) : (
            !isLoading && (
              <div>
                <LandlordsTable
                  landLords={leaseReservations.landLords}
                  filter={filter}
                  translationPath={translationPath}
                  parentTranslationPath={parentTranslationPath}
                />
                <TenantsTable
                  tenants={leaseReservations.tenants}
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
};
