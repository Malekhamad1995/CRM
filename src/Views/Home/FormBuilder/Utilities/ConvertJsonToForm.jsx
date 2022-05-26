import _ from 'lodash';

function ConvertJsonToForm(jsonToConvert, setSteps, setItemArr, dataToView, setData) {
  // eslint-disable-next-line
  const uiKeys = Object.keys(jsonToConvert[0].data.uiSchema)
    .filter((item, index, ref) => jsonToConvert[0].data.uiSchema[item])
    .map((item) => jsonToConvert[0].data.uiSchema[item]);
  const orderedSchemaKeys = [];
  let keyElement = '';
  for (let i = 0; i < uiKeys.length; i++) {
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
  let groupKeys = [];
  groupKeys = _.groupBy(orderedSchemaKeys, (item) => item.data.description);
  setSteps(Object.keys(groupKeys).map((key) => key));

  function json2array(json) {
    const result = [];
    const k = Object.keys(json);
    k.forEach((i) => {
      result.push(json[i]);
    });
    return result;
  }
  groupKeys = json2array(groupKeys);
  setItemArr(orderedSchemaKeys);

  orderedSchemaKeys.map((item, index) => {
    for (const key in dataToView) {
      if (
        dataToView.hasOwnProperty(key)
        && item.field.id.replace('-', '_').replace('-', '_').toUpperCase() === key.toUpperCase()
      ) {
        setData(index, dataToView[key]);
        break;
      }
    }
    return item;
  });

  return groupKeys;
  // eslint-disable-next-line react-hooks/exhaustive-deps
}

const getFormData = (formName, idFormat, itemsValue, itemArr, type) => {
  let contentData = '';
  if (itemsValue !== []) {
    contentData = `${`${`${'{"data":{"'}${formName}":{"${itemArr[0].field.id.replace('-', '_')}":"${
      itemsValue[0]
    }",`}"${idFormat}":`}"${type}"`;
    for (let i = 1; i < itemArr.length; i++) {
      let controlId = itemArr[i].field.id;
      controlId = controlId.replace(/-/g, '_');
      if (itemsValue[i]) {
        contentData = `${contentData},${JSON.stringify(controlId)}:${JSON.stringify(
          itemsValue[i]
        )}`;
      } else
        contentData = `${contentData},${JSON.stringify(controlId)}:null`;
    }
    contentData += '}}}';
  }
  return contentData;
};

function ConvertJsonToFormV2(itemList){

   const list = [];
   itemList.map((item)=>{
     const temp = {
       field:{
         id:item.formFieldKey,
         FieldType: item.uiWidgetType,
         isRequired: item.isRequired
       },
       data:{}
     };
     const proerties = JSON.parse(item.propertyJson);
    for(const key in proerties.schema)
      temp.data[key] = proerties.schema[key];

    if(temp.data.DtoName)temp.field.id =temp.data.DtoName;

    list.push(temp);
   });

   return list;
}


export { ConvertJsonToForm, getFormData ,ConvertJsonToFormV2};
