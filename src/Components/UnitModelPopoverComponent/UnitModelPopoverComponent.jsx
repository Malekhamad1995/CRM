import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ButtonBase } from '@material-ui/core';
import { Item } from 'react-bootstrap/lib/Breadcrumb';
import { GetAllUnitModelAndFilesByPropertyId } from '../../Services';
import { CollapseComponent } from '../Controls';
import { AutocompleteComponent } from '..';
import { AddModelsUnitsDialog } from '../../Views/Home/FormBuilder/Dialogs/AddModelsUnitsDialog';

export const UnitModelPopoverComponent = ({
  unitModelPopoverAttachedWith,
  onPopoverClose,
  allItems,
  propertyId,
  onValueChanged,
  setData,
  indexV1,
  labelValue,
  idRef,
  allItemsValues,
  itemValue,
  propertyName, 
}) => {


  const [unitModels, setUnitModels] = useState({
    result: [],
    totalCount: 0,
  });
  const [filter] = useState({
    pageIndex: 0,
    pageSize: 9999,
  });
  const [modelValue, setModelValue] = useState(null);
  const [modelsUnitsDialog, setModelsUnitsDialog] = useState(false);

  const getAllUnitModelAndFilesByPropertyId = useCallback(async () => {
    const res = await GetAllUnitModelAndFilesByPropertyId({
      propertyId
    });
    // eslint-disable-next-line prefer-const
    let list = [];
    if (!((res && res.data && res.data.ErrorId) || !res)) {
      Object.keys(res).forEach((key) => {
        if (typeof res[key] === 'object' && key !== 'Models') {
          if (res[key])
          list.push({ ...res[key], propertyUnitModelName: key });
        }
      });

      setUnitModels({
        result: list || [],
      });
    }
  }, [propertyId]);

  useEffect(() => {
    if (unitModels.result.length > 0) {
      const unitModelIndex = allItems.findIndex(
        (element) => element.field.id === 'unit_model'
      );
      const unitModel = onValueChanged ? (allItemsValues && allItemsValues.unit_model) : allItemsValues['unit_model'];
      const findObjext = unitModels.result.find((item) => item.propertyUnitModelName === unitModel);
      if (findObjext)
        setModelValue(findObjext);
      else
        setModelValue(null);
    }
  }, [allItems, allItemsValues, onValueChanged, unitModels.result]);

  const updateOtherValuesRelateWithUnitModel = (value) => {
    if (value) {
      if (onValueChanged) {
        const unitModelIndex = allItems.findIndex(
          (element) => element.field.id === 'unit_model'
        );
        if (unitModelIndex !== -1) onValueChanged(value.propertyUnitModelName, unitModelIndex);

        if (value.area) {
          const areaIndex = allItems.findIndex(
            (element) => element.field.id === 'builtup_area_sqft'
          );
          if (areaIndex !== -1) onValueChanged(value.area, areaIndex);
        }
        if (value.bedroom) {
          const bedroomsIndex = allItems.findIndex((element) => element.field.id === 'bedrooms');
          if (bedroomsIndex !== -1) onValueChanged(`${value.bedroom}`, bedroomsIndex);
        }
        if (value.bathroom) {
          const bathroomsIndex = allItems.findIndex((element) => element.field.id === 'bathrooms');
          if (bathroomsIndex !== -1) onValueChanged(`${value.bathroom}`, bathroomsIndex);
        }

        if (
          value.units_no
        )
          onValueChanged(value.units_no, undefined, 'unit_number');
        if (value.primary_view)
          onValueChanged(value.primary_view, undefined, 'primary_view');

        if (value.secondary_view)
          onValueChanged(value.secondary_view, undefined, 'secondary_view');
      }
      if (setData) {
        setData(indexV1, value.propertyUnitModelName);
        if (value.area) {
          const areaIndex = allItems.findIndex(
            (element) => element.field.id === 'builtup_area-sqft'
          );
          if (areaIndex !== -1) {
            setData(allItems[areaIndex].field.id, value.area);
            setData('builtup_area_sqft', value.area);
          }
        }
        if (value.bedroom) {
          const bedroomsIndex = allItems.findIndex((element) => element.field.id === 'bedrooms');
          if (bedroomsIndex !== -1) setData(allItems[bedroomsIndex].field.id, `${value.bedroom}`);
        }
        if (value.bathroom) {
          const bathroomsIndex = allItems.findIndex((element) => element.field.id === 'bathrooms');
          if (bathroomsIndex !== -1) setData(allItems[bathroomsIndex].field.id, `${value.bathroom}`);
        }

        const unitNumberIndex = allItems.findIndex((element) => element.field.id === 'unit_number');
        if (
          value.units_no
        )
          setData(allItems[unitNumberIndex].field.id, value.units_no);

        if (value.primary_view) {
          const primaryViewIndex = allItems.findIndex(
            (element) => element.field.id === 'primary_view'
          );
          if (primaryViewIndex !== -1)
            setData(allItems[primaryViewIndex].field.id, value.primary_view);
        }
        if (value.secondary_view) {
          const secondaryViewIndex = allItems.findIndex(
            (element) => element.field.id === 'secondary_view'
          );
          if (secondaryViewIndex !== -1)
            setData(allItems[secondaryViewIndex].field.id, value.secondary_view);
        }
      }
    }

    if (onPopoverClose) setTimeout(() => onPopoverClose(), 100);
  };
  const selectUnitModelHandler = useCallback(
    (mapItem) => () => {
      if (onValueChanged) {
        onValueChanged(mapItem);
        const areaIndex = allItems.findIndex(
          (element) => element.field.id === 'total_area_size_sqft'
        );
        onValueChanged(mapItem.unitModelUnits[0].unitNumber, undefined, 'unit_number');
        onValueChanged({ ...allItemsValues, primary_view: mapItem.area });
        if (areaIndex !== -1) onValueChanged(mapItem.area, areaIndex);
        const bedroomsIndex = allItems.findIndex((element) => element.field.id === 'bedrooms');
        if (bedroomsIndex !== -1) onValueChanged(`${mapItem.bedroomNo}`, bedroomsIndex);
        const bathroomsIndex = allItems.findIndex((element) => element.field.id === 'bathrooms');
        if (bathroomsIndex !== -1) onValueChanged(`${mapItem.bathroomNo}`, bathroomsIndex);
        if (
          mapItem.unitModelUnits &&
          mapItem.unitModelUnits[0] &&
          mapItem.unitModelUnits[0].unitNumber
        )
          onValueChanged(mapItem.unitModelUnits[0].unitNumber, undefined, 'unit_number');
      }
      if (setData) {
        setData(indexV1, mapItem.propertyUnitModelName);
        const areaIndex = allItems.findIndex(
          (element) => element.field.id === 'total_area-size-sqft'
        );
        if (areaIndex !== -1) setData(areaIndex, mapItem.area);
        const bedroomsIndex = allItems.findIndex((element) => element.field.id === 'bedrooms');
        if (bedroomsIndex !== -1) setData(bedroomsIndex, `${mapItem.bedroomNo}`);
        const bathroomsIndex = allItems.findIndex((element) => element.field.id === 'bathrooms');
        if (bathroomsIndex !== -1) setData(bathroomsIndex, `${mapItem.bathroomNo}`);
        const unitNumberIndex = allItems.findIndex((element) => element.field.id === 'unit_number');
        if (
          unitNumberIndex !== -1 &&
          mapItem.unitModelUnits &&
          mapItem.unitModelUnits[0] &&
          mapItem.unitModelUnits[0].unitNumber
        )
          setData(unitNumberIndex, mapItem.unitModelUnits[0].unitNumber);
      }

      if (onPopoverClose) setTimeout(() => onPopoverClose(), 100);
    },
    [allItems, indexV1, onPopoverClose, onValueChanged, setData]
  );

  useEffect(() => {
    if (propertyId) getAllUnitModelAndFilesByPropertyId();
  }, [propertyId, getAllUnitModelAndFilesByPropertyId]);
  return (
    <div>
      <AutocompleteComponent
        idRef={idRef}
        className='px-2'
        selectedValues={
          modelValue
        }
        labelValue={labelValue}
        data={unitModels.result || []}
        multiple={false}
        displayLabel={(option) =>
          (option && option.propertyUnitModelName) || ''}
        chipsLabel={(option) => (option && option.propertyUnitModelName) || ''}
        withoutSearchButton
        buttonOptions={{
          className: 'btns-icon theme-solid bg-blue-lighter',
          iconClasses: 'mdi mdi-plus',
          isRequired: false,
          onActionClicked: () => {
            setModelsUnitsDialog(true);
          },
        }}
        onChange={(event, newValue) => {
          if (newValue)
            updateOtherValuesRelateWithUnitModel(newValue);
          else {
            if (onValueChanged) {
              onValueChanged(null, undefined, 'unit_model');
              onValueChanged(null, undefined, 'bedrooms');
              onValueChanged(null, undefined, 'bathrooms');
              onValueChanged(null, undefined, 'primary_view');
              onValueChanged(null, undefined, 'secondary_view');
              onValueChanged(null, undefined, 'builtup_area_sqft');
            }
            if (setData) {
              setData(indexV1, null);
              const areaIndex = allItems.findIndex(
                (element) => element.field.id === 'builtup_area_sqft'
              );
              if (areaIndex !== -1) setData(areaIndex, null);

              const bedroomsIndex = allItems.findIndex((element) => element.field.id === 'bedrooms');
              if (bedroomsIndex !== -1) setData(bedroomsIndex, null);
              const bathroomsIndex = allItems.findIndex((element) => element.field.id === 'bathrooms');
              if (bathroomsIndex !== -1) setData(bathroomsIndex, null);
              const unitNumberIndex = allItems.findIndex((element) => element.field.id === 'unit_number');
              setData(unitNumberIndex, null);
              const primaryViewIndex = allItems.findIndex(
                (element) => element.field.id === 'primary_view'
              );
              if (primaryViewIndex !== -1)
                setData(primaryViewIndex, null);
              const secondaryViewIndex = allItems.findIndex(
                (element) => element.field.id === 'secondary_view'
              );
              if (secondaryViewIndex !== -1)
                setData(secondaryViewIndex, null);
            }
          }
        }}

      />
      {modelsUnitsDialog && (
        <AddModelsUnitsDialog
          open={modelsUnitsDialog}
          propertyId={propertyId}
          propertyName={propertyName}
          close={() => {
            setModelsUnitsDialog(false);
            getAllUnitModelAndFilesByPropertyId();

          }}
        />
      )}

    </div>
    // (unitModels.totalCount > 0 && (
    // <CollapseComponent
    //   handleClose={onPopoverClose}
    //   isOpen={unitModelPopoverAttachedWith !== null}
    //   classes='popover-unit-model'
    //   top={50}
    //   component={(
    //     <div className='unit-model-items-wrapper'>
    //       {unitModels.result.map((mapItem, index) => (
    //         <ButtonBase
    //           key={`unitModelsRef${index + 1}`}
    //           className='btns theme-transparent unit-model-item'
    //           onClick={selectUnitModelHandler(mapItem)}
    //         >
    //           <span>{mapItem.propertyUnitModelName}</span>
    //         </ButtonBase>
    //       ))}
    //     </div>
    //   )}
    // />

    // )) ||
    // null
  );
};
const convertJsonItemShape = PropTypes.shape({
  data: PropTypes.shape({
    enum: PropTypes.instanceOf(Array),
    CommunicationType: PropTypes.string,
    searchKey: PropTypes.string,
    title: PropTypes.string,
    regExp: PropTypes.string,
    dependOn: PropTypes.string,
    uiType: PropTypes.string,
    defaultCountryCode: PropTypes.string,
    minNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isReadonly: PropTypes.bool,
    maxDate: PropTypes.string,
    minDate: PropTypes.string,
    lookup: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    controlType: PropTypes.string, // this type is not sure is string
    multi: PropTypes.oneOf(['true', 'false']),
    lookupItem: PropTypes.number,
    items: PropTypes.shape({
      enum: PropTypes.instanceOf(Array),
    }),
  }),
  field: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    FieldType: PropTypes.string,
    isRequired: PropTypes.bool,
  }),
});
UnitModelPopoverComponent.propTypes = {
  unitModelPopoverAttachedWith: PropTypes.instanceOf(Object),
  onPopoverClose: PropTypes.func.isRequired,
  allItems: PropTypes.arrayOf(convertJsonItemShape).isRequired,
  propertyId: PropTypes.number.isRequired,
  onValueChanged: PropTypes.func,
  setData: PropTypes.func,
  indexV1: PropTypes.number,
};
UnitModelPopoverComponent.defaultProps = {
  unitModelPopoverAttachedWith: undefined,
  onValueChanged: undefined,
  setData: undefined,
  indexV1: undefined,
};
