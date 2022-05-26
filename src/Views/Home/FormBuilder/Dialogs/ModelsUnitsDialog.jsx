import React, {
  useReducer, useEffect, useState, useCallback
} from 'react';
import { Grid } from '@material-ui/core';
import { getDownloadableLink } from '../../../../Helper';
// import { config } from '../../../../config/config';
import {
  DialogComponent,
  Inputs,
  StepperComponent,
  UploaderComponent,
  AutocompleteComponent,
  Spinner
} from '../../../../Components';
import { lookupItemsGetId } from '../../../../Services';
// import { DefaultImagesEnum, UploaderThemesEnum } from '../../../../Enums';

export function ModelsUnitsDialog(props) {
  const reducer = (state, action) => ({ ...state, [action.id]: action.value });
  const [state, setState] = useReducer(reducer, props.initialState);
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed] = React.useState({});
  const totalSteps = () => props.initialState.Models.length;
  const [isLoading, setIsLoading] = useState(false);

  const [views, setViews] = useState([]);

  const completedSteps = () => Object.keys(completed).length;

  const isLastStep = () => activeStep === totalSteps() - 1;

  const allStepsCompleted = () => completedSteps() === totalSteps();

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted() // It's the last step, but not all steps have been completed,
        ? // find the first step that has been completed
        props.initialState.selected.findIndex((step, i) => !(i in completed)) :
        activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  // const getUploadParams = ({ file }) => {
  //   const body = new FormData();
  //   body.append('file', file);

  //   return {
  //     url: `${config.server_address}/FileManager/File/Upload`,
  //     method: 'POST',
  //     body,
  //     headers: {
  //       'Access-Control-Allow-Origin': '*',
  //       Authorization: `Bearer ${JSON.parse(localStorage.getItem('session')).token}`,
  //     },
  //   };
  // };

  // const handleChangeStatus = (e, status, lable) => {
  //   if (status === 'done') {
  //     if (state[lable] && state[lable].files) {
  //       const data = JSON.parse(e.xhr.response);
  //       setState({ id: lable, value: { ...state[lable], files: [...state[lable].files, data] } });
  //     } else {
  //       const data = JSON.parse(e.xhr.response);
  //       setState({ id: lable, value: { ...state[lable], files: [data] } });
  //     }
  //   }
  // };
  const saveHandler = (event) => {
    // event.preventDefault();
    props.onChange(state);
    props.closeDialog();
  };

  const getAllViewsAPI = useCallback(async () => {
    setIsLoading(true);
    const result = await lookupItemsGetId({ lookupTypeId: 142 });
    if (!(result && result.status && result.status !== 200))
      setViews(result);
    else setViews([]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    getAllViewsAPI();
  }, [getAllViewsAPI]);

  return (
    <DialogComponent
      titleText='Models Units'
      saveText='save'
      dialogContent={(
        <>
          <div className='w-100'>
            <StepperComponent
              steps={props.initialState.Models}
              onStepperClick={(index) => {
                handleStep(index);
              }}
              completed={(index) => completed[index]}
              activeStep={activeStep}
            />
            <Spinner isActive={isLoading} isAbsolute />
            {/* <Stepper nonLinear activeStep={activeStep}>
              {props.initialState.Models.map((label, index) => (
                <Step key={label}>
                  <StepButton onClick={handleStep(index)} completed={completed[index]}>
                    {label}
                  </StepButton>
                </Step>
              ))}
            </Stepper> */}
          </div>

          {props.initialState.Models.map(
            (label, labelIndex) =>
              props.initialState.Models[activeStep] === label && (
                <Grid container key={`inputsWrapperUnitsModuleRef${labelIndex + 1}`}>
                  {props.items.map((value, index) => (
                    <Grid
                      item
                      xs={12}
                      md={6}
                      className='px-2 mb-2'
                      key={`inputsUnitsModuleRef${index + 1}`}
                    >
                      {(value !== 'primary_view' && value !== 'secondary_view') && (
                        <Inputs
                          idRef={index}
                          labelValue={value}
                          value={
                            state && state[label] && value && state[label][value] ? state[label][value] : ''
                          }
                          onInputChanged={(e) => {
                            const data = {};
                            data[value] = e.target.value;
                            setState({ id: label, value: { ...state[label], ...data } });
                          }}
                        />

                      )}
                      {
                        (value === 'primary_view' && (state && state[label] && state[label][value])) && (
                          <AutocompleteComponent
                            idRef={index}
                            className='px-2'
                            selectedValues={(state && state[label] && state[label][value]) || ''}
                            labelValue={value}
                            multiple
                            data={views || []}
                            displayLabel={(option) =>
                              (option && option.lookupItemName) || ''}
                            chipsLabel={(option) => (option && option.lookupItemName) || ''}
                            withoutSearchButton
                            onChange={(event, newValue) => {
                              const data = {};
                              data[value] = newValue;
                              setState({ id: label, value: { ...state[label], ...data } });
                            }}
                          />
                        )

                      }
                      {
                        (value === 'primary_view' && !(state && state[label] && state[label][value])) && (
                          <AutocompleteComponent
                            idRef={index}
                            className='px-2'
                            labelValue={value}
                            multiple
                            data={views || []}
                            displayLabel={(option) =>
                              (option && option.lookupItemName) || ''}
                            chipsLabel={(option) => (option && option.lookupItemName) || ''}
                            withoutSearchButton
                            onChange={(event, newValue) => {
                              const data = {};
                              data[value] = newValue;
                              setState({ id: label, value: { ...state[label], ...data } });
                            }}
                          />
                        )

                      }
                      {
                        (value === 'secondary_view' && (state && state[label] && state[label][value])) && (
                          <AutocompleteComponent
                            idRef={index}
                            className='px-2'
                            selectedValues={(state && state[label] && state[label][value]) || ''}
                            labelValue={value}
                            data={views || []}
                            multiple={false}
                            displayLabel={(option) =>
                              (option && option.lookupItemName) || ''}
                            chipsLabel={(option) => (option && option.lookupItemName) || ''}
                            withoutSearchButton
                            onChange={(event, newValue) => {
                              const data = {};
                              data[value] = newValue;
                              setState({ id: label, value: { ...state[label], ...data } });
                            }}

                          />
                        )

                      }
                      {
                        (value === 'secondary_view' && (!(state && state[label] && state[label][value]))) && (
                          <AutocompleteComponent
                            idRef={index}
                            className='px-2'
                            labelValue={value}
                            data={views || []}
                            multiple={false}
                            displayLabel={(option) =>
                              (option && option.lookupItemName) || ''}
                            chipsLabel={(option) => (option && option.lookupItemName) || ''}
                            withoutSearchButton
                            onChange={(event, newValue) => {
                              const data = {};
                              data[value] = newValue;
                              setState({ id: label, value: { ...state[label], ...data } });
                            }}

                          />
                        )

                      }

                    </Grid>
                  ))}

                  <Grid
                    item
                    xs={12}
                    className='px-2'
                  >
                    {/* <Dropzone
                      getUploadParams={getUploadParams}
                      onChangeStatus={(e, status) => {
                        handleChangeStatus(e, status, label);
                      }}
                      inputContent='Drag Files'
                      styles={{ dropzone: { minHeight: 100, maxHeight: 150 } }}
                    /> */}
                    <UploaderComponent
                      idRef='modelsUnitsImportRef'
                      multiple
                      accept='*'
                      uploadedChanged={(files) =>
                        setState({ id: label, value: { ...state[label], files } })}
                      chipHandler={(value) => () => {
                        const link = document.createElement('a');
                        // If you don't know the name or want to use
                        // the webserver default set name = ''
                        link.setAttribute('download', value.fileName);
                        link.href = getDownloadableLink(value.uuid);
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                      }}
                      viewUploadedFilesCount
                      // allFilesChanged={(files) => setCurrentUploadedFiles(files)}
                      initUploadedFiles={
                        (props.initialState &&
                          props.initialState[label] &&
                          props.initialState[label].files &&
                          JSON.parse(JSON.stringify(props.initialState[label].files))) ||
                        []
                      }
                    // defaultImage={DefaultImagesEnum.corporate.key}
                    // uploaderTheme={UploaderThemesEnum.box.key}
                    />
                  </Grid>

                  {/* <Grid item xs={12}>
                    <div className='mxh-150P h-100P attachment'>
                      {state[label] &&
                        state[label].files &&
                        state[label].files.map((value, index) => (
                          <Grid container key={`attachmentsRef${index + 1}`}>
                            <Grid item xs={12} md={10}>
                              {value.fileName}
                            </Grid>
                            <Grid item xs={12} md={2} className='text-align-right'>
                              <IconButton
                                color='primary'
                                onClick={() => {
                                  const a = document.createElement('a');
                                  a.style.display = 'none';
                                  a.href = getDownloadableLink(value.uuid);
                                  a.target = '_blank';
                                  // the filename you want
                                  a.download = value.fileName;
                                  document.body.appendChild(a);
                                  a.click();
                                }}
                              >
                                <GetAppIcon />
                              </IconButton>
                            </Grid>
                          </Grid>
                        ))}
                    </div>
                  </Grid> */}
                </Grid>
              )
          )}
        </>
      )}
      isOpen={props.open}
      saveType='button'
      onSaveClicked={(isLastStep() && saveHandler) || undefined}
      saveCancelWrapperClasses='fj-end'
      onPreviousClicked={
        (activeStep !== 0 &&
          (() => {
            handleBack();
          })) ||
        undefined
      }
      onNextClicked={
        (!isLastStep() &&
          (() => {
            handleNext();
          })) ||
        undefined
      }
      onCloseClicked={() => {
        props.closeDialog();
      }}
      onCancelClicked={() => {
        props.closeDialog();
      }}
    />
    // <>
    //   <Dialog open={props.open} className='dialog' maxWidth='lg'>
    //     <DialogTitle>  </DialogTitle>
    //     <DialogContent>

    //     </DialogContent>

    //     <DialogActions>
    //       {activeStep !== 0 && (
    //         <Button
    //           className='btns'
    //           onClick={() => {
    //             handleBack();
    //           }}
    //         >
    //           Back
    //         </Button>
    //       )}
    //       {!isLastStep() && (
    //         <Button
    //           className='btns'
    //           onClick={}
    //         >
    //           Next
    //         </Button>
    //       )}
    //       <Button
    //         variant='outline'
    //         onClick={() => {
    //           props.closeDialog();
    //         }}
    //         color='secondary'
    //       >
    //         Close
    //       </Button>
    //       {isLastStep() && (
    //         <Button
    //           variant='outline'
    //           onClick={() => {
    //             props.onChange(state);
    //             props.closeDialog();
    //           }}
    //           color='primary'
    //         >
    //           Save
    //         </Button>
    //       )}
    //     </DialogActions>
    //   </Dialog>
    // </>
  );
}
