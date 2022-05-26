import React, {
  useCallback, useEffect, useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';

import {
  NoContentComponent,
  PaginationComponent, Spinner, Tables
} from '../../../../Components';
import 'react-quill/dist/quill.snow.css';
import {
  GetParams, GlobalHistory
} from '../../../../Helper';
import { GetCommunitiesLookups } from '../../../../Services';


export const TabelCommunitiesRelated = ({
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tableActionClicked = useCallback((item) => {
    GlobalHistory.push(`/home/Communitie/edit?id=${item.lookupsId}&lookupItemName=${item.lookupItemName}`);
  });
  const localId = GetParams('id');
  const [filter, setFilter] = useState({
    lookupItemId: localId,
    pageIndex: 0,
    pageSize: 25,
  });
  const [DetailsCountry, setDetailsCountry] = useState({
    result: [],
    totalCount: 0,
  });

  const getAllMyReferrals = useCallback(async () => {
    setIsLoading(true);
    const res = await GetCommunitiesLookups(filter);
    if (!(res && res.status && res.status !== 200)) {
      setDetailsCountry({
        result: ((res && res.result && res.result) || []),
        totalCount: ((res && res.totalCount) || 0)
      });
    } else {
      setDetailsCountry({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
  }, [filter]);

  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };


  useEffect(() => {
    getAllMyReferrals();
  }, [getAllMyReferrals, localId]);
  return (
    <div className='view-wrapper-TabelRelated'>
      <Spinner isActive={isLoading} />
      {DetailsCountry.result.length === 0 && DetailsCountry.totalCount === 0 ? (
        <NoContentComponent />
      ) : (
        <>
          <div className='w-100 px-2  TabelRelated'>
            <Tables
              data={(DetailsCountry && DetailsCountry.result) || []}
              headerData={[
                {
                  id: 1,
                  isSortable: true,
                  label: (`${translationPath}Communitie`),
                  input: 'lookupItemName',
                },
                {
                  id: 2,
                  label: (`${translationPath}Creator`),
                  component: (item) => (
                    <>
                      {((item &&
                        item.createdByName &&
                        item.createdByName) ||
                        'N/A')}
                    </>
                  )
                },
                {
                  id: 4,
                  label: t(`${translationPath}Action`),
                  component: (item) => (
                    <>
                      <Button
                        onClick={() => {
                          tableActionClicked(item);
                        }}
                        className='MuiButtonBase-root MuiButton-root MuiButton-text table-action-btn  btns-icon theme-solid bg-secondary'
                      >
                        <span className='MuiButton-label'>
                          <span className='table-action-icon  mdi mdi-lead-pencil' />
                        </span>
                      </Button>
                    </>
                  ),
                },
              ]}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              totalItems={(DetailsCountry && DetailsCountry.totalCount) || 0}
              defaultActions={[]}
              itemsPerPage={filter.pageSize}
              activePage={filter.pageIndex}
            />
          </div>
          <div className='PaginationComponent-wrapper'>
            <PaginationComponent
              pageIndex={filter.pageIndex}
              pageSize={filter.pageSize}
              totalCount={(DetailsCountry && DetailsCountry.totalCount) || 0}
              onPageIndexChanged={onPageIndexChanged}
              onPageSizeChanged={onPageSizeChanged}
            />

          </div>
        </>
      )}
    </div>
  );
};
// AddFormCountry.propTypes = {
//   parentTranslationPath: PropTypes.string.isRequired,
//   translationPath: PropTypes.string.isRequired,
//   activeItem: PropTypes.instanceOf(Object).isRequired,
//   Data: PropTypes.instanceOf(Object).isRequired,
//   edit: PropTypes.bool.isRequired,
//   onCancelClicked: PropTypes.func.isRequired,
//   GetAllActivityTypesAPI: PropTypes.func.isRequired,
//   setReloading: PropTypes.func,
// };
