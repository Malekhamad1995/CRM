import React, { Component } from "react";
import { Link } from 'react-router-dom';
import ClipboardButton from "react-clipboard.js";
import {getFormID, getFormURL, getFormEditURL, getAdminURL} from "../utils";
import URLDisplay from "./URLDisplay";

export default class FormCreated extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copied: false
    };
  }

  onClipboardCopied() {
    this.setState({copied: true});
  }

  render() {
    const adminToken = this.props.params.adminToken;
    const formID = getFormID(adminToken);

    const userformURL = getFormURL(formID);
    const userformEditURL = getFormEditURL(adminToken);
    const adminURL = getAdminURL(adminToken);
    return (
      <form>
    
        <div className="form-group">
          <ul className="list-inline">
          
            
            <li>
            <ClipboardButton
              className="btn btn-link"
              data-clipboard-text={userformURL}
              onSuccess={this.onClipboardCopied.bind(this)}>
              <i className="glyphicon glyphicon-copy" /> <Link >{this.state.copied ? "Copied!" : "Copy to clipboard"}</Link >
            </ClipboardButton>
            </li>
          </ul>
          <URLDisplay url={userformURL} />
          <URLDisplay url={userformEditURL} />
          <URLDisplay url={adminURL} type="admin" />
        </div>
      </form>
    );
  }
}
