import React, { // useEffect,
  useEffect,
  useState
} from 'react';
import PropTypes from 'prop-types';
import { ButtonBase } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line import/no-cycle
import { Inputs, UploaderComponent } from '..';
import { getDownloadableLink } from '../../Helper';
import { TemplatesPreviewDialog } from '../../Views/Home/TemplatesView/Dialogs';

export const UploaderActivitieFileComponent = ({
  state, 
  onCloseClicked,
  onUploaderActivitieChange,
  allFiles
}) => {
  const translationPath = '';
  const { t } = useTranslation('Shared');
  const [inputList, setInputList] = useState([
    {
      fileName: '',
      uuid: null,
      fullfileName: null
    } 
  ] || allFiles);
  const [isOpenPreviewDialog, setIsOpenPreviewDialog] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [newFileName , setNewFileName] = useState("");
  const handleInputChange = (e, name, index) => {
    const value = e;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  const handleAddClick = () => {
    setInputList([
      ...inputList,
      {
        fileName: '', uuid: null, fullfileName: null
      },
    ]);
  };


  useEffect(()=>{
    setInputList([...allFiles])
  },[])

  useEffect(()=>{
      if(state.fileId){
      const list =  [
        {fileName: state.fileName ||'',uuid: state.fileId,
         fullfileName: state.fullfileName || (allFiles  && allFiles.length && allFiles[0].fullfileName)}]; 
      setInputList([...list]);
    } 
  },[state])
  
  return (
    <div className='UploaderActivitieFileComponent-wrapper'>
      <span className='d-flex mb-2 fw-bold c-black-light'>
        {t(`${translationPath}uplode-File`)}
      </span>
      <div className='form-wrapper'>
        {inputList.map((x, i) => (
          <>
            <div className='form-item'>
              {/* <div className='part-1 Inputs mt-2 w-100' style={{border:"pink 1px solid"}}>
                <Inputs
                  idRef='infantFee'
                  translationPath={translationPath}
                  parentTranslationPath='Shared'
                  isWithError
                  inputPlaceholder='File-name'
                  value={x.fileName || ''}
                  onInputChanged={(event) => {
                    handleInputChange(event.target.value, 'fileName', i);
                    setNewFileName(event.target.value)
                  }}
                />
              </div> */}
              <div className='Uploader w-100'>
                <UploaderComponent
                  idRef='leadsImportRef'
                  accept='*'
                  chipHandler={(value) => () => {
                    const link = document.createElement('a');
                    link.setAttribute('download', value.fileName);
                    link.href = getDownloadableLink(value.uuid);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                  }}
                  // initUploadedFiles={x.uuid || []}
                  initUploadedFiles={
                    (x.uuid && [
                      {
                        uuid: x.uuid,
                        fileName: x.fileName,
                      },
                    ]) ||
                    []
                  }
                  uploadedChanged={(files) => {
                    handleInputChange((files && files.length > 0 && files[0].uuid) || null, 'uuid', i);
                    handleInputChange((files && files.length > 0 && files[0].fileName) || null, 'fullfileName', i);
                  }}
                //  newFileName = {newFileName}
                // allFilesChanged={(files) => setCurrentUploadedFiles(files)}
                // defaultImage={DefaultImagesEnum.individual.key}
                // uploaderTheme={UploaderThemesEnum.box.key}
                />
              </div>

              {inputList.length !== 1 && (
                <div className='part-add mx-1'>
                  <Tooltip
                    size='small'
                    title={t(`${translationPath}delete`)}
                    onClick={() => handleRemoveClick(i)}
                  >
                    <Fab>
                      <DeleteIcon fontSize='small' />
                    </Fab>
                  </Tooltip>
                </div>
              )}

              <div className='part-add mx-1'>
                <Tooltip
                  size='small'
                  title={t(`${translationPath}view`)}
                  aria-label='view'
                  onClick={() => {
                    setIsOpenPreviewDialog(true);
                    setActiveItem({
                      templateFileId: x.uuid,
                      templateFileName: x.fullfileName,
                      templateText: ''
                    });
                  }}
                >
                  <Fab
                    className={
                      x.fileName === '' ? 'addIcondisactive' : 'addIconactive'
                    }
                    disabled={(x.fullfileName === null)}
                  >
                    <span className='table-action-icon mdi mdi-eye-outline' />
                  </Fab>
                </Tooltip>
              </div>
              {/* Disable to upload more one file untile api */}
              {/* {inputList.length - 1 === i && (                 
                <div className='part-add'>
                  <Tooltip
                    size='small'
                    title={t(`${translationPath}add`)}
                    aria-label='add'
                    onClick={handleAddClick}
                  >
                    <Fab
                      className={
                        x.fileName === '' ? 'addIcondisactive' : 'addIconactive'
                      }
                      disabled={(x.uuid === null)}
                    >
                      <AddIcon />
                    </Fab>
                  </Tooltip>
                </div>
              )} */}
            </div>
          </>
        ))}
      </div>
      {isOpenPreviewDialog && (
        <TemplatesPreviewDialog
          activeItem={activeItem}
          maintitleText='FILE-VIEW'
          isOpen={isOpenPreviewDialog}
          isOpenChanged={() => {
            setIsOpenPreviewDialog(false);
            setActiveItem(null);
          }}
          parentTranslationPath='Shared'
          translationPath={translationPath}
        />
      )}
      <div className='MuiDialogActions-root MuiDialogActions-spacing mt-3'>
        <ButtonBase className='MuiButtonBase-root btns theme-solid bg-cancel' onClick={onCloseClicked}>
          {t(`${translationPath}cancel`)}
          <span className='MuiTouchRipple-root' />
        </ButtonBase>
        <ButtonBase
          className='MuiButtonBase-root btns theme-solid'
          disabled={inputList[0].uuid === null || inputList[0].uuid === '' || inputList[0].fullfileName === undefined }
          onClick={() => { onUploaderActivitieChange(inputList); onCloseClicked(); }}
        >
          <span className='mdi mdi-folder-plus-outline px-2' />
          {' '}
          <span className='px-2'>
            {' '}
            {t(`${translationPath}Add-files`)}
            {' '}
          </span>
          <span className='MuiTouchRipple-root ' />
        </ButtonBase>
      </div>
    </div>
  );
};

UploaderActivitieFileComponent.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  onCloseClicked: PropTypes.func.isRequired,
  onUploaderActivitieChange: PropTypes.func.isRequired,
};
