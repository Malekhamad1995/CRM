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
  DescriptionRounded,
  Contacts,
} from '@material-ui/icons';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import { useTranslation } from 'react-i18next';
import { config } from '../../../../config/config';
import fillEmpty from '../../../../Utils/fillEmpty';
import PercentageCircle from '../PercentageCircle';
import { LEAD_DETAILS_FIELD_GET } from '../../../../store/lead/Actions';
import { LEADS } from '../../../../config/pagesName';
import PercentageProgress from '../PercentageProgress';

const useStyles = makeStyles({
  root: {
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: '#E7E7E7',
    },
    fontSize: '12px',
  },
});


const LeadCard = ({
  item,
  history,
  getLeadsDetailsFieldResponse,
  getLeadsDetailsResponseFunction,
  enableMultiSelect,
  setSelectedIdsToMerge,
  checked,
}) => {
  const { t } = useTranslation('DataFiles');
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState(false);

  useEffect(() => {
    if (getLeadsDetailsFieldResponse && !details) {
      setIsLoading(false);
      if (Array.isArray(getLeadsDetailsFieldResponse))
        setDetails(getLeadsDetailsFieldResponse[0]);
    }
  }, [getLeadsDetailsFieldResponse, details]);
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
            if (item.lead_id) {
              getLeadsDetailsResponseFunction({
                id: item.lead_id,
              });
            } else getLeadsDetailsResponseFunction({ id: item.lead_id });
          }
        }}
        style={{ width: '100%', padding: 5 }}
      >
        {isLoading && <LinearProgress color="secondary" />}
        <PercentageProgress
          dataCompleted={item.data_completed}
        />

        <Grid container>
          <Grid
            item
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
                onChange={() => setSelectedIdsToMerge(item.lead_type_id, item.lead_id)}
                value="primary"
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </Grid>
            )}
            <Grid item xs={3}>
              {item.lead_type_id && `${item.lead_type_id}` === '1' ? (
                <Contacts
                  style={{
                    width: '60%',
                    height: '60%',
                    marginTop: 18,
                    marginLeft: 10,
                    color: config.theme_primary_color,
                  }}
                />
              ) : (
                <Contacts
                  style={{
                    width: '60%',
                    height: '60%',
                    marginTop: 18,
                    marginLeft: 10,
                    color: config.theme_secondary_color,
                  }}
                />
              )}
            </Grid>
            <Grid item xs={8}>
              <CardContent style={{ marginTop: 5, marginBottom: -25 }}>
                <Grid container spacing={1} style={{ marginLeft: -30 }}>

                  <Grid
                    item
                    xs={10}
                    style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginLeft: '17%',
                  }}
                  >
                    <PercentageCircle dataCompleted="" />
                  </Grid>
                  <>
                    <Grid
                      item
                      xs={10}
                      className={`${classes.itemValue} truncateLongTexts`}
                    >
                      {item.contact_name}
                    </Grid>
                  </>

                  {item && item.lead_type_id && `${item.lead_type_id}` === '1' && (
                    <>
                      <Grid item xs={9}>
                        {fillEmpty('Owner')}
                      </Grid>
                    </>
                  )}

                  {item && item.lead_type_id && `${item.lead_type_id}` === '2' && (
                    <>
                      <Grid item xs={9}>
                        {fillEmpty('Seeker')}
                      </Grid>
                    </>
                  )}

                  <Grid item xs={12}>
                    <Collapse
                      in={expanded && details}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Grid container spacing={1}>
                        {`${item.lead_type_id}`
                          === '2' && (
                          <>
                            <Grid item xs={5} style={{ fontWeight: 'bold' }}>
                              {t('Leads.Type')}
                            </Grid>
                            <Grid
                              item
                              xs={7}
                              className={`${classes.itemValue} truncateLongTexts`}
                            >
                              {fillEmpty(item.operation_type)}
                            </Grid>
                          </>
                        )}
                        {`${item.lead_type_id}`
                          === '1' && (
                          <>
                            <>
                              <Grid
                                item
                                xs={5}
                                style={{ fontWeight: 'bold' }}
                              >
                                { item.property_name ? 'property' : 'Unit Number'}

                              </Grid>
                              <Tooltip
                                title={fillEmpty(
                                  item.property_name ? item.property_name : item.property_name_unit_number,
                                )}
                              >
                                <Grid
                                  item
                                  xs={7}
                                  className={`${classes.itemValue} truncateLongTexts`}
                                >
                                  {fillEmpty(
                                    item.property_name ? item.property_name : item.property_name_unit_number,
                                  )}
                                </Grid>
                              </Tooltip>
                            </>

                            {!item.contact_name
                             && (
                               <>
                                 <Grid
                                   item
                                   xs={5}
                                   style={{ fontWeight: 'bold' }}
                                 >
                                   {t('Leads.Property')}
                                 </Grid>
                                 <Grid
                                   item
                                   xs={7}
                                   className={`${classes.itemValue} truncateLongTexts`}
                                 >
                                   {fillEmpty(
                                     item.property_name,
                                   )}
                                 </Grid>
                               </>
                             )}
                          </>
                        )}
                        {item
                          .propertyunit_type && (
                          <>
                              {item
                                .contact_name && (
                                <>
                                  <Grid
                                    item
                                    xs={5}
                                    style={{ fontWeight: 'bold' }}
                                  >
                                    {t('Leads.Required')}
                                  </Grid>
                                  <Grid
                                    item
                                    xs={7}
                                    className={`${classes.itemValue} truncateLongTexts`}
                                  >
                                    {fillEmpty(
                                      JSON.parse(item.propertyunit_type)[0],
                                    )}
                                  </Grid>
                                </>
                              )}

                              {!item
                                .contact_name && (
                                <>
                                  <Grid
                                    item
                                    xs={5}
                                    style={{ fontWeight: 'bold' }}
                                  >
                                    {t('Leads.Required')}
                                  </Grid>
                                  <Grid
                                    item
                                    xs={7}
                                    className={`${classes.itemValue} truncateLongTexts`}
                                  >
                                    {
                                    fillEmpty(
                                      JSON.parse(
                                        item.propertyunit_type,
                                      ),
                                    )[0]
                                  }
                                  </Grid>
                                </>
                              )}
                          </>
                        )}

                        {`${item
                          .lead_type_id}`
                          === '1' && (
                          <>
                            <Grid item xs={5} style={{ fontWeight: 'bold' }}>
                              {t('Leads.LeadOn')}
                            </Grid>
                            <Grid
                              item
                              xs={7}
                              className={`${classes.itemValue} truncateLongTexts`}
                            >
                              {fillEmpty(item
                                .lead_on)}
                            </Grid>
                          </>
                        )}


                        <Grid item xs={5} style={{ fontWeight: 'bold' }}>
                          {t('Leads.Rating')}
                          {' '}
                        </Grid>
                        <Grid
                          item
                          xs={7}
                          className={`${classes.itemValue} truncateLongTexts`}
                        >
                          {fillEmpty(item
                            .rating)}
                        </Grid>

                        <Grid item xs={5} style={{ fontWeight: 'bold' }}>
                          {t('Leads.Status')}
                        </Grid>
                        <Grid
                          item
                          xs={7}
                          className={`${classes.itemValue} truncateLongTexts`}
                        >
                          {fillEmpty(item
                            .status)}
                        </Grid>

                        <Grid item xs={5} style={{ fontWeight: 'bold' }}>
                          {t('Leads.Lead')}
                          {' '}
                        </Grid>
                        <Grid
                          item
                          xs={7}
                          className={`${classes.itemValue} truncateLongTexts`}
                        >
                          {fillEmpty(item
                            .lead_stage)}
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
                          <Tooltip title={t('Leads.Edit')} aria-label="edit" arrow>
                            <Fab
                              style={{
                                backgroundColor: config.theme_secondary_color,
                                width: 40,
                                height: 40,
                              }}
                              onClick={() => {
                                history.push(`/main/edit/${LEADS}/${item.lead_type_id}/${item.lead_id}/all`);
                              }}
                            >
                              <EditRounded style={{ color: '#fff' }} />
                            </Fab>
                          </Tooltip>

                          <Tooltip
                            title={t('Leads.OpenFiles')}
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
                                  `/main/details/${LEADS}/${item.lead_type_id}/${item.lead_id}`,
                                );
                              }}
                            >
                              <DescriptionRounded style={{ color: '#fff' }} />
                            </Fab>
                          </Tooltip>
                          <Tooltip
                            title={t('Leads.MissingData')}
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
                                history.push(`/main/edit/${LEADS}/${item.lead_type_id}/${item.lead_id}/missing`);
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
LeadCard.propTypes = {
  item: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object),
  getLeadsDetailsFieldResponse: PropTypes.instanceOf(Object),
  getLeadsDetailsResponseFunction: PropTypes.func,
};
const mapStateToProps = (state) => {
  const {
    leads: { getLeadsDetailsFieldResponse },
  } = state;
  return {
    getLeadsDetailsFieldResponse,
  };
};
function mapFuncToProps(dispatch) {
  return {
    dispatch,
    getLeadsDetailsResponseFunction: (payload) => dispatch(LEAD_DETAILS_FIELD_GET(payload)),
  };
}
export default connect(mapStateToProps, mapFuncToProps)(LeadCard);
