import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import cities from "../../assets/json/Cities.json"
import { GET_COUNTRIES, PICKED_COUNTRY } from '../../store/countries/Actions';

const Countrypicker = ({
  getCountriesFunction,
  countriesResponse,
  newValue,
  isRequired,
  labelWidth,
  errorMsg,
  setNewValue,
  setData,
  id,
  Input,
  label,
//  setPickedCountryFunction,

}) => {
  useEffect(() => {
    if (!countriesResponse) {
      getCountriesFunction();
    }
  }, []);
  return (
    <FormControl variant="outlined" style={{ width: '100%' }}>
      <InputLabel ref={Input}>
        {label}
      </InputLabel>
      <Select
        id={id}
        value={`${newValue}`}
        required={isRequired}
        variant="outlined"
        labelWidth={labelWidth}
        style={{ width: '100%' }}
        inputProps={{ name: 'name', id: 'value' }}
        helperText={errorMsg}
        onChange={(event) => {
          setNewValue(event.target.value);
          setData(event.target.value);
       //   setPickedCountryFunction(countriesResponse.filter((i) => i.name === event.target.value)[0]);
        }}
      >
        <MenuItem value="" />
        {
           cities.map((item, index) => <MenuItem key={index} value={item.Country}>{item.Country}</MenuItem>)
        }
      </Select>
    </FormControl>
  );
};

Countrypicker.propTypes = {
  getCountriesFunction: PropTypes.func,
  countriesResponse: PropTypes.instanceOf(Object),
  newValue: PropTypes.string,
  isRequired: PropTypes.bool,
  labelWidth: PropTypes.number,
  errorMsg: PropTypes.string,
  setNewValue: PropTypes.func,
  setData: PropTypes.func,
  id: PropTypes.number,
  Input: PropTypes.func,
  label: PropTypes.string,
  setPickedCountryFunction: PropTypes.func,
};

const mapStateToProps = (state) => {
  const {
    countries: {
      countriesResponse,
    },
  } = state;
  return {
    countriesResponse,
  };
};
function mapFuncToProps(dispatch) {
  return {
    dispatch,
    getCountriesFunction: (payload) => dispatch(GET_COUNTRIES(payload)),
    setPickedCountryFunction: (payload) => dispatch(PICKED_COUNTRY(payload)),
  };
}
export default connect(mapStateToProps, mapFuncToProps)(Countrypicker);
