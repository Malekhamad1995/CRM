import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PropTypes } from 'prop-types';
import { NoContentComponent, Spinner, Tables } from '../../../../../Components';
import { GetLeaseReservationTenants } from '../../../../../Services';

const parentTranslationPath = 'UnitsProfileManagementView';
const translationPath = '';

export const UnitTenantComponent = ({ unitId }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [saleReservations, setSaleReservations] = useState({
    landLords: [],
    tenants: [],
  });
  const [filter] = useState({
    pageSize: 9999999,
    pageIndex: 0,
    search: '',
  });

  const getLeaseReservationTenants = useCallback(async () => {
    setIsLoading(true);
    const res = await GetLeaseReservationTenants({ id: unitId, isForAccountTab: false });
    if (!((res && res.data && res.data.ErrorId) || !res)) {
      setSaleReservations({
        landLords: res.landLords || [],
        tenants: res.tenants || [],
      });
    } else {
      setSaleReservations({
        landLords: [],
        tenants: [],
      });
    }
    setIsLoading(false);
  }, [unitId]);
  useEffect(() => {
    if (unitId) getLeaseReservationTenants();
  }, [getLeaseReservationTenants, unitId]);

  // const onPageIndexChanged = (pageIndex) => {
  //   setFilter((item) => ({ ...item, pageIndex }));
  // };
  // const onPageSizeChanged = (pageSize) => {
  //   setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  // };

  return (
    <div className='activities-view-wrapper childs-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='d-flex-column'>
        <div className='w-100 px-3'>
          {saleReservations.landLords.length === 0 && saleReservations.tenants.length === 0 ? (
            <NoContentComponent />
          ) : (
            !isLoading && (
              <div>
                <div>
                  <div className='title-section mt-3'>
                    <span>{t(`${translationPath}contact-list-landlord`)}</span>
                  </div>
                  <Tables
                    data={saleReservations.landLords}
                    headerData={[
                      {
                        id: 1,
                        isSortable: true,
                        label: 'contact-id',
                        input: 'contactId',
                      },
                      {
                        id: 2,
                        isSortable: true,
                        label: 'contact-name',
                        input: 'contactName',
                      },
                      // {
                      //   id: 3,
                      //   isSortable: true,
                      //   label: 'email',
                      //   input: 'email',
                      // },
                      // {
                      //   id: 4,
                      //   isSortable: true,
                      //   label: 'phone',
                      //   input: 'phone',
                      // },
                      {
                        id: 5,
                        isSortable: true,
                        label: 'lead-id',
                        input: 'leadId',
                      },
                      {
                        id: 6,
                        isSortable: true,
                        label: 'media-name',
                        input: 'contactMedia',
                      },
                    ]}
                    defaultActions={[]}
                    itemsPerPage={filter.pageSize}
                    activePage={filter.pageIndex}
                    translationPath={translationPath}
                    parentTranslationPath={parentTranslationPath}
                    totalItems={saleReservations.landLords.length}
                  />
                </div>
                <div className='mt-5'>
                  <div className='title-section'>
                    <span>{t(`${translationPath}contact-list-tenant`)}</span>
                  </div>
                  <Tables
                    data={saleReservations.tenants}
                    headerData={[
                      {
                        id: 1,
                        isSortable: true,
                        label: 'contact-id',
                        input: 'contactId',
                      },
                      {
                        id: 2,
                        isSortable: true,
                        label: 'contact-name',
                        input: 'contactName',
                      },
                      // {
                      //   id: 3,
                      //   isSortable: true,
                      //   label: 'email',
                      //   input: 'email',
                      // },
                      // {
                      //   id: 4,
                      //   isSortable: true,
                      //   label: 'phone',
                      //   input: 'phone',
                      // },
                      {
                        id: 5,
                        isSortable: true,
                        label: 'lead-id',
                        input: 'leadId',
                      },
                      {
                        id: 6,
                        isSortable: true,
                        label: 'media-name',
                        input: 'contactMedia',
                      },
                    ]}
                    // activePageChanged={onPageIndexChanged}
                    // itemsPerPageChanged={onPageSizeChanged}
                    defaultActions={[]}
                    // isOriginalPagination
                    itemsPerPage={filter.pageSize}
                    activePage={filter.pageIndex}
                    translationPath={translationPath}
                    parentTranslationPath={parentTranslationPath}
                    totalItems={saleReservations.tenants.length}
                  />
                </div>
                
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
UnitTenantComponent.propTypes = {
  unitId: PropTypes.number,
};
UnitTenantComponent.defaultProps = {
  unitId: null,
};
