import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { PaginationComponent, Spinner } from '../../../../../Components';
import { bottomBoxComponentUpdate } from '../../../../../Helper';
import { ImagesGalleryFilterComponent } from '..';
import { ImagesGalleryFilterEnum } from '../../../../../Enums';
import { GetFilteredAlbumsImages } from '../../../../../Services';

export const GalleryCityAlbumsComponent = ({
  filter,
  filterBy,
  fromPage,
  onFilterByChanged,
  onPageIndexChanged,
  onPageSizeChanged,
  onActiveItemChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [cityAlbums, setCityAlbums] = useState({
    result: [],
    totalCount: 0,
  });
  const getlookupItemByType = (lookupItems, lookupType, key) =>
    (lookupItems.findIndex((item) => item.lookupType === lookupType) !== -1 &&
      lookupItems.find((item) => item.lookupType === lookupType)[key]) ||
    null;
  const getAllCityAlbums = useCallback(async () => {
    setIsLoading(true);
    const res = await GetFilteredAlbumsImages({
      ...filter,
      lookupItemId: filterBy && filterBy.cityId,
      typeId: ImagesGalleryFilterEnum.City.key,
    });
    if (!((res && res.data && res.data.ErrorId) || !res)) {
      setCityAlbums({
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
            }))) ||
          [],
        totalCount: res.totalCount || 0,
      });
    } else {
      setCityAlbums({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
  }, [filter, filterBy]);
  useEffect(() => {
    bottomBoxComponentUpdate(
      <PaginationComponent
        pageIndex={filter.pageIndex}
        pageSize={filter.pageSize}
        totalCount={cityAlbums.totalCount}
        onPageIndexChanged={onPageIndexChanged}
        onPageSizeChanged={onPageSizeChanged}
      />
    );
  });
  useEffect(() => {
    getAllCityAlbums();
  }, [filter, getAllCityAlbums, filterBy]);
  return (
    <div className='images-gallery-albums-wrapper childs-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <ImagesGalleryFilterComponent
        filterBy={filterBy}
        fromPage={fromPage}
        onFilterByChanged={onFilterByChanged}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
      <ImagesGalleryAlbumsCardComponent
        data={cityAlbums.result || []}
        fromPage={fromPage}
        onActiveItemChanged={onActiveItemChanged}
        onPageIndexChanged={onPageIndexChanged}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
    </div>
  );
};

GalleryCityAlbumsComponent.propTypes = {
  fromPage: PropTypes.oneOf(Object.values(ImagesGalleryFilterEnum).map((item) => item.key)),
  filter: PropTypes.instanceOf(Object).isRequired,
  filterBy: PropTypes.instanceOf(Object).isRequired,
  onFilterByChanged: PropTypes.func.isRequired,
  onPageIndexChanged: PropTypes.func.isRequired,
  onPageSizeChanged: PropTypes.func.isRequired,
  onActiveItemChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
