import React, { useEffect, useState, useCallback } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import _ from 'lodash';
import { Grid, Button } from '@material-ui/core';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import { PropTypes } from 'prop-types';

import { useTranslation } from 'react-i18next';
import ConvertJson from '../../../../Views/Home/FormBuilder/Utilities/FormRender/ConvertJson';
import {
  changeLoading,
  GlobalHistory,
  showSuccess,
  showError,
  getFormdata,
  getFormdataConvertJson1 , 
} from '../../../../Helper';
import {
  CONTACTS, PROPERTIES, UNITS, LEADS
} from '../../../../config/pagesName';
import {
  formByIdGet,
  leadDetailsGet,
  leadPost,
  leadDetailsPut,
  contactsDetailsGet,
  contactsPost,
  contactsDetailsPut,
  unitDetailsGet,
  unitPost,
  unitDetailsPut,
  propertyDetailsGet,
  propertyPost,
  propertyDetailsPut,
} from '../../../../Services';

import Alert from '../Alert';
import { StepperComponent, ProgressComponet } from '../../../Controls';
import './DfmAddEditAndDeleteStepper.scss';
import { Spinner } from '../../../SpinnerComponent/Spinner';

const translationPath = 'View.';
const GenricStpeper = ({
  pageName,
  id,
  type,
  isDialog,
  closeDialog,
  showType,
  withTotal,
  withoutStepper,
  activeTab,
  onValuesChanged,
  onItemArrayChanged,
  withoutButtons,
}) => {
  const { t } = useTranslation(['DataFiles', 'OpenFileView', 'Shared']);
  const [totalProgress, setTotalProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [jsonForm, setJsonForm] = useState(null);
  const [itemArr, setItemArr] = useState(0);
  const [rowVersion, setRowVersion] = useState('');
  const [itemsValue, setItemsValue] = useState({});
  const [itemsError, setItemsError] = useState({});
  const [duplicateMsg, setDuplicateMsg] = useState('');
  const [duplicateMsgDialogOpen, setDuplicateMsgDialogOpen] = useState(false);
  const [steps, setSteps] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [diabledState, setDiabledState] = useState(false);
  const [isNextDisabled, setIsNextDisabled] = useState(false);



  const isLoading = useCallback(() => {
    if (loading) {
      setErrorMessage(null);
      if (!isDialog) changeLoading(true);
    } else if (!isDialog) changeLoading(false);
  }, [isDialog, loading]);
  const setData = useCallback(
    (i, newValue) => {
      if (i === undefined || newValue === undefined) return;
      if (i === -1 || i === '') return;
      itemsValue[`${i}`] = newValue ;
      setItemsValue({ ...itemsValue });
      if(newValue === null ){
        if(itemArr !== 0 &&  itemArr.length > 0 ){
          const indexOfItem = itemArr.indexOf(itemArr.find((f) => f.field.id.replace('-', '_').replace('-', '_').replace('-', '_') === i));
          if(indexOfItem !== -1)
          itemArr[indexOfItem].data.valueToEdit = null ; 
        }

      }
    
    },
    [itemsValue]
  );
  const setError = (i, newError) => {
    itemsError[`${i}`] = newError;
    setItemsError({ ...itemsError });
  };


  function ConvertJsonToForm(jsonToConvert) {
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
          keyElement = `${keyElement},"field":{"id":"${jsonToConvert[0].data.uiSchema['ui:order'][i]
            }","FieldType":"${jsonToConvert[0].data.uiSchema[jsonToConvert[0].data.uiSchema['ui:order'][i]][
            'ui:widget'
            ]
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
    setSteps(Object.keys(groupKeys).map((key) => ({ key, progressValue: 0 })));

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
    return groupKeys;
  }
  useEffect(() => {
    if (onItemArrayChanged) onItemArrayChanged(itemArr);
  }, [itemArr, onItemArrayChanged]);
  const fillFormWithData = useCallback((response, data, formResponse) => {
    if (response && (Array.isArray(response) || typeof response === 'object')) {
      const dataToEdit = data;
      const newDataWithEdit = ConvertJsonToForm(JSON.parse(formResponse[0].form_content)).map(
        (step) =>
          step.map((item) => {
            Object.keys(dataToEdit).map((key) => {
              if (
                // eslint-disable-next-line no-prototype-builtins
                dataToEdit.hasOwnProperty(key) &&
                item.field.id.replace('-', '_').replace('-', '_').replace('-', '_').toUpperCase() ===
                key.toUpperCase()
              )
              { 
                item.data.valueToEdit = dataToEdit[key];
              }

              return undefined;
            });
            return item;
          })
      );
      setTotalProgress((data && data.data_completed) || 0);
      setJsonForm(newDataWithEdit);
    }
    setLoading(false);
  }, []);
  const fillEmptyForm = useCallback(
    async (response) => {
      // try {
      if (response && Array.isArray(response) && !response.error) {
        if (id) {
          let detailsResults;

          switch (pageName) {
            case CONTACTS:
              detailsResults = await contactsDetailsGet({ id });
              if (!detailsResults || (detailsResults.status && detailsResults.status !== 200))
                return;
              fillFormWithData(detailsResults, detailsResults.contact, response);
              break;

            case LEADS:
              detailsResults = await leadDetailsGet({ id });
              if (!detailsResults || (detailsResults.status && detailsResults.status !== 200))
                return;
              fillFormWithData(detailsResults, detailsResults.lead, response);
              break;

            case PROPERTIES:
              detailsResults = await propertyDetailsGet({ id });
              if (!detailsResults || (detailsResults.status && detailsResults.status !== 200))
                return;
              fillFormWithData(detailsResults, detailsResults.property, response);
              break;

            case UNITS:
              detailsResults = await unitDetailsGet({ id });
              if (!detailsResults || (detailsResults.status && detailsResults.status !== 200))
                return;
              fillFormWithData(detailsResults, detailsResults.unit, response);
              setRowVersion(detailsResults.rowVersion);
              break;
            default:
          }
        } else {
          setLoading(false);
          setJsonForm(ConvertJsonToForm(JSON.parse(response[0].form_content)));
        }
      }
      // } catch (err) {
      //   throw err;
      //   // setErrorMessage(err);
      // }
    },
    [fillFormWithData, id, pageName]
  );
  const fetchEmptyForm = useCallback(
    async (formToGet) => {
      setLoading(true);

      const response = await formByIdGet({ formname: formToGet });
      if (!(response && response.status && response.status !== 200)) fillEmptyForm(response);
      else setErrorMessage(`${(response && response.statusText) || 'Failed'}`);
    },
    [fillEmptyForm]
  );
  const putFormResponse = (response) => {
    if (response) {
      if (!response.error) {
        if (isDialog) closeDialog();
        else GlobalHistory.goBack();
        // GlobalHistory.push(`/home/${pageName}/view`);
      }
    }
  };
  const postFormResponse = (response) => {
    if (response) {
      if (isDialog) closeDialog(response);
      else GlobalHistory.goBack();
      // GlobalHistory.push(`/home/${pageName}/view`);
    }
  };
  const getRealIndex = useCallback(
    (itemName) => {
      // old store keys by indexs 
      // const result = itemArr.indexOf(itemName);
      // return result ; 
      return itemName.field.id.replace('-', '_').replace('-', '_').replace('-', '_');
     
    },
    [itemArr]
  );
  const addData = async () => {
    let jsonContentData;
    let postResponse;
    switch (pageName) {
      case CONTACTS:
       // jsonContentData = getFormdata('contact', itemsValue, itemArr, type);
        jsonContentData  = getFormdataConvertJson1('contact', itemsValue , type);
        jsonContentData.data.contact.data_completed = totalProgress;
        postResponse = await contactsPost({ contactJson: jsonContentData.data });
        if (!(postResponse && postResponse.status && postResponse.status !== 200))
          showSuccess(t('Contacts.NotificationAddCONTACTS'));
        else showError(t('Contacts.NotificationAddErrorCONTACTS'));
        break;
      case PROPERTIES:
       // jsonContentData = getFormdata('property', itemsValue, itemArr, type);
        jsonContentData  = getFormdataConvertJson1('property', itemsValue , type);
        jsonContentData.data.property.data_completed = totalProgress;
        postResponse = await propertyPost({ propertyJson: jsonContentData.data });
        if (!(postResponse && postResponse.status && postResponse.status !== 200))
          showSuccess(t('Property.NotificationEditLeadsAddProperty'));
        else showError(t('Property.NotificationEditLeadsAddErrorProperty'));
        break;
      case UNITS:
      // jsonContentData = getFormdata('unit', itemsValue, itemArr, type);
       jsonContentData  = getFormdataConvertJson1('unit', itemsValue , type);
        jsonContentData.data.unit.data_completed = totalProgress;
        postResponse = await unitPost({ unitJson: jsonContentData.data });
        if (!(postResponse && postResponse.status && postResponse.status !== 200))
          showSuccess(t('Units.NotificationAddUnits'));
        else showError(t('Units.NotificationAddErrorUnits'));
        break;
      case LEADS:
        //jsonContentData = getFormdata('lead', itemsValue, itemArr, type);
        jsonContentData  = getFormdataConvertJson1('lead', itemsValue , type);
        jsonContentData.data.lead.data_completed = totalProgress;
        postResponse = await leadPost({ leadJson: jsonContentData.data });
        if (!(postResponse && postResponse.status && postResponse.status !== 200))
          showSuccess(t('Leads.NotificationAddLeads'));
        else showError(t('Leads.NotificationAddErrorLeads'));
        break;
      default:
        break;
    }
    if (postResponse) postFormResponse(postResponse);
    else setLoading(false);
  };
  const editData = async () => {
    let jsonContentData;
    let putResponse;
    try {
      switch (pageName) {
        case CONTACTS:
          //jsonContentData = getFormdata('contact', itemsValue, itemArr, type);
          jsonContentData  = getFormdataConvertJson1('contact', itemsValue , type);
          jsonContentData.data.contact.data_completed = totalProgress;
          putResponse = await contactsDetailsPut({
            id,
            body: { contactJson: jsonContentData.data },
          });
          if (!(putResponse && putResponse.status && putResponse.status !== 200))
            showSuccess(t('OpenFileView:openFileContactsComponent.NotificationEditContacts'));
          else showError(t('OpenFileView:openFileContactsComponent.NotificationEditErrorContacts'));
          break;
        case PROPERTIES:
         //jsonContentData = getFormdata('property', itemsValue, itemArr, type);
          jsonContentData  = getFormdataConvertJson1('property', itemsValue , type);
          jsonContentData.data.property.data_completed = totalProgress;
          putResponse = await propertyDetailsPut({
            id,
            body: { propertyJson: jsonContentData.data },
          });
          if (!(putResponse && putResponse.status && putResponse.status !== 200))
            showSuccess(t('OpenFileView:openFilePropertiesComponent.NotificationEditProperty'));
          else
            showError(t('OpenFileView:openFilePropertiesComponent.NotificationEditErrorProperty'));
          break;
        case UNITS:
          {
           // const x = getFormdata('unit', itemsValue, itemArr, type);
           //  jsonContentData = x;
            jsonContentData  = getFormdataConvertJson1('unit', itemsValue , type);
            jsonContentData.data.unit.data_completed = totalProgress;
            putResponse = await unitDetailsPut({
              id,
              body: { unitJson: jsonContentData.data, rowVersion },
            });
            if (!(putResponse && putResponse.status && putResponse.status !== 200))
              showSuccess(t('OpenFileView:openFileUnitsComponent.NotificationEditUnits'));
            else showError(t('OpenFileView:openFileUnitsComponent.NotificationEditErrorUnits'));
          }
          break;
        case LEADS:
          // jsonContentData = getFormdata('lead', itemsValue, itemArr, type);
           jsonContentData =   getFormdataConvertJson1('lead', itemsValue , type);
          jsonContentData.data.lead.data_completed = totalProgress;
          putResponse = await leadDetailsPut({ id, body: { leadJson: jsonContentData.data } });
          if (!(putResponse && putResponse.status && putResponse.status !== 200))
            showSuccess(t('OpenFileView:openFileLeadsComponent.NotificationEditLeads'));
          else showError(t('OpenFileView:openFileLeadsComponent.NotificationEditErrorLeads'));
          break;
        default:
          break;
      }
      if (putResponse) putFormResponse(putResponse);
      else setLoading(false);
    } catch (err) {
      setErrorMessage(`${err}`);
      showError(t('NotificationErrorMessage_EDIT'));
    }
  };
  const disableNextButton = () => {
    let state = diabledState;
    if (jsonForm) {
      try {
        jsonForm[activeTab || activeStep].forEach((item) => {
          if (
            (itemsError[`${getRealIndex(item)}`] && itemsError[`${getRealIndex(item)}`] !== '') ||
            (item &&
              item.field &&
              item.field.Required.toUpperCase() === 'TRUE' &&
              (!itemsValue[getRealIndex(item)] ||
                itemsValue[`${getRealIndex(item)}`] === '' ||
                itemsValue[getRealIndex(item)] === '' ||
                itemsValue[`${getRealIndex(item)}`].length === 0 ||
                (itemsValue[`${getRealIndex(item)}`].phone &&
                  !itemsValue[`${getRealIndex(item)}`].id && itemsValue[`${getRealIndex(item)}`].phone.length < 9)))
          ) {
            state = !diabledState;
            throw state;
          }
        });
        // eslint-disable-next-line no-empty
      } catch (err) { }
    } else if (loading) state = !diabledState;
    else state = !diabledState;

    return state;
  };
  useEffect(() => {
    if (duplicateMsg && duplicateMsg !== '') setDuplicateMsgDialogOpen(true);
  }, [duplicateMsg]);
  useEffect(() => {
    isLoading();
  }, [loading, isLoading]);
  useEffect(() => {
    if (showType && jsonForm) {
      jsonForm[activeTab || activeStep].forEach((item) => {
        if (item && item.data && item.data.valueToEdit)
          setData(getRealIndex(item), item.data.valueToEdit);
      });
    }
  }, [showType, jsonForm, activeTab, activeStep, getRealIndex, setData]);
  useEffect(() => {
    let name = '';
    switch (pageName) {
      case CONTACTS:
        name = type.toString() === '1' ? 'contacts' : 'company';
        break;
      case PROPERTIES:
        name = 'property';
        break;
      case UNITS:
        name = 'Unit';
        break;
      case LEADS:
        name = type.toString() === '1' ? 'Owner Lead' : 'Seeker Lead';
        break;
      default:
        break;
    }
    fetchEmptyForm(name);
  }, [pageName, id, type, fetchEmptyForm]);

  useEffect(
    () => () => {
      localStorage.removeItem('unit_form');
      localStorage.removeItem('unit_step');
    },
    []
  );
  const changeProgress = () => {
    if (!jsonForm) return;
    const cuurent = jsonForm[activeTab || activeStep].length;
    const complete = jsonForm[activeTab || activeStep].reduce((total, elements) => {
      // eslint-disable-next-line no-param-reassign
      if (itemsValue[getRealIndex(elements)]) total += 1;
      return total;
    }, 0);
    steps[activeTab || activeStep].progressValue = Math.round((complete / cuurent) * 100);
    setSteps([...steps]);

    const total = steps.length * 100;
    const sum = steps.reduce((sumL, element) => {
      // eslint-disable-next-line no-param-reassign
      sumL += element.progressValue;
      return sumL;
    }, 0);
    setTotalProgress(Math.round((sum / total) * 100));
  };
  useEffect(() => {
    if (onValuesChanged) onValuesChanged(itemsValue);
  }, [itemsValue, onValuesChanged]);
  return (
    <>
      <Grid container className='form-builder-wrapper'>
        <Spinner isActive={loading} />
        {withTotal && (
          <div className='d-flex-v-center-h-end mb-3'>
            <div className='w-100 px-2 mxw-435px'>
              <ProgressComponet
                value={totalProgress}
                progressText={`${t(`${translationPath}total`)} ${totalProgress}%`}
                textClasses='text-nowrap'
                themeClasses='theme-gradient'
                inSameLine
                isTextColored
              />
            </div>
          </div>
        )}
        <Grid item xs={12}>
          {errorMessage && <Alert msg={errorMessage} />}
        </Grid>
        {!withoutStepper && (
          <Grid item xs={12}>
            {steps && (
              <StepperComponent
                steps={steps}
                activeStep={activeStep}
                progressValueInput='progressValue'
                labelInput='key'
              />
            )}
          </Grid>
        )}
        <Grid
          container
          justify='center'
          alignItems='flex-start'
          className='stepperStip form-builder-items-wrapper'
        >
          {showType &&
            jsonForm &&
            jsonForm[activeTab || activeStep].map((item) => {
              if (!(item && item.data && item.data.valueToEdit)) {
                return (
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={4}
                    lg={4}
                    xl={4}
                    className='form-builder-item-wrapper'
                    key={getRealIndex(item)}
                  >
                    <ConvertJson
                      item={item}
                      setData={setData}
                      setError={setError}
                      itemValue={itemsValue[getRealIndex(item)]}
                      index={getRealIndex(item)}
                      itemList={itemArr}
                      selectedValues={itemsValue}
                      setLoading={setLoading}
                    />
                  </Grid>
                );
              }
              return undefined;
            })}
          {!showType &&
            jsonForm &&
            jsonForm[activeTab || activeStep].map((item) => (
              <Grid
                item
                xs={12}
                sm={12}
                md={4}
                lg={4}
                xl={4}
                className='form-builder-item-wrapper'
                key={getRealIndex(item)}
              >
                <ConvertJson
                  item={item}
                  setData={setData}
                  setError={setError}
                  itemValue={itemsValue[getRealIndex(item)]}
                  index={getRealIndex(item)}
                  itemList={itemArr}
                  selectedValues={itemsValue}
                  setJsonForm={setJsonForm}
                  jsonForm={jsonForm}
                  setSteps={setSteps}
                  steps={steps}
                  values={itemsValue}
                  setitemList={setItemArr}
                  setIsLoading={setLoading}
                />
              </Grid>
            ))}
        </Grid>
        {!withoutButtons && (
          <div className='form-actions-wrapper'>
            <Grid
              container
              justify='space-between'
              alignItems='center'
              className={`form-builder-footer-wrapper${isDialog ? ' is-dialog' : ''}`}
            >
              <Grid>
                <Button
                  className='btns c-danger'
                  onClick={() => {
                    if (closeDialog)
                      closeDialog();
                    else
                      GlobalHistory.goBack();
                  }}
                >
                  <span className='mx-2'>
                    {t('Shared:cancel')}
                  </span>
                </Button>
              </Grid>
              <Grid>
                {activeStep !== 0 && (
                  <Button
                    className='btns theme-solid bg-cancel'
                    onClick={() => {
                      setActiveStep((prevActiveStep) => prevActiveStep - 1);
                    }}
                  >
                    <span className='mdi mdi-chevron-double-left' />
                    <span className='mx-2'>{t('Shared:back')}</span>
                  </Button>
                )}
                <Button
                  className='btns theme-solid bg-secondary'
                  disabled={disableNextButton() || isNextDisabled}
                  onClick={async () => {
                    // changeProgress(activeStep);
                    changeProgress();
                    setTimeout(() => {
                      if (activeStep !== steps.length - 1) {
                        setDuplicateMsg('');
                        setActiveStep((prevActiveStep) => prevActiveStep + 1);
                      }
                      if (activeStep === steps.length - 1) {
                        if (id) editData();
                        else addData();
                      }

                      if (steps && activeStep === steps.length - 1) setDiabledState(true);
                      else setDiabledState(false);
                    }, 10);
                    setIsNextDisabled(true);
                    setTimeout(() => {
                      setIsNextDisabled(false);
                    }, 500);
                  }}
                >
                  <span className='mx-2'>
                    {(activeStep === (steps && steps.length - 1) && t('Shared:finish')) ||
                      t('Shared:next')}
                  </span>
                  <span className='mdi mdi-chevron-double-right' />
                </Button>
              </Grid>
            </Grid>
          </div>
        )}
      </Grid>
      <Dialog
        open={duplicateMsgDialogOpen}
        onClose={() => setDuplicateMsgDialogOpen(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Error</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>{duplicateMsg}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDuplicateMsgDialogOpen(false)} color='primary'>
            close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
GenricStpeper.propTypes = {
  pageName: PropTypes.string.isRequired,
  type: PropTypes.string,
  id: PropTypes.number,
  isDialog: PropTypes.bool,
  closeDialog: PropTypes.func,
  onValuesChanged: PropTypes.func,
  onItemArrayChanged: PropTypes.func,
  showType: PropTypes.bool,
  withTotal: PropTypes.bool,
  withoutStepper: PropTypes.bool,
  withoutButtons: PropTypes.bool,
  activeTab: PropTypes.number,
};
GenricStpeper.defaultProps = {
  id: undefined,
  type: '',
  isDialog: false,
  closeDialog: undefined,
  onValuesChanged: undefined,
  onItemArrayChanged: undefined,
  withoutButtons: false,
  showType: false,
  withTotal: false,
  withoutStepper: false,
  activeTab: undefined,
};
const mapStateToProps = (state) => {
  const {
    login: { loginResponse },
  } = state;
  return {
    loginResponse,
  };
};
function mapFuncToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapFuncToProps)(GenricStpeper);
