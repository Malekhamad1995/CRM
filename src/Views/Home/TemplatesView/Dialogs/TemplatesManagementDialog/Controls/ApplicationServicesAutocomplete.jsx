import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AutocompleteComponent } from '../../../../../../Components';
import { getErrorByName } from '../../../../../../Helper';
import { GetAllApplicationServices } from '../../../../../../Services';

export const ApplicationServicesAutocomplete = ({
  stateValue,
  selectedValue,
  idRef,
  labelValue,
  schema,
  isSubmitted,
  stateKey,
  selectedKey,
  onStateChanged,
  onSelectedChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [applicationServices, setApplicationServices] = useState([]);
  const [filter] = useState({
    pageIndex: -1,
    pageSize: 9999,
  });
  const getAllApplicationServices = useCallback(async () => {
    setIsLoading(true);
    const res = await GetAllApplicationServices(filter);
    if (!((res && res.data && res.data.ErrorId) || !res)) setApplicationServices(res.result || []);
    else setApplicationServices([]);
    setIsLoading(false);
  }, [filter]);
  const getEditInit = useCallback(() => {
    if (stateValue && !selectedValue && applicationServices.length > 0) {
      const applicationServiceIndex = applicationServices.findIndex(
        (item) => item.applicationServicesId === stateValue
      );
      if (applicationServiceIndex !== -1)
        onSelectedChanged({ id: selectedKey, value: applicationServices[applicationServiceIndex] });
      else onStateChanged({ id: stateKey, value: null });
    }
  }, [
    stateValue,
    selectedValue,
    applicationServices,
    onSelectedChanged,
    selectedKey,
    onStateChanged,
    stateKey,
  ]);
  useEffect(() => {
    if (stateValue) getEditInit();
  }, [stateValue, getEditInit]);
  useEffect(() => {
    getAllApplicationServices();
  }, [getAllApplicationServices]);
  return (
    <AutocompleteComponent
      idRef={idRef}
      labelValue={labelValue}
      selectedValues={selectedValue}
      data={applicationServices}
      displayLabel={(option) => option.applicationServicesName || ''}
      getOptionSelected={(option) => option.applicationServicesId === stateValue}
      withoutSearchButton
      helperText={getErrorByName(schema, stateKey).message}
      error={getErrorByName(schema, stateKey).error}
      isWithError
      multiple={false}
      isLoading={isLoading}
      isSubmitted={isSubmitted}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
      onChange={(event, newValue) => {
        onSelectedChanged({ id: selectedKey, value: newValue });
        onStateChanged({
          id: stateKey,
          value: (newValue && newValue.applicationServicesId) || null,
        });
      }}
    />
  );
};

ApplicationServicesAutocomplete.propTypes = {
  stateValue: PropTypes.string,
  selectedValue: PropTypes.instanceOf(Object),
  idRef: PropTypes.string.isRequired,
  labelValue: PropTypes.string.isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  stateKey: PropTypes.string.isRequired,
  selectedKey: PropTypes.string.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  onSelectedChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
ApplicationServicesAutocomplete.defaultProps = {
  stateValue: null,
  selectedValue: null,
};
