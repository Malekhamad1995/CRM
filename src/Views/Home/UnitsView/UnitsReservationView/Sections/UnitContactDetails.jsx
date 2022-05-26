import React, { useState } from 'react';
import { Inputs, RadiosGroupComponent, Spinner } from '../../../../../Components';
// import { GetAllPortfolio } from '../../../../../Services';

const parentTranslationPath = 'UnitsProfileManagementView';
const translationPath = '';

export const UnitContactDetails = () => {
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [state, setState] = useState({});

  // const getAllActivities = useCallback(async () => {
  //   setIsLoading(true);
  //   const res = await GetAllPortfolio(0);
  //   if (res && res.totalCount === 0) setisFirstLoad(false);
  //   if (!(res && res.status && res.status !== 200)) {
  //     setPortfolios({
  //       result: (res && res.result) || [],
  //       totalCount: (res && res.totalCount) || 0,
  //     });
  //   } else {
  //     setPortfolios({
  //       result: [],
  //       totalCount: 0,
  //     });
  //   }
  //   setIsLoading(false);
  // }, []);

  // useEffect(() => {
  //   getAllActivities();
  // }, [getAllActivities]);

  return (
    <div className='view-wrapper activities-view-wrapper'>
      <Spinner isActive={isLoading} />
      <div className='d-flex'>
        <div className='form-item'>
          <RadiosGroupComponent
            idRef='isPriceOnApplicationRef'
            labelValue='tenancy-contract-issued'
            data={[
              {
                key: true,
                value: 'yes',
              },
              {
                key: false,
                value: 'no',
              },
            ]}
            value={state.priceOnApplication}
            parentTranslationPath={parentTranslationPath}
            translationPathForData={translationPath}
            translationPath={translationPath}
            labelInput='value'
            valueInput='key'
            onSelectedRadioChanged={(e, newValue) => { }}
          />
        </div>
        <div className='form-item'>
          <Inputs
            idRef='basePriceRef'
            labelValue='contact-issued-date'
            value={state.basePrice || 0}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onInputChanged={(event) => { }}
          />
        </div>
        <div className='form-item'>
          <Inputs
            idRef='basePriceRef'
            labelValue='contact-issued-by'
            value={state.basePrice || 0}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onInputChanged={(event) => { }}
          />
        </div>
      </div>
      <div className='d-flex'>
        <div className='form-item'>
          <Inputs
            idRef='basePriceRef'
            labelValue='receipt-#'
            value={state.basePrice || 0}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onInputChanged={(event) => { }}
          />
        </div>
        <div className='form-item'>
          <RadiosGroupComponent
            idRef='isPriceOnApplicationRef'
            labelValue='print-contract-on'
            data={[
              {
                key: true,
                value: 'yes',
              },
              {
                key: false,
                value: 'no',
              },
            ]}
            value={state.priceOnApplication}
            parentTranslationPath={parentTranslationPath}
            translationPathForData={translationPath}
            translationPath={translationPath}
            labelInput='value'
            valueInput='key'
            onSelectedRadioChanged={(e, newValue) => { }}
          />
        </div>
      </div>
    </div>
  );
};
