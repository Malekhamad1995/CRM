import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { GetAllImagesByTypeId } from '../../../../../Services';
import { ImagesGalleryFilterEnum } from '../../../../../Enums';
import { bottomBoxComponentUpdate } from '../../../../../Helper';
import { PaginationComponent, Spinner } from '../../../../../Components';
import { ImagesGalleryFilterComponent } from '../ImagesGalleryFilterComponent/ImagesGalleryFilterComponent';
import { ImagesGalleryPhotosCardComponent } from './ImagesGalleryPhotosCardComponent';

export const ImagesGalleryPhotosComponent = ({
  fromPage,
  filter,
  filterBy,
  onFilterByChanged,
  onPageIndexChanged,
  onPageSizeChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [cityPhotos, setCityPhotos] = useState({
    result: [],
    totalCount: 0,
  });
  const getlookupItemByType = (lookupItems, lookupType, key) =>
    (lookupItems.findIndex((item) => item.lookupType === lookupType) !== -1 &&
      lookupItems.find((item) => item.lookupType === lookupType)[key]) ||
    null;
  const getAllCityPhotos = useCallback(async () => {
    setIsLoading(true);
    const searchLookupItemId = Object.entries(filterBy)
      .reverse()
      .find((item) => item && item[1]);
    const res = await GetAllImagesByTypeId({
      ...filter,
      lookupItemId: (searchLookupItemId && searchLookupItemId[1]),
      typeId: fromPage
    });
    if (!((res && res.data && res.data.ErrorId) || !res)) {
      setCityPhotos({
        result:
          (res.result &&
            res.result.map((item) => ({
              ...item,
              countryId: getlookupItemByType(
                item.lookupItems || [],
                ImagesGalleryFilterEnum.Country.lookupType,
                'lookupItemNameId'
              ),
              countryName: getlookupItemByType(
                item.lookupItems || [],
                ImagesGalleryFilterEnum.Country.lookupType,
                'lookupItemName'
              ),
              cityId: getlookupItemByType(
                item.lookupItems || [],
                ImagesGalleryFilterEnum.City.lookupType,
                'lookupItemNameId'
              ),
              cityName: getlookupItemByType(
                item.lookupItems || [],
                ImagesGalleryFilterEnum.City.lookupType,
                'lookupItemName'
              ),
              districtId: getlookupItemByType(
                item.lookupItems || [],
                ImagesGalleryFilterEnum.District.lookupType,
                'lookupItemNameId'
              ),
              districtName: getlookupItemByType(
                item.lookupItems || [],
                ImagesGalleryFilterEnum.District.lookupType,
                'lookupItemName'
              ),
              communityId: getlookupItemByType(
                item.lookupItems || [],
                ImagesGalleryFilterEnum.Community.lookupType,
                'lookupItemNameId'
              ),
              communityName: getlookupItemByType(
                item.lookupItems || [],
                ImagesGalleryFilterEnum.Community.lookupType,
                'lookupItemName'
              ),
              subCommunityId: getlookupItemByType(
                item.lookupItems || [],
                ImagesGalleryFilterEnum.Subcommunity.lookupType,
                'lookupItemNameId'
              ),
              subCommunityName: getlookupItemByType(
                item.lookupItems || [],
                ImagesGalleryFilterEnum.Subcommunity.lookupType,
                'lookupItemName'
              ),
            }))) ||
          [],
        totalCount: res.totalCount || 0,
      });
    } else {
      setCityPhotos({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
  }, [filter, filterBy, fromPage]);
  useEffect(() => {
    bottomBoxComponentUpdate(
      <PaginationComponent
        pageIndex={filter.pageIndex}
        pageSize={filter.pageSize}
        totalCount={cityPhotos.totalCount}
        onPageIndexChanged={onPageIndexChanged}
        onPageSizeChanged={onPageSizeChanged}
      />
    );
  });
  useEffect(() => {
    getAllCityPhotos();
  }, [filter, getAllCityPhotos, filterBy]);
  return (
    <div className='gallery-city-photos-wrapper childs-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <ImagesGalleryFilterComponent
        filterBy={filterBy}
        fromPage={fromPage}
        onFilterByChanged={onFilterByChanged}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
      <ImagesGalleryPhotosCardComponent
        data={cityPhotos.result || []}
        fromPage={fromPage}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
    </div>
  );
};

ImagesGalleryPhotosComponent.propTypes = {
  fromPage: PropTypes.oneOf(Object.values(ImagesGalleryFilterEnum).map((item) => item.key)),
  filter: PropTypes.instanceOf(Object).isRequired,
  filterBy: PropTypes.instanceOf(Object).isRequired,
  onFilterByChanged: PropTypes.func.isRequired,
  onPageIndexChanged: PropTypes.func.isRequired,
  onPageSizeChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
ImagesGalleryPhotosComponent.defaultProps = {
  fromPage: ImagesGalleryFilterEnum.City.key,
};
