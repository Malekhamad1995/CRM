import React, {
  useCallback, useEffect, useRef, useState
} from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Button, ButtonBase } from '@material-ui/core';
import Joi from 'joi';
import CircularProgress from '@material-ui/core/CircularProgress';
import ChipInput from 'material-ui-chip-input';
import ReactQuill from 'react-quill';
import { FormsIdsEnum } from '../../../../../../Enums';
import { emailExpression } from '../../../../../../Utils/Expressions';
import {
  getDownloadableLink,
  getErrorByName,
  showError,
  showSuccess,
} from '../../../../../../Helper';
import {
  GetAllFormFieldsByFormId,
  GetContacts,
  SendCorrespondingEmailPost,
  uploadFile,
} from '../../../../../../Services';
import { AutocompleteComponent, Inputs, Spinner } from '../../../../../../Components';

export const LeadsActionEmailDialogsComponent = ({
  unitTemplateFile,
  isOpenChanged,
  item,
  translationPath,
  parentTranslationPath,
  unitItem,
}) => {
  const [state, setState] = useState(() => ({
    contacts: '',
    subject: '',
    message: '',
    messageKeyValue: {},
    attachmentFileId: '',
    attachmentFileName: '',
    bcc: [],
    ccc: [],
  }));
  const { t } = useTranslation(parentTranslationPath);
  const [res, setres] = useState([]);
  const uploaderRef = useRef(null);
  const [Selected, setSelected] = useState([]);
  const [formFields, setFormFields] = useState([]);
  const [formFieldsItems, setformFieldsitems] = useState([]);
  const [fileName, setfileName] = useState('');
  const [dragItem, setDragItem] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [isLoadingSpinner, setisLoadingSpinner] = useState(false);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);
  const [showCC, setShowCC] = useState(false);
  const [showBCC, setShowBCC] = useState(false);

  const searchTimer = useRef(null);
  const [mergedfields, setmergedfields] = useState(false);
  const ContactsAPI = useCallback(async (search) => {
    setisLoading(true);
    const results = await GetContacts({
 pageIndex: 0, pageSize: 100, search, isAdvance: false
});
    setres(results.result);
    setisLoading(false);
  }, []);

  const schema = Joi.object({
    contacts: Joi.array()
      .min(1)
      .required()
      .messages({
        'array.min': t(`${translationPath}please-select-at-least-one-contact`),
      }),
    subject: Joi.string()
      .required()
      .messages({
        'string.base': t(`${translationPath}subject-is-required`),
        'string.empty': t(`${translationPath}subject-is-required`),
      }),
    // ccc: Joi.string()
    //   .empty('')
    //   .regex(emailExpression)
    //   .messages({
    //     'string.pattern.base': t('invalid-email'),
    //     'string.empty': t(`${translationPath}email-is-required`),
    //   }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);

  useEffect(() => {
    ContactsAPI();
  }, [ContactsAPI]);

  useEffect(() => {
    if (item) {
      setSelected([
        {
          contactsId: item && item.contact_name && item.contact_name.id,
          contact: {
            // first_name: item.allDetails['Main Information'][1].value,
            // last_name: item.allDetails['Main Information'][2].value,
            company_name: item.name,
          },
        },
      ]);
    }

    setState((items) => ({
      ...items,
      contacts: (item && [item.contact_name && item.contact_name.id]) || [],
    }));
  }, [item]);

  useEffect(() => {
    if (!unitItem) return;
    if (unitItem) {
      setState({
        ...state,
        subject: `${unitItem.name} -  ${unitItem.bedrooms} bedrooms - ${unitItem.bathrooms} bathrooms`,
        message: `${unitItem.name} -  ${unitItem.bedrooms} bedrooms - ${unitItem.bathrooms} bathrooms\n\rTo See More click Here: ${window.location.origin}/share/UnitCard?id=${unitItem.id}`
      });
    }
  }, [unitItem]);

  const searchHandlercountact = (e) => {
    const { value } = e.target;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      ContactsAPI(value);
    }, 700);
  };

  const saveHandler = useCallback(async () => {
    setisLoadingSpinner(true);
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      setisLoading(false);
      return;
    }
    const result = await SendCorrespondingEmailPost(state);
    if (!(result && result.status && result.status !== 200)) {
      showSuccess(t`${translationPath}email-send-successfully`);
      isOpenChanged();
      setisLoading(false);
    } else {
      showError(`${translationPath}email-send-failed`);
      isOpenChanged();
      setisLoadingSpinner(false);
    }
  }, [isOpenChanged, schema.error, state, t, translationPath]);

  const removefileHandler = () => {
    setState((items) => ({
      ...items,
      attachmentFileId: '',
      attachmentFileName: '',
    }));
    setfileName('');
  };
  const DownloadFileHandler = () => {
    const file = getDownloadableLink(state.attachmentFileId);
    window.open(file);
  };
  const uploadFileHandler = useCallback(
    async (file) => {
      setIsLoadingProgress(true);
      const response = await uploadFile({ file });
      if (response) {
        setIsLoadingProgress(false);
        setState((items) => ({
          ...items,
          attachmentFileId: response.uuid,
          attachmentFileName: response.fileName,
        }));
        setfileName(response.fileName);
      } else {
        setIsLoadingProgress(false);
        showError(t(`${translationPath}upload-file-failed`));
      }
    },
    [t, translationPath]
  );

  const fileChanged = useCallback(
    async (event) => {
      if (!event.target.value) return;
      uploadFileHandler(event.target.files[0]);
    },
    [uploadFileHandler]
  );

  const getAllFormFieldsByFormId = useCallback(async () => {
    setisLoadingSpinner(true);
    const result = await GetAllFormFieldsByFormId(FormsIdsEnum.contactsIndividual.id);
    if (!(result && result.status && result.status !== 200)) {
      setFormFields(result || []);
      setformFieldsitems(result || []);
    } else setFormFields([]);
    setisLoadingSpinner(false);
  }, []);

  useEffect(() => {
    getAllFormFieldsByFormId();
  }, [getAllFormFieldsByFormId]);

  const searchHandler = (value) => {
    const Res = formFields.filter((word) =>
      word.formFieldTitle.toLowerCase().includes(value.toLowerCase()));
    setformFieldsitems(Res);
  };
  const onDropHandler = () => {
    setState((items) => {
      items.messageKeyValue = {
        ...items.messageKeyValue,
        [`[${dragItem.formFieldTitle}]`]: dragItem.displayPath,
      };
      return {
        ...items,
        message: `${items.message}[${dragItem.formFieldTitle}]`,
        //  messageKeyValue: {
        //   key: dragItem.displayPath,
        //  },
      };
    });
  };
  useEffect(() => {
    if (unitTemplateFile) uploadFileHandler(unitTemplateFile);
  }, [unitTemplateFile, uploadFileHandler]);
  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    []
  );
  return (
    <div className='ContactsActionEmailDialogsComponent w-100 px-3'>
      <Spinner isActive={isLoadingSpinner} isAbsolute />
      <div className='autocomplete-contenear'>
        <AutocompleteComponent
          idRef='ToRef'
          labelValue='To'
          data={res || []}
          isLoading={isLoading}
          chipsLabel={(option) =>
            option.contact.company_name ||
            (option.contact &&
              (option.contact.first_name || option.contact.last_name) &&
              `${option.contact.first_name} ${option.contact.last_name}`) ||
            ''}
          displayLabel={(option) =>
            option.contact.company_name ||
            (option.contact &&
              (option.contact.first_name || option.contact.last_name) &&
              `${option.contact.first_name} ${option.contact.last_name}`) ||
            ''}
          withoutSearchButton
          inputPlaceholder={t(`${translationPath}Selectcont`)}
          isSubmitted
          getOptionSelected={(option) =>
            Selected.findIndex((items) => items.contactsId === option.contactsId) !== -1 || ''}
          helperText={getErrorByName(schema, 'contacts').message}
          error={getErrorByName(schema, 'contacts').error}
          isWithError
          onInputKeyUp={(e) => searchHandlercountact(e)}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          inputEndAdornment={(
            <div className='bbt-Action'>
              <Button onClick={() => setShowCC(true)}>{t(`${translationPath}CC`)}</Button>
              |
              <Button onClick={() => setShowBCC(true)}>{t(`${translationPath}Bcc`)}</Button>
            </div>
          )}
          selectedValues={Selected || []}
          onChange={(event, newValue) => {
            setState((items) => ({
              ...items,
              contacts: newValue && newValue.map((option) => option.contactsId),
            }));
            setSelected(
              newValue &&
              newValue.map((option) => ({
                contactsId: option.contactsId,
                contact: {
                  first_name: option.contact && option.contact.first_name,
                  last_name: option.contact && option.contact.last_name,
                  company_name: option.contact && option.contact.company_name,
                },
              }))
            );
          }}
        />
      </div>
      {showCC && (
        <div className='d-flex-column w-100 mt-3'>
          <label htmlFor='emailCCRef' className='label-wrapper'>
            {t(`${translationPath}CC`)}
          </label>
          <div className='chip-input-wrapper'>
            <ChipInput
              className='chip-input theme-form-builder'
              id='emailCCRef'
              InputProps={{ autoComplete: 'new-password' }}
              placeholder={t(`${translationPath}email`)}
              value={state.ccc || []}
              onAdd={(chip) => {
                if (!chip) return;
                if (emailExpression.test(chip)) {
                  setState((items) => {
                    items.ccc.push(chip);
                    return { ...items };
                  });
                } else showError(t(`${translationPath}invalid-email-format`));
              }}
              onDelete={(chip, itemIndex) => {
                setState((items) => {
                  items.ccc.splice(itemIndex, 1);
                  return { ...items };
                });
              }}
            />
            <ButtonBase
              className='ml-2-reversed btns-icon theme-solid bg-warning'
              onClick={() => {
                setState((items) => ({ ...items, ccc: [] }));
                setShowCC(false);
              }}
            >
              <span className='mdi mdi-close' />
            </ButtonBase>
          </div>
        </div>
      )}
      {showBCC && (
        <div className='d-flex-column w-100 mt-3'>
          <label htmlFor='emailBCCRef' className='label-wrapper'>
            {t(`${translationPath}bcc`)}
          </label>
          <div className='chip-input-wrapper'>
            <ChipInput
              className='chip-input theme-form-builder'
              id='emailBCCRef'
              InputProps={{ autoComplete: 'new-password' }}
              placeholder={t(`${translationPath}email`)}
              value={state.bcc || []}
              onAdd={(chip) => {
                if (!chip) return;
                if (emailExpression.test(chip)) {
                  setState((items) => {
                    items.bcc.push(chip);
                    return { ...items };
                  });
                } else showError(t(`${translationPath}invalid-email-format`));
              }}
              onDelete={(chip, itemIndex) => {
                setState((items) => {
                  items.bcc.splice(itemIndex, 1);
                  return { ...items };
                });
              }}
            />
            <ButtonBase
              className='ml-2-reversed btns-icon theme-solid bg-warning'
              onClick={() => {
                setState((items) => ({ ...items, bcc: [] }));
                setShowCC(false);
              }}
            >
              <span className='mdi mdi-close' />
            </ButtonBase>
          </div>
        </div>
      )}

      <div className='mt-3'>
        <Inputs
          idRef='subjectRef'
          inputPlaceholder='subject'
          value={state.subject || ''}
          helperText={getErrorByName(schema, 'subject').message}
          error={getErrorByName(schema, 'subject').error}
          isWithError
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            const { value } = event.target;
            setState((items) => ({
              ...items,
              subject: value,
            }));
          }}
        />
      </div>
      <div className='Email-from-wraper'>
        <div
          className='Email-from'
          onDragOver={(event) => {
            event.preventDefault();
          }}
          onDrop={() => onDropHandler()}
        >
          {' '}
          <div className='Title-header'>{t(`${translationPath}Email`)}</div>
          <ReactQuill
            idRef='emailref'
            placeholder={t(`${translationPath}Message`)}
            value={state.message || ''}
            onChange={(event) =>
              setState({ ...state, message: event })}
          />
        </div>
        {mergedfields && (
          <div className='contact-from'>
            <div className='Title-header'>{t(`${translationPath}Merge-fields`)}</div>
            <div className='header-section'>
              <div className=''>
                <Inputs
                  idRef='contactSearchRef'
                  inputPlaceholder='search-fields'
                  translationPath={translationPath}
                  parentTranslationPath={parentTranslationPath}
                  onKeyUp={(e) => searchHandler(e.target.value)}
                  startAdornment={<span className='mdi mdi-magnify mdi-24px c-gray' />}
                />
              </div>
              <div className='Title-list'>
                <span className='mdi mdi-plus-box-outline' />
                {t(`${translationPath}Contact-details`)}
              </div>
              <div className='Merge-fields-section mt-3'>
                {formFieldsItems &&
                  formFieldsItems.map((items, index) => (
                    <div
                      draggable
                      className='Merge-fields-wraper'
                      index={index + 1}
                      key={`emailFormKeyValuesRef${index + 1}`}
                      onDrag={() => setDragItem(items)}
                    >
                      {items.formFieldTitle}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className='actions-conteaner-wrapper w-100 px-3 mb-4'>
        <div className='d-inline-flex-v-center flex-wrap'>
          {/* <div className='space'>
            <ButtonBase>
              <span>{t(`${translationPath}Add-template`)}</span>
            </ButtonBase>
          </div> */}
          <div className='file-uploader-coneaner'>
            <ButtonBase>
              <input
                // value={attachmentFile}
                type='file'
                className='d-none'
                onChange={fileChanged}
                accept='*'
                ref={uploaderRef}
              />
              <span className='mdi mdi-paperclip ' />
              <span onClick={() => uploaderRef.current.click()}>
                {t(`${translationPath}Attach-files`)}
              </span>
            </ButtonBase>
            {isLoadingProgress === true ? <CircularProgress /> : ''}

            {fileName !== '' ? (
              <div>
                <span
                  onClick={() => {
                    DownloadFileHandler();
                  }}
                  title={t(`${translationPath}download-file`)}
                  className='bbt-style-dawnlode mdi mdi-file-import'
                />
                <span
                  title={t(`${translationPath}download-file`)}
                  onClick={() => {
                    DownloadFileHandler();
                  }}
                  className='fileName-dw'
                >
                  {fileName}
                </span>
                <span className='remove-b'>
                  <span
                    title={t(`${translationPath}remove-file`)}
                    onClick={() => {
                      removefileHandler();
                    }}
                    className='bbt-style-remove mdi mdi-file-remove'
                  />
                </span>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
        <div>
          <ButtonBase
            onClick={() =>
              (mergedfields === false ? setmergedfields(true) : setmergedfields(false))}
          >
            <span>
              {mergedfields === true ?
                t(`${translationPath}Hide-merged-fields`) :
                t(`${translationPath}Show-merged-fields`)}
            </span>
          </ButtonBase>
        </div>
      </div>
      <div className='d-flex-v-center-h-end flex-wrap'>
        <Button
          className='MuiButtonBase-root btns theme-transparent mb-2'
          onClick={() => {
            isOpenChanged();
          }}
        >
          <span>{t(`${translationPath}Cancel`)}</span>
          <span className='MuiTouchRipple-root' />
        </Button>
        <Button
          disabled={!!schema.error || isLoadingProgress}
          className='MuiButtonBase-root btns theme-solid mb-2'
          onClick={() => {
            saveHandler();
          }}
        >
          <span>{t(`${translationPath}Send`)}</span>
        </Button>
      </div>
    </div>
  );
};

LeadsActionEmailDialogsComponent.propTypes = {
  isOpenChanged: PropTypes.func.isRequired,
  item: PropTypes.instanceOf(Object),
  unitTemplateFile: PropTypes.instanceOf(Object),
  unitItem: PropTypes.instanceOf(Object),
  translationPath: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
};
LeadsActionEmailDialogsComponent.defaultProps = {
  unitTemplateFile: undefined,
  item: undefined,
  unitItem: undefined,
};
