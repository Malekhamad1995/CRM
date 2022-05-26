import React, { useEffect } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { useTranslation } from 'react-i18next';
import { GetTemplateByPageId } from '../../../../../../Services/UsersDataViewingServices';

const TemplateValue = (props) => {
  const { t } = useTranslation('UserDataView');
  const [templateSelect, setTemplateSelect] = React.useState('');
  const [templateList, setTemplateList] = React.useState({});

  const GetMyTemp = async (pageId) => {
    const res = await GetTemplateByPageId(pageId);
    setTemplateList(res);
  };
  useEffect(() => {
    GetMyTemp(props.pageId);
  }, [props.pageId]);

  return (
    <FormControl
      fullWidth
      className={
        props.expanded === props.formsId ? 'showTemplate' : 'hideTemplate'
      }
    >
      <InputLabel>
        {t(
          'SetValuesFromTemplate'
        )}
      </InputLabel>
      <Select
        value={templateSelect}
        onClick={(e) => e.stopPropagation()}
        onFocus={(e) => e.stopPropagation()}
        onChange={(e) => setTemplateSelect(e.target.value)}
      >
        {templateList
          && Array.isArray(templateList)
          && templateList.map((el) => (
            <MenuItem
              key={el.pageViewTemplateId}
              value={el.pageViewTemplateId}
              onClick={() => props.handleSelectedTemplate(el.pageView)}
            >
              {el.pageViewTemplateName}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export { TemplateValue };
