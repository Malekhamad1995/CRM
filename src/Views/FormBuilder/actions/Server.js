
import { updateform } from '../../../Services/formbuilder/updateform';

export const FORM_PUBLISH = 'FORM_PUBLISH';
export const FORM_PUBLICATION_PENDING = 'FORM_PUBLICATION_PENDING';
export const FORM_PUBLICATION_DONE = 'FORM_PUBLICATION_DONE';
export const FORM_PUBLICATION_FAILED = 'FORM_PUBLICATION_FAILED';
export const FORM_RECORD_CREATION_PENDING = 'FORM_RECORD_CREATION_PENDING';
export const FORM_RECORD_CREATION_DONE = 'FORM_RECORD_CREATION_DONE';
export const SCHEMA_RETRIEVAL_PENDING = 'SCHEMA_RETRIEVAL_PENDING';
export const SCHEMA_RETRIEVAL_DONE = 'SCHEMA_RETRIEVAL_DONE';
export const RECORDS_RETRIEVAL_PENDING = 'RECORDS_RETRIEVAL_PENDING';
export const RECORDS_RETRIEVAL_DONE = 'RECORDS_RETRIEVAL_DONE';


// Send JSON Form to DB
export function publishForm(callback) {
  const thunk = (dispatch, getState, retry = true) => {
    const { form } = getState().formbuilder;
    const { schema } = form;
    const { uiSchema } = form;

    // Remove the "required" property if it's empty.
    if (schema.required && schema.required.length === 0)
      delete schema.required;

    const UpdatedForm = [{ data: { schema, uiSchema } }];

    const payload = { formsName: form.schema.title, formsContent: JSON.stringify(UpdatedForm) };
   updateform(payload, form.formId);
  };
  return thunk;
}

/**
 * Submit a new form answer.
 * */
export function submitRecord(record, collection, callback) {
  return (dispatch, getState) => {
    dispatch({ type: FORM_RECORD_CREATION_PENDING });

    /*
    .catch((error) => {
      connectivityIssues(dispatch, "We were unable to publish your answers");
    });
    */
  };
}

export function loadSchema(data, callback) {
  return (dispatch, getState) => {
    dispatch({
      type: SCHEMA_RETRIEVAL_DONE,
      data,
    });
  };
}


export function getRecords(callback, FormID) {
  return (dispatch, getState) => {
    dispatch({ type: RECORDS_RETRIEVAL_PENDING });

    /*
    .catch((error) => {
      connectivityIssues(
        dispatch,
        "We were unable to retrieve the list of records for your form."
      );
    });
    */
  };
}
