import React, {
  useCallback, useEffect, useState, useReducer
} from 'react';
import PropTypes from 'prop-types';
import { GetParams } from '../../../../../../Helper';
import { Spinner } from '../../../../../../Components';
import { GetUnitImage } from '../../../../../../Services';
import { TabsComponent } from '../../../../../../Components/Controls/TabsComponent/TabsComponent';
import { UnitImagesTabsData } from '../../../../UnitsSalesView/UnitsSalesProfileManagement/TabsData';

export const UnitProfileImagesComponent = ({
  parentTranslationPath,
  translationPath,
  propertyId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [, setresponse] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [filterBy, setFilterBy] = useReducer(reducer, {
    countryId: null,
    cityId: null,
  });
  const [filter, setFilter] = useState({
    pageIndex: 0,
    pageSize: 25,
    search: '',
  });
  const onFilterByChanged = (newValue) => {
    setFilterBy(newValue);
  };
  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };

  // const imageHandler = useCallback(
  //   (option) => {
  //     const index =
  //       response && response.unitJson.findIndex((item) => item.uuid === option.imagePath);
  //     if (index !== -1) setActiveImageIndex(index);
  //     setIsGalleryOpen(true);
  //   },
  //   [response]
  // );
  const onTabChanged = (e, newTap) => {
    setActiveTab(newTap);
  };
  const GetUnitImageFormId = useCallback(async (editId) => {
    setIsLoading(true);
    const result = await GetUnitImage(editId);
    if (!(result && result.status && result.status !== 200)) {
      setresponse(
        (result && {
          ...result,
          unitJson:
            (result.unitJson &&
              Object.entries(result.unitJson).reduce(
                (total, item) =>
                  (item[0] !== 'selected' &&
                    total.concat(item[1].map((element) => ({ ...element, key: item[0] })))) ||
                  total,
                []
              )) ||
            [],
        }) ||
        []
      );
    } else setresponse([]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const editId = GetParams('id');
    if (editId !== null) GetUnitImageFormId(editId);
  }, [GetUnitImageFormId]);

  return (
    <div className='unit-profile-images-wrapper childs-wrapper'>
      <div>
        {/* <Spinner isActive={isLoading} isAbsolute /> */}
        <div>
          <TabsComponent
            data={UnitImagesTabsData}
            labelInput='label'
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            wrapperClasses='is-with-line tab-flex-start'
            themeClasses='theme-curved'
            currentTab={activeTab}
            onTabChanged={onTabChanged}
            dynamicComponentProps={{
              propertyId,
              filter,
              filterBy,
              onFilterByChanged,
              onPageIndexChanged,
              onPageSizeChanged,
              parentTranslationPath,
              translationPath,
            }}
          />
        </div>
      </div>
    </div>
  );
};

UnitProfileImagesComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  propertyId: PropTypes.number.isRequired,
};

UnitProfileImagesComponent.defaultProps = {
  translationPath: '',
};
