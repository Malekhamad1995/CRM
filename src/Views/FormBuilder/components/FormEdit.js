import React, { Component } from 'react';
import { withRouter } from 'react-router';
import FormContainer from './FormContainer';
import { getform } from '../../../Services/formbuilder/getform';
import { GetParams } from '../../../Helper';
import './EditFormBuilder.scss';

 class FormEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schema: [],
      uiSchema: [],
      isLoading: false
    };
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    // changeLoading(true);
  const GetFormJSON = async () => {
    const keyform = GetParams('type');
    // Object.keys(this.props.match.params).map((key) => keyform = this.props.match.params[key]);
  const json = await getform(keyform);
  if (!json.error) {
    // changeLoading(false);
  const JsonForm = JSON.parse(json[0].form_content)[0];

  document.title = JsonForm.data.schema.title;
  this.setState({
        schema: JsonForm.data.schema,
        uiSchema: JsonForm.data.uiSchema,
        isLoading: false,
        formId: json[0].form_id
    });
    this.props.loadSchema(this.state, JsonForm);
  } else {
    // changeLoading(false);
  }
};
GetFormJSON();
  }
  //
  // componentDidUpdate(prevProps) {
  //
  //   // if (this.props.match.params.type === prevProps.match.params.type) return; // to exit while stell in same state
  //   changeLoading(true);
  //   const GetFormJSON = async () => {
  //     let keyform = '';
  //     // Object.keys(this.props.match.params).map((key) => keyform = this.props.match.params[key]);
  //   const json = await getform(GetParams("type"));
  //   changeLoading(false);
  //   if (json) {
  //   const JsonForm = JSON.parse(json[0].form_content)[0];
  //   document.title = JsonForm.data.schema.title;
  //   this.setState({
  //         schema: JsonForm.data.schema,
  //         uiSchema: JsonForm.data.uiSchema,
  //         isLoading: false,
  //         formId: json[0].form_id
  //     });
  //     this.props.loadSchema(this.state, JsonForm);
  //   }
  // };
  // GetFormJSON();
  // }

  render() {
    return (
      <div className="EditFormBuilder">
        <div className="page">

          <FormContainer {...this.props} />
        </div>
      </div>
  );
  }
}

export default withRouter(FormEdit);
