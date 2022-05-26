import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { GetAllMarketingTemplates } from '../../../../../../../../../../Services';
import { AutocompleteComponent } from '../../../../../../../../../../Components';

export const OtherTemplatesAutocomplete = ({
  onSelectedChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [filter] = useState({
    pageIndex: 0,
    pageSize: 999999,
  });
  const getAllMarketingTemplates = useCallback(async () => {
    setIsLoading(true);
    const res = await GetAllMarketingTemplates({
      ...filter,
    });
    if (!(res && res.status && res.status !== 200))
      setTemplates((res && res.result && res.result.filter((item, index) => index >= 5)) || []);
    else setTemplates([]);
    setIsLoading(false);
  }, [filter]);
  useEffect(() => {
    getAllMarketingTemplates();
  }, [getAllMarketingTemplates]);
  return (
    <AutocompleteComponent
      idRef='otherTemplatesAutocompleteRef'
      inputPlaceholder='other-templates'
      defaultValue={null}
      multiple={false}
      data={templates}
      displayLabel={(option) => option.templateName || ''}
      withoutSearchButton
      isLoading={isLoading}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
      onChange={(event, newValue) => onSelectedChanged((newValue && newValue.templateText) || '')}
    />
  );
};

OtherTemplatesAutocomplete.propTypes = {
  onSelectedChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
