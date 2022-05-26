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
  HomeWork,
  DescriptionRounded,
} from '@material-ui/icons';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import { connect } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import { useTranslation } from 'react-i18next';
import { config } from '../../../../config/config';
import fillEmpty from '../../../../Utils/fillEmpty';

import { PROPERTY_DETAILS_FIELD_GET } from '../../../../store/property/Actions';
import { PROPERTIES } from '../../../../config/pagesName';
import PercentageProgress from '../PercentageProgress';

const useStyles = makeStyles({
  root: {
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: '#E7E7E7',
    },
  },
  fontSize: '12px',
});


const PropertyCard = ({
  item,
  history,
  getPropertyDetailsFieldResponse,
  getPropertyDetailsResponseFunction,
  setSelectedIdsToMerge,
  checked,
  enableMultiSelect,
}) => {
  const { t } = useTranslation('DataFiles');
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState(false);

  useEffect(() => {
    if (getPropertyDetailsFieldResponse && !details) {
      setIsLoading(false);
      if (Array.isArray(getPropertyDetailsFieldResponse)) setDetails(getPropertyDetailsFieldResponse[0]);
    }
  }, [getPropertyDetailsFieldResponse, details]);
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
            getPropertyDetailsResponseFunction({ id: item.property_id });
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
            {enableMultiSelect && (
            <Grid item xs={1}>
              <Checkbox
                checked={checked}
                onChange={() => setSelectedIdsToMerge(1, item.property_id)}
                value="primary"
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </Grid>
            )}
            <Grid item xs={3}>
              <HomeWork
                style={{
                  width: '60%',
                  height: '60%',
                  marginTop: 18,
                  marginLeft: 10,
                  color: config.theme_primary_color,
                }}
              />
            </Grid>
            <Grid item xs={8}>
              <CardContent style={{ marginTop: 5, marginBottom: -25 }}>
                <Grid container spacing={1}>
                  <Tooltip
                    title={fillEmpty(item.property_name)}
                    aria-label="propertyNameTip"
                    arrow
                  >
                    <Grid item xs={9} className={classes.itemValue}>
                      {fillEmpty(item.property_name)}
                    </Grid>
                  </Tooltip>

                  <Tooltip
                    title={fillEmpty(item.city)}
                    aria-label="cityTip"
                    arrow
                  >
                    <Grid
                      item
                      xs={7}
                      className={`${classes.itemValue} truncateLongTexts`}
                    >
                      {fillEmpty(item.city)}
                    </Grid>
                  </Tooltip>

                  <Grid item xs={12}>
                    <Collapse
                      in={expanded && details}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Grid container spacing={1}>
                        <Grid item xs={5} style={{ fontWeight: 'bold' }}>
                          {t('Property.District')}
                        </Grid>
                        <Tooltip
                          title={fillEmpty(item.district)}
                          aria-label="districtTip"
                          arrow
                        >
                          <Grid
                            item
                            xs={7}
                            className={`${classes.itemValue} truncateLongTexts`}
                          >
                            {fillEmpty(item.district)}
                          </Grid>
                        </Tooltip>

                        <Grid item xs={5} style={{ fontWeight: 'bold' }}>
                          {t('Property.Owner')}
                        </Grid>
                        <Tooltip
                          title={fillEmpty(item.property_owner)}
                          aria-label="propertyOwnerTip"
                          arrow
                        >
                          <Grid
                            item
                            xs={7}
                            className={`${classes.itemValue} truncateLongTexts`}
                          >
                            {fillEmpty(item.property_owner)}
                          </Grid>
                        </Tooltip>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={5} style={{ fontWeight: 'bold' }}>
                          {t('Property.Type')}
                        </Grid>
                        <Tooltip
                          title={fillEmpty(item.property_type)}
                          aria-label="propertyTypeTip"
                          arrow
                        >
                          <Grid
                            item
                            xs={7}
                            className={`${classes.itemValue} truncateLongTexts`}
                          >
                            {fillEmpty(item.property_type)}
                          </Grid>
                        </Tooltip>
                      </Grid>
                      <Grid container spacing={1}>
                        <Grid item xs={5} style={{ fontWeight: 'bold' }}>
                          {t('Property.Developer')}
                        </Grid>
                        <Tooltip
                          title={fillEmpty(item.developer)}
                          aria-label="developerTip"
                          arrow
                        >
                          <Grid
                            item
                            xs={5}
                            className={`${classes.itemValue} truncateLongTexts`}
                          >
                            {fillEmpty(item.developer)}
                          </Grid>
                        </Tooltip>
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
                          <Tooltip title={t('Property.Edit')} aria-label="edit">
                            <Fab
                              style={{
                                backgroundColor: config.theme_secondary_color,
                                width: 40,
                                height: 40,
                              }}
                              onClick={() => history.push(
                                `/main/edit/${PROPERTIES}/1/${item.property_id}/all`,
                              )}
                            >
                              <EditRounded style={{ color: '#fff' }} />
                            </Fab>
                          </Tooltip>
                          <Tooltip title={t('Property.OpenFiles')} aria-label="openFiles">
                            <Fab
                              style={{
                                backgroundColor: config.theme_primary_color,
                                width: 40,
                                height: 40,
                                marginLeft: 10,
                              }}
                              onClick={() => history.push(
                                `/main/details/${PROPERTIES}/1/${item.property_id}`,
                              )}
                            >
                              <DescriptionRounded style={{ color: '#fff' }} />
                            </Fab>
                          </Tooltip>
                          <Tooltip
                            title={t('Property.MissingData')}
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
                              onClick={() => history.push(
                                `/main/edit/${PROPERTIES}/1/${item.property_id}/missing`,
                              )}
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
    properties: { getPropertyDetailsFieldResponse },
  } = state;
  return {
    getPropertyDetailsFieldResponse,
  };
};
function mapFuncToProps(dispatch) {
  return {
    dispatch,
    getPropertyDetailsResponseFunction: (payload) => dispatch(PROPERTY_DETAILS_FIELD_GET(payload)),
  };
}
export default connect(mapStateToProps, mapFuncToProps)(PropertyCard);
