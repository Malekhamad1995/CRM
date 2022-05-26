import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PropTypes } from 'prop-types';
import { NoContentComponent, Spinner, Tables } from '../../../../../Components';
import { GetSaleReservationClient } from '../../../../../Services';

const parentTranslationPath = 'UnitsProfileManagementView';
const translationPath = '';

export const UnitSaleComponent = ({ unitId }) => {
  const { t } = useTranslation(parentTranslationPath);
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
    const res = await GetSaleReservationClient({ id: unitId, isForAccountTab: false });
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
  }, [unitId]);

  useEffect(() => {
    if (unitId) getSaleReservationClient();
  }, [getSaleReservationClient, unitId]);

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
          {saleReservations.buyers.length === 0 && saleReservations.sellers.length === 0 ? (
            <NoContentComponent />
          ) : (
            !isLoading && (
              <div>
                <div className='mb-2'>
                  <div className='title-section'>
                    <span>{t(`${translationPath}contact-list-seller`)}</span>
                  </div>
                  <Tables
                    data={saleReservations.sellers}
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
                    totalItems={saleReservations.sellers.length}
                  />
                </div>
                <div>
                  <div className='title-section mt-3'>
                    <span>{t(`${translationPath}contact-list-buyer`)}</span>
                  </div>
                  <Tables
                    data={saleReservations.buyers}
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
                    totalItems={saleReservations.buyers.length}
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
UnitSaleComponent.propTypes = {
  unitId: PropTypes.number,
};
UnitSaleComponent.defaultProps = {
  unitId: null,
};
