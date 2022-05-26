import React, { useState, useEffect } from 'react';
import {
  Collapse,
  Grid,
  Card,
  CardContent,
  Divider,
  Fab,
  Tooltip,
  LinearProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  ArrowUpward,
  ArrowDownward,
  EditRounded,
  Home,
  DescriptionRounded,
} from '@material-ui/icons';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import { connect } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import { useTranslation } from 'react-i18next';
import { config } from '../../../../config/config';
import fillEmpty from '../../../../Utils/fillEmpty';
// import Rating from '@material-ui/lab/Rating';
import { UNIT_DETAILS_FIELD_GET } from '../../../../store/unit/Actions';
import { UNITS } from '../../../../config/pagesName';
import PercentageProgress from '../PercentageProgress';
import PercentageCircle from '../PercentageCircle';

const useStyles = makeStyles({
  root: {
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: '#E7E7E7',
    },
  },
  fontSize: '12px',
  RatingStyle: {
    display: 'flex',
    flexDirection: 'column',
    '& > * + *': {
    },
  },
});

const UnitCard = ({
  item,
  history,
  getUnitsDetailsFieldResponse,
  getUnitDetailsResponseFunction,
  setSelectedIdsToMerge,
  enableMultiSelect,
  checked,
}) => {
  const { t } = useTranslation('DataFiles');
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState(false);
  useEffect(() => {
    if (getUnitsDetailsFieldResponse && !details) {
      setIsLoading(false);
      if (Array.isArray(getUnitsDetailsFieldResponse))
        setDetails(getUnitsDetailsFieldResponse[0]);
    }
  }, [getUnitsDetailsFieldResponse, details]);
  return (
    <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
      <Card
        className={classes.root}
        onClick={() => {
          if (enableMultiSelect) return;
          setExpanded(!expanded);
          if (!expanded) {
            setDetails(false);
            setIsLoading(true);
            getUnitDetailsResponseFunction({ id: item.unit_id });
          }
        }}
        style={{ width: '100%', padding: 5 }}
      >
        {isLoading && <LinearProgress color="secondary" />}
        <PercentageProgress dataCompleted={item.data_completed} />
        <Grid xs={12} container>
          <Grid
            item
            spacing={4}
            xs={12}
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: -30,
            }}
          >
            {expanded ? <ArrowUpward /> : <ArrowDownward />}
          </Grid>
          <Grid container justify="center" alignItems="center" spacing={3} className="cardFont">
            { enableMultiSelect
            && (
            <Grid item xs={1}>
              <Checkbox
                checked={checked}
                onChange={() => setSelectedIdsToMerge(item.unit_type_id, item.unit_id)}
                value="primary"
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </Grid>
            )}
            <Grid item xs={3}>
              {item.unit_type_id === '1' ? (
                <Home
                  style={{
                    width: '60%',
                    height: '60%',
                    marginTop: 18,
                    marginLeft: 10,
                    color: config.theme_primary_color,
                  }}
                />
              ) : (
                <Home
                  style={{
                    width: '60%',
                    height: '60%',
                    marginTop: 14,
                    marginLeft: 10,
                    color: config.theme_secondary_color,
                  }}
                />
              )}
            </Grid>
            <Grid item xs={8}>
              <CardContent style={{ marginLeft: -40, marginBottom: -25, marginTop: -20 }}>

                <Grid
                  item
                  xs={10}
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: 20,
                    marginLeft: '4%',
                  }}
                >
                  <PercentageCircle dataCompleted="" />
                </Grid>
                <Grid container spacing={1}>
                  {item.unit_type_id === '1' && (
                    <>
                      <Grid
                        item
                        xs={7}
                        className={`${classes.itemValue} truncateLongTexts`}
                      >
                        {fillEmpty('Sale')}
                      </Grid>
                    </>
                  )}

                  {item.unit_type_id === '2' && (
                    <>
                      <Grid
                        item
                        xs={7}
                        className={`${classes.itemValue} truncateLongTexts`}
                      >
                        {fillEmpty('Rent')}
                      </Grid>
                    </>
                  )}

                  <Grid
                    item
                    xs={7}
                    className={`${classes.itemValue} truncateLongTexts`}
                  >
                    {fillEmpty(item.unit_type)}
                  </Grid>
                  {/*
                  <Grid className={classes.RatingStyle}>
                      <StyledRating size="small" name="size-medium"    readOnly/>
                  </Grid> */}
                  <Grid />

                  <Grid item xs={12}>
                    <Collapse
                      in={expanded && details}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Grid container spacing={1}>
                        <Grid item xs={5} style={{ fontWeight: 'bold' }}>
                          {t('Units.Property')}
                        </Grid>
                        <Tooltip
                          title={fillEmpty(item.property_name)}
                          aria-label="propertyTip"
                          arrow
                        >
                          <Grid
                            item
                            xs={7}
                            className={`${classes.itemValue} truncateLongTexts`}
                          >
                            {fillEmpty(item.property_name)}
                          </Grid>
                        </Tooltip>

                        <Grid item xs={5} style={{ fontWeight: 'bold' }}>
                          {t('Units.Unit')}
                        </Grid>
                        <Grid
                          item
                          xs={7}
                          className={`${classes.itemValue} truncateLongTexts`}
                        >
                          {fillEmpty(item.unit_number)}
                        </Grid>
                        <Grid item xs={5} style={{ fontWeight: 'bold' }}>
                          {t('Units.Bedrooms')}
                        </Grid>
                        <Grid
                          item
                          xs={5}
                          className={`${classes.itemValue} truncateLongTexts`}
                        >
                          {fillEmpty(item.bedrooms)}
                        </Grid>

                        <Grid item xs={5} style={{ fontWeight: 'bold' }}>
                          {t('Units.Bathrooms')}
                        </Grid>
                        <Grid item xs={5} className={classes.itemValue}>
                          {fillEmpty(item.bathrooms)}
                        </Grid>

                        <Grid item xs={5} style={{ fontWeight: 'bold' }}>
                          {t('Units.Size')}
                        </Grid>
                        <Grid item xs={5} className={classes.itemValue}>
                          {fillEmpty(item.size_sqft)}
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Divider
                          style={{ width: '95%', margin: 15 }}
                          orientation="horizontal"
                        />
                      </Grid>
                      <Grid
                        container
                        spacing={1}
                        justify="center"
                        alignItems="center"
                      >
                        <Grid item xs={12} style={{ marginBottom: 10 }}>
                          <Tooltip title={t('Units.Edit')} aria-label="edit">
                            <Fab
                              style={{
                                backgroundColor: config.theme_secondary_color,
                                width: 40,
                                height: 40,
                              }}
                              onClick={() => {
                                history.push(
                                  `/main/edit/${UNITS}/${item.unit_type_id}/${item.unit_id}/all`,
                                );
                              }}
                            >
                              <EditRounded style={{ color: '#fff' }} />
                            </Fab>
                          </Tooltip>
                          <Tooltip
                            title={t('Units.OpenFiles')}
                            aria-label="openFiles"
                            arrow
                          >
                            <Fab
                              style={{
                                backgroundColor: config.theme_primary_color,
                                width: 40,
                                height: 40,
                                marginLeft: 10,
                              }}
                              onClick={() => {
                                history.push(
                                  `/main/details/${UNITS}/${item.unit_type_id}/${item.unit_id}`,
                                );
                              }}
                            >
                              <DescriptionRounded style={{ color: '#fff' }} />
                            </Fab>
                          </Tooltip>
                          <Tooltip
                            title={t('Units.MissingData')}
                            aria-label="Missing Data"
                            arrow
                          >
                            <Fab
                              style={{
                                backgroundColor: config.theme_alrarm_color,
                                width: 40,
                                height: 40,
                                marginLeft: 10,
                              }}
                              onClick={() => {
                                history.push(
                                  `/main/edit/${UNITS}/${item.unit_type_id}/${item.unit_id}/missing`,
                                );
                              }}
                            >
                              <PriorityHighIcon style={{ color: '#fff' }} />
                            </Fab>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </Collapse>
                  </Grid>
                </Grid>
              </CardContent>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};
const mapStateToProps = (state) => {
  const {
    units: { getUnitsDetailsFieldResponse },
  } = state;
  return {
    getUnitsDetailsFieldResponse,
  };
};
function mapFuncToProps(dispatch) {
  return {
    dispatch,
    getUnitDetailsResponseFunction: (payload) => dispatch(UNIT_DETAILS_FIELD_GET(payload)),
  };
}
export default connect(mapStateToProps, mapFuncToProps)(UnitCard);
