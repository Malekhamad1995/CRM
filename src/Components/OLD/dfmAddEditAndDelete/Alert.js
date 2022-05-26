import React from 'react';
import { Zoom } from '@material-ui/core';
import PropTypes from 'prop-types';

const Alert = ({ msg }) => (
  <>
    <Zoom
      in={msg && msg !== ''}
      mountOnEnter
      unmountOnExit
    >
      <div className="alert">
        {`${msg}`}
      </div>
    </Zoom>
    <style>
      {`.alert {
  padding: 20px;
  margin-top: 20px;
  background-color: #f44336;
  color: white;
}

.closebtn {
  margin-left: 15px;
  color: white;
  font-weight: bold;
  float: right;
  font-size: 22px;
  line-height: 20px;
  cursor: pointer;
  transition: 0.3s;
}

.closebtn:hover {
  color: black;
  }
`}

    </style>
  </>
);
Alert.propTypes = {
  msg: PropTypes.string.isRequired,
};

export default Alert;
