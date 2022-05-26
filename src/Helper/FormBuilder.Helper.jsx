import React from 'react';
import { Button } from '@material-ui/core';
import { GlobalTranslate } from './Middleware.Helper';
// formSteps : the form steps & its data
// data: the filled fields data
// stepsDataKey: inputs & form fields array inside formSteps
// stepsKeyInput: the step unique key (currently description) name
// dataKeyInput: the data key input inside formSteps inside stepsDataKey

// withoutEmpty: to remove empty items of data
export const margeDataWithSteps = (
  formSteps,
  data,
  withoutEmpty = false,
  stepsDataKey = 'items',
  resultInput = 'value',
  stepsKeyInput = 'key',
  dataKeyInput = 'key'
) => {
  const dataLocal = { ...data };
  const maregedDataWithSteps = [];
  formSteps.map((item) => {
    item[stepsDataKey].map((subItem) => {
      const keyRefactor = subItem[dataKeyInput].replace(/-/g, '_');
      if (dataLocal[keyRefactor] !== undefined) {
        if ((withoutEmpty && dataLocal[keyRefactor] !== null) || !withoutEmpty) {
          if (maregedDataWithSteps[item[stepsKeyInput]]) {
            maregedDataWithSteps[item[stepsKeyInput]].push({
              ...subItem,
              [resultInput]: dataLocal[keyRefactor],
            });
          } else {
            maregedDataWithSteps[item[stepsKeyInput]] = [
              { ...subItem, [resultInput]: dataLocal[keyRefactor] },
            ];
          }
        }
        // delete [dataLocal][keyRefactor];
      }
      return undefined;
    });
    return undefined;
  });
  return maregedDataWithSteps;
};
const ConvertJsonToForm = (jsonToConvert) => {
  const uiKeys = Object.keys(jsonToConvert[0].data.uiSchema)
    .filter((item) => jsonToConvert[0].data.uiSchema[item])
    .map((item) => jsonToConvert[0].data.uiSchema[item]);
  const orderedSchemaKeys = [];
  let keyElement = '';
  for (let i = 0; i < uiKeys.length; i += 1) {
    if (jsonToConvert[0].data.uiSchema[jsonToConvert[0].data.uiSchema['ui:order'][i]]) {
      keyElement = `{"data":${JSON.stringify(
        jsonToConvert[0].data.schema.properties[jsonToConvert[0].data.uiSchema['ui:order'][i]]
      )}`;
      if (
        jsonToConvert[0].data.uiSchema[jsonToConvert[0].data.uiSchema['ui:order'][i]]['ui:widget']
      ) {
        keyElement = `${keyElement},"field":{"id":"${
          jsonToConvert[0].data.uiSchema['ui:order'][i]
        }","FieldType":"${
          jsonToConvert[0].data.uiSchema[jsonToConvert[0].data.uiSchema['ui:order'][i]]['ui:widget']
        }"`;
      } else
        keyElement = `${keyElement},"field":{"id":"${jsonToConvert[0].data.uiSchema['ui:order'][i]}","FieldType": "textField"`;

      if (
        jsonToConvert[0].data.schema.required.indexOf(
          jsonToConvert[0].data.uiSchema['ui:order'][i]
        ) === -1
      )
        keyElement += ', "Required": "false"}}';
      else keyElement += ', "Required": "true"}}';

      orderedSchemaKeys.push(JSON.parse(keyElement));
    }
  }
  return orderedSchemaKeys;
};
// formFieldsKeysValues: the fields array of data include uiSchema & schema
// iconKey: the saved icon key
// stepsKey: main step key input
// iconInput:icon value read from
export const stepsGenerator = (
  formFieldsKeysValues,
  keyInput = 'description',
  //   iconInput
  stepsInput = 'key',
  fieldTypeInput = 'FieldType',
  fieldTypekey = 'fieldType',
  fieldKey = 'key',
  itemKey = 'properties',
  stepsDataKey = 'items',
  iconKey = 'icon'
) => {
  const reordered = ConvertJsonToForm(formFieldsKeysValues);
  return Object.values(reordered).reduce((total, item) => {
    const keyIndex = total.findIndex((totalItem) => totalItem[stepsInput] === item.data[keyInput]);
    if (keyIndex === -1) {
      total.push({
        [stepsInput]: item.data[keyInput],
        [fieldTypekey]: item.field[fieldTypeInput],
        [stepsDataKey]: [
          {
            [fieldKey]: item.field.id,
            [itemKey]: item.data,
          },
        ],
        [iconKey]:
          (item.field[fieldTypeInput] === 'StepValidation' && `mdi mdi-${item.data.iconField}`) ||
          'mdi mdi-folder',
      });
    } else {
      total[keyIndex][stepsDataKey].push({
        [fieldKey]: item.field.id,
        [itemKey]: item.data,
      });
      if (
        item.field[fieldTypeInput] === 'StepValidation' &&
        total[keyIndex][iconKey] === 'mdi mdi-folder' &&
        item.data.iconField
      )
        total[keyIndex][iconKey] = `mdi mdi-${item.data.iconField}`;
    }
    return total;
  }, []);
};

export const cardDetailsItemHandler = (detailItem, othersActionValueClicked) => {
  if (
    detailItem.value === null ||
    (Array.isArray(detailItem.value) && detailItem.value.length === 0)
  )
    return undefined;
  if (detailItem.properties.specialKey === 'map') return undefined;

  const drow = [
    <span
      className={`item-icon ${
        (detailItem.properties.iconField && `mdi mdi-${detailItem.properties.iconField}`) ||
        'mdi mdi-help'
      }`}
    />,
    <span className='item-title'>
      {detailItem.properties.title.split('*')[0]}
      :
    </span>,
    <span className='item-value'>{null}</span>,
  ];
  switch (detailItem.properties.CommunicationType) {
    case 'Phone':
      drow[2] = (
        <span className='item-value'>
          {detailItem.value.phone}
          {detailItem.value.others && (
            <Button
              className='btns-icon theme-action bg-primary mx-2'
              onClick={othersActionValueClicked({
                data: { ...detailItem.properties, data: { id: detailItem.key, isReadonly: true } },
                others: detailItem.value,
                type: 'phone',
                title: 'phones',
                label: detailItem.properties.title.split('*')[0],
              })}
            >
              <span className='mdi mdi-eye-outline' />
            </Button>
          )}
        </span>
      );
      break;
    case 'Email':
      drow[2] = (
        <span className='item-value'>
          {detailItem.value.email}
          {detailItem.value.others && (
            <Button
              className='btns-icon theme-action bg-primary mx-2'
              onClick={othersActionValueClicked({
                data: { ...detailItem.properties, data: { id: detailItem.key, isReadonly: true } },
                others: detailItem.value,
                type: 'email',
                title: 'emails',
                label: detailItem.properties.title.split('*')[0],
              })}
            >
              <span className='mdi mdi-eye-outline' />
            </Button>
          )}
        </span>
      );
      break;
    case 'SocialMedia':
      drow[2] = <span className='item-value'>{detailItem.value.link}</span>;
      break;

    default:
      switch (detailItem.properties.multi) {
        case 'true':
          if (Array.isArray(detailItem.value)) {
            drow[2] = (
              <span className='item-value'>
                {detailItem.value.map((item, index) => (
                  <span key={`detailsSubitemRef${detailItem.key}${index + 1}`}>
                    {(item.lookupItemName && item.lookupItemName) || item}
                    {index < detailItem.value.length - 1 && <span>,</span>}
                    {' '}
                  </span>
                ))}
              </span>
            );
            // eslint-disable-next-line no-console
          } else console.log('not handeled 2', detailItem);
          break;

        default:
          if (typeof detailItem.value === 'object' && detailItem.value.lookupItemName)
            drow[2] = <span className='item-value'>{detailItem.value.lookupItemName}</span>;
          else if (typeof detailItem.value === 'object' && detailItem.value.name)
            drow[2] = <span className='item-value'>{detailItem.value.name}</span>;
          else if (detailItem.value.value)
            drow[2] = <span className='item-value'>{detailItem.value.value}</span>;
          else if (
            typeof detailItem.value === 'object' &&
            Object.entries(detailItem.value) &&
            Object.entries(detailItem.value).length > 0 &&
            typeof detailItem.value[0] !== 'object'
          ) {
            drow[2] = (
              <span className='item-value is-more-grid'>
                {Object.entries(detailItem.value).map((item) => (
                  <React.Fragment key={item[0]}>
                    <span className='inner-item-title'>
                      {item[0]}
                      :
                      {' '}
                    </span>
                    <span className='inner-item-value'>{item[1]}</span>
                  </React.Fragment>
                ))}
              </span>
            );
          } else if (
            typeof detailItem.value === 'string' ||
            typeof detailItem.value === 'boolean' ||
            typeof detailItem.value === 'number'
          )
            drow[2] = <span className='item-value'>{detailItem.value}</span>;
          // eslint-disable-next-line no-console
          else console.log('not handeled', detailItem);
          break;
      }
      break;
  }
  return (
    <div className='card-list-item'>
      {drow.map((item, index) => (
        <React.Fragment key={`detailItemFragmentRef${index + 1}`}>{item}</React.Fragment>
      ))}
    </div>
  );
};
export const getFormdata = (formName, itemsValue, itemArr, type) => {
  let contentData = '';
  const idFormat = `${formName}_type_id`;
  if (itemsValue !== []) {
    contentData = `${`${`${'{"data":{"'}${formName}":{"${itemArr[0].field.id.replace(
      '-',
      '_'
    )}":${JSON.stringify(itemsValue[0] ? itemsValue[0] : null)},`}"${idFormat}":`}${type || 1}`;
    for (let i = 1; i < itemArr.length; i += 1) {
      let controlId = itemArr[i].field.id;
      controlId = controlId.replace(/-/g, '_');
      if (itemsValue[i]) {
        contentData = `${contentData},${JSON.stringify(controlId)}:${JSON.stringify(
          itemsValue[i]
        )}`;
      } else contentData = `${contentData},${JSON.stringify(controlId)}:null`;
    }
    contentData += '}}}';
  }
  return JSON.parse(contentData);
};
export const getFormdataConvertJson1 = (formName, itemsValue , type) => {
  const idFormat = `${formName}_type_id`;
  const formData = { data : { [formName]:{...itemsValue , [idFormat] : +type} }};
  return formData ;  
};

// New Version Related Handlers (V2)
export const formItemsBuilder = (
  values,
  formTabsGroupsContent,
  formOrGroupContent,
  schemaInput = 'propertyJson',
  groupKey = 'group'
) => {
  const formAfterMarge = [];
  const itemPropertiesAndDataHandler = (item, tabIndex) => {
    const schemaConverted = JSON.parse(item[schemaInput]);
    const itemToPush = {
      field: {
        id: item.formFieldName,
        FieldType: item.uiWidgetType || schemaConverted.uiSchema['ui:widget'] || 'textField',
        isRequired: item.isRequired,
      },
      data: {
        ...schemaConverted.schema,
        valueToEdit: values && values[item.formFieldName],
        enum: schemaConverted.schema.enum || [],
        // formFieldTitle : item.
        title:
          (item.formFieldTitle &&
            !item.formFieldTitle.includes('*') &&
            item.isRequired &&
            `${item.formFieldTitle} *`) ||
          item.formFieldTitle,
      },
    };
    if (
      !itemToPush.data.lookup &&
      (itemToPush.field.FieldType === 'UploadFiles' ||
        itemToPush.field.FieldType === 'searchField' ||
        itemToPush.field.FieldType === 'select') &&
      itemToPush.data.valueToEdit &&
      itemToPush.data.enum.length === 0
    ) {
      if (Array.isArray(itemToPush.data.valueToEdit))
        itemToPush.data.enum = itemToPush.data.valueToEdit;
      else if (itemToPush.data.valueToEdit.selected)
        itemToPush.data.enum = itemToPush.data.valueToEdit.selected;
      else itemToPush.data.enum.push(itemToPush.data.valueToEdit);
    }
    if (tabIndex !== undefined) {
      if (!formAfterMarge[tabIndex]) formAfterMarge.push([]);
      if (tabIndex > formAfterMarge.length) formAfterMarge[tabIndex] = [];
      formAfterMarge[tabIndex].push(itemToPush);
    } else formAfterMarge.push(itemToPush);
  };
  if (formTabsGroupsContent) {
    formTabsGroupsContent.map((item, tabIndex) => {
      item[groupKey].map((element) => {
        itemPropertiesAndDataHandler(element, tabIndex);
        return undefined;
      });
    });
  } else {
    formOrGroupContent.map((item) => {
      itemPropertiesAndDataHandler(item);
    });
  }
  return formAfterMarge;
};

export const formItemsBuilderv3 = (
    values,
    fileds,
    schemaInput = 'propertyJson',
) => {
  const formAfterMarge = [];
  const itemPropertiesAndDataHandler = (item, tabIndex) => {
    const schemaConverted = JSON.parse(item[schemaInput]);
    const itemToPush = {
      field: {
        id: item.formFieldName,
        FieldType: item.uiWidgetType || schemaConverted.uiSchema['ui:widget'] || 'textField',
        isRequired: item.isRequired,
      },
      data: {
        ...schemaConverted.schema,
        valueToEdit: values && values[item.formFieldName],
        enum: schemaConverted.schema.enum || [],
        // formFieldTitle : item.
        title:
            (item.formFieldTitle &&
                !item.formFieldTitle.includes('*') &&
                item.isRequired &&
                `${item.formFieldTitle} *`) ||
            item.formFieldTitle,
      },
    };
    if (
        !itemToPush.data.lookup &&
        (itemToPush.field.FieldType === 'UploadFiles' ||
            itemToPush.field.FieldType === 'searchField' ||
            itemToPush.field.FieldType === 'select') &&
        itemToPush.data.valueToEdit &&
        itemToPush.data.enum.length === 0
    ) {
      if (Array.isArray(itemToPush.data.valueToEdit))
        itemToPush.data.enum = itemToPush.data.valueToEdit;
      else if (itemToPush.data.valueToEdit.selected)
        itemToPush.data.enum = itemToPush.data.valueToEdit.selected;
      else itemToPush.data.enum.push(itemToPush.data.valueToEdit);
    }
     formAfterMarge.push(itemToPush);
  };

  fileds.map((item) => {
      itemPropertiesAndDataHandler(item);
    });

  return formAfterMarge;
};

export const FormErrorsHandler = (allItems, allValues) => {
  const errors = [];
  allItems.map((tabItem) => {
    if (!tabItem) return;
    if (tabItem && tabItem.length) {
      tabItem.map((item) => {
        if ((!allValues[item.field.id] || allValues[item.field.id] === '') && item.field.isRequired) {
          errors.push({
            key: item.field.id,
            message: item.data.errorMsg || GlobalTranslate.t('Shared:please-fill-all-required-field'),
          });
        }
        if (item.data.regExp && item.data.regExp !== '' && allValues[item.field.id]) {
          const value =
              (item.data.CommunicationType === 'Email' && allValues[item.field.id].email) ||
              (item.data.CommunicationType === 'Phone' && allValues[item.field.id].phone) ||
              (item.field.FieldType === 'searchField' && allValues[item.field.id].name) ||
              (item.field.FieldType === 'UploadFiles' && allValues[item.field.id].selected) ||
              (item.data.uiType === 'text' && allValues[item.field.id].value) ||
              allValues[item.field.id] ||
              '';
          if (
              value !== '' &&
              value !== undefined &&
              value !== null &&
              typeof value !== 'object' &&
              typeof value === 'string' &&
              !Array.isArray(value) &&
              (item.data.CommunicationType === 'Email' ?
                  !value.toLowerCase().match(item.data.regExp) :
                  !value.match(item.data.regExp))
          ) {
            errors.push({
              key: item.field.id,
              message: item.data.errorMsg || GlobalTranslate.t('Shared:please-fix-all-errors'),
            });
          }
        }
        if (
            item.data.CommunicationType === 'Phone' &&
            allValues[item.field.id] &&
            allValues[item.field.id].others
        ) {
          const dublicatedNumbers = allValues[item.field.id].others.some(
              (element, index) =>
                  allValues[item.field.id].others.findIndex(
                      (phone, phoneIndex) => phone === element && index !== phoneIndex
                  ) !== -1 || element === allValues[item.field.id].phone
          );
          if (dublicatedNumbers) {
            errors.push({
              key: item.field.id,
              message: GlobalTranslate.t('Shared:some-numbers-are-duplicated'),
            });
          }
        }
        if (
            item.data.CommunicationType === 'Email' &&
            allValues[item.field.id] &&
            allValues[item.field.id].others
        ) {
          const dublicatedEmails = allValues[item.field.id].others.some(
              (element, index) =>
                  allValues[item.field.id].others.findIndex(
                      (email, emailIndex) => email === element && index !== emailIndex
                  ) !== -1 || element === allValues[item.field.id].email
          );
          if (dublicatedEmails) {
            errors.push({
              key: item.field.id,
              message: GlobalTranslate.t('Shared:some-emails-are-duplicated'),
            });
          }
        }
      });
    } else {
      const item = { ...tabItem };
      if ((!allValues[item.field.id] || allValues[item.field.id] === '') && item.field.isRequired) {
        errors.push({
          key: item.field.id,
          message: item.data.errorMsg || GlobalTranslate.t('Shared:please-fill-all-required-field'),
        });
      }
      if (item.data.regExp && item.data.regExp !== '' && allValues[item.field.id]) {
        const value =
            (item.data.CommunicationType === 'Email' && allValues[item.field.id].email) ||
            (item.data.CommunicationType === 'Phone' && allValues[item.field.id].phone) ||
            (item.field.FieldType === 'searchField' && allValues[item.field.id].name) ||
            (item.field.FieldType === 'UploadFiles' && allValues[item.field.id].selected) ||
            (item.data.uiType === 'text' && allValues[item.field.id].value) ||
            allValues[item.field.id] ||
            '';
        if (
            value !== '' &&
            value !== undefined &&
            value !== null &&
            typeof value !== 'object' &&
            typeof value === 'string' &&
            !Array.isArray(value) &&
            (item.data.CommunicationType === 'Email' ?
                !value.toLowerCase().match(item.data.regExp) :
                !value.match(item.data.regExp))
        ) {
          errors.push({
            key: item.field.id,
            message: item.data.errorMsg || GlobalTranslate.t('Shared:please-fix-all-errors'),
          });
        }
      }
      if (
          item.data.CommunicationType === 'Phone' &&
          allValues[item.field.id] &&
          allValues[item.field.id].others
      ) {
        const dublicatedNumbers = allValues[item.field.id].others.some(
            (element, index) =>
                allValues[item.field.id].others.findIndex(
                    (phone, phoneIndex) => phone === element && index !== phoneIndex
                ) !== -1 || element === allValues[item.field.id].phone
        );
        if (dublicatedNumbers) {
          errors.push({
            key: item.field.id,
            message: GlobalTranslate.t('Shared:some-numbers-are-duplicated'),
          });
        }
      }
      if (
          item.data.CommunicationType === 'Email' &&
          allValues[item.field.id] &&
          allValues[item.field.id].others
      ) {
        const dublicatedEmails = allValues[item.field.id].others.some(
            (element, index) =>
                allValues[item.field.id].others.findIndex(
                    (email, emailIndex) => email === element && index !== emailIndex
                ) !== -1 || element === allValues[item.field.id].email
        );
        if (dublicatedEmails) {
          errors.push({
            key: item.field.id,
            message: GlobalTranslate.t('Shared:some-emails-are-duplicated'),
          });
        }
      }
    }
  });
  return errors;
};
// export const
