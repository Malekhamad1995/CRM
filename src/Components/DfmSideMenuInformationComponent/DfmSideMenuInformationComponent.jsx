import React, { useCallback, useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { GetAllFormFieldTabsByFormId } from '../../Services';

export const DfmSideMenuInformationComponent = ({
  activeData,
  setIsLoading,
  translationPath,
  t,
}) => {
  const [formAndTabs, setFormAndTabs] = useState([]);

  const getAllFormFieldTabsByFormId = useCallback(async () => {
    setIsLoading(true);
    const result = await GetAllFormFieldTabsByFormId({ formId: activeData.userTypeId });
    if (!(result && result.status && result.status !== 200))
      setFormAndTabs((result && result[0]) || []);
    else setFormAndTabs([]);
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeData.userTypeId]);

  useEffect(() => {
    if (activeData && activeData.userTypeId) getAllFormFieldTabsByFormId();
  }, [activeData, getAllFormFieldTabsByFormId]);

  return (
    <div>
      {activeData &&
        activeData.allDetails &&
        formAndTabs &&
        formAndTabs.map(
          (item, i) =>
            item.tab !== 'Upload Files' &&
            activeData.allDetails[item.tab] &&
            activeData.allDetails[item.tab].map((el) => el.value !== 'N/A').includes(true) && (
              <div key={`${i + 1}-form-tab`}>
                <div className='items-title px-2 mb-2 mt-3'>
                  <span>{t(`${translationPath}${item.tab}`)}</span>
                </div>
                {activeData.allDetails[item.tab].map(
                  (el, index) =>
                    el.value !== 'N/A' &&
                    item.group.findIndex((f) => f.formFieldName === el.title) !== -1 && (
                      <div className='px-2 mb-2' key={`${index + 1}-form-value`}>
                        <span className='texts gray-primary-bold'>
                          {`${t(`${translationPath}${el.title}`)}`}
                          :
                        </span>
                        <span className='texts s-gray-primary mx-1'>
                          <span>{el.value}</span>
                        </span>
                      </div>
                    )
                )}
              </div>
            )
        )}
    </div>
  );
};

DfmSideMenuInformationComponent.propTypes = {
  activeData: PropTypes.instanceOf(Object).isRequired,
  setIsLoading: PropTypes.bool.isRequired,
  translationPath: PropTypes.string.isRequired,
  t: PropTypes.instanceOf(Object).isRequired,
};
