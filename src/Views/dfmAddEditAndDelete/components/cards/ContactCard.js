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
import { connect } from 'react-redux';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
  AccountCircle,
  Business,
  ArrowUpward,
  ArrowDownward,
  EditRounded,
  Description,
} from '@material-ui/icons';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import PropTypes from 'prop-types';
import Rating from '@material-ui/lab/Rating';
import Checkbox from '@material-ui/core/Checkbox';
import { useTranslation } from 'react-i18next';
import PercentageProgress from '../PercentageProgress';
import { CONTACTS } from '../../../../config/pagesName';
import { CONTACTS_DETAILS_FIELD_GET } from '../../../../store/contacts/Actions';
import { config } from '../../../../config/config';
// import titleCase from '../../utils/titleCase';
import fillEmpty from '../../../../Utils/fillEmpty';

const useStyles = makeStyles({
  root: {
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: '#E7E7E7',
    },
    fontSize: '12px',
  },
  RatingStyle: {
    display: 'flex',
    flexDirection: 'column',
    '& > * + *': {
    },
  },

});
const StyledRating = withStyles({
  iconFilled: {
    color: '#ff6d75',
  },
  iconHover: {
    color: config.theme_primary_color,
  },
})(Rating);

const moment = require('moment');

const ContactCard = ({
  item,
  history,
  getContactsDetailsFieldResponse,
  getContactsDetailsResponseFunction,
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
    if (getContactsDetailsFieldResponse && !details) {
      setIsLoading(false);
      if (Array.isArray(getContactsDetailsFieldResponse))
        setDetails(getContactsDetailsFieldResponse[0]);
    }
  }, [getContactsDetailsFieldResponse]);
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
            getContactsDetailsResponseFunction({ id: item.contact_id });
          }
          //   history.push(`/main/Editontact/${item.contact_type_id}/${id}`)
        }}
        style={{ width: '100%', padding: 5 }}
      >
        {isLoading && <LinearProgress color='secondary' />}
        <PercentageProgress dataCompleted={item.data_completed} />
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
          <Grid container justify='center' alignItems='center' spacing={3}>
            {enableMultiSelect && (
            <Grid item xs={1}>
              <Checkbox
                checked={checked}
                onChange={() => setSelectedIdsToMerge(item.contact_type_id, item.contact_id)}
                value='primary'
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </Grid>
            )}
            <Grid item xs={3}>
              {item.contact_type_id === '1' ? (
                <AccountCircle
                  style={{
                    width: '60%',
                    height: '60%',
                    marginTop: 10,
                    marginLeft: 10,
                    color: config.theme_primary_color,
                  }}
                />
              ) : (
                <Business
                  style={{
                    width: '60%',
                    height: '60%',
                    marginTop: 10,
                    marginLeft: 10,
                    color: config.theme_secondary_color,
                  }}
                />
              )}
            </Grid>
            <Grid item xs={8}>
              <CardContent style={{ marginTop: 0, marginBottom: -25 }}>
                <Grid container spacing={1} style={{ marginLeft: -30, marginTop: -20 }}>
                  {item.contact_type_id === '1' && (
                    <>
                      <Tooltip
                        title={`${fillEmpty(item.first_name)} ${fillEmpty(
                          item.last_name,
                        )}`}
                        aria-label='fulltNameTip'
                        arrow
                      >
                        <Grid
                          item
                          xs={12}
                          className={`${classes.itemValue} truncateLongTexts`}
                        >
                          {fillEmpty(item.first_name)}
                          {' '}
                          {fillEmpty(item.last_name)}
                        </Grid>
                      </Tooltip>
                    </>
                  )}

                  {item.contact_type_id === '2' && (
                    <>
                      <Tooltip
                        title={fillEmpty(item.company_name)}
                        aria-label='CompanyTip'
                        arrow
                      >
                        <Grid
                          item
                          xs={7}
                          className={`${classes.itemValue} truncateLongTexts`}
                        >
                          {fillEmpty(item.company_name)}
                        </Grid>
                      </Tooltip>
                    </>
                  )}

                  <Tooltip

                    title={item.general_email ? JSON.parse(item.general_email).email : ''}
                    aria-label='EmailTip'
                    arrow
                  >
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      className={`${classes.itemValue} truncateLongTexts`}
                    >
                      {item.general_email ? JSON.parse(item.general_email).email : ''}
                    </Grid>
                  </Tooltip>
                  <Grid>
                    <div className={classes.RatingStyle}>
                      <StyledRating name='size-medium' size='small' readOnly />
                    </div>
                  </Grid>

                  <Grid item xs={13}>
                    <Collapse
                      in={expanded && details}
                      timeout='auto'
                      unmountOnExit
                    >
                      <Grid container spacing={1}>
                        <Grid item xs={5} style={{ fontWeight: 'bold' }}>
                          {t('Contacts.Creation')}
                        </Grid>
                        <Grid item xs={7} className={classes.itemValue}>
                          {fillEmpty(
                            moment(item.created_date).format('DD/MM/YYYY'),
                          )}
                        </Grid>

                        <Grid item xs={5} style={{ fontWeight: 'bold' }}>
                          {t('Contacts.Type')}
                        </Grid>
                        <Grid item xs={7} className={classes.itemValue}>
                          {item.contact_type_id === '1' ?
                            'Individual' :
                            'Corporate'}
                        </Grid>

                        <Grid item xs={5} style={{ fontWeight: 'bold' }}>
                          {t('Contacts.Nationality')}
                        </Grid>
                        <Tooltip
                          title={
                            item.contact_type_id === '1' ?
                              fillEmpty(details.nationality) :
                              fillEmpty(
                                details.company_nationality ||
                                    details.nationality,
                              )
                          }
                          arrow
                        >
                          <Grid
                            item
                            xs={5}
                            className={`${classes.itemValue} truncateLongTexts`}
                          >
                            {item.contact_type_id === '1' ?
                              fillEmpty(details.nationality) :
                              fillEmpty(
                                details.company_nationality ||
                                    details.nationality,
                              )}
                          </Grid>
                        </Tooltip>

                        <Grid item xs={5} style={{ fontWeight: 'bold' }}>
                          {t('Contacts.Mobile')}
                        </Grid>
                        <Tooltip
                          title={details.mobile && JSON.parse(details.mobile) && JSON.parse(details.mobile).phone ?
                            JSON.parse(details.mobile).others ?
                              fillEmpty(`${JSON.parse(details.mobile).phone} ,${JSON.parse(details.mobile).others.join(',')}`) :

                              fillEmpty(`${JSON.parse(details.mobile).phone} `) : fillEmpty(details.mobile)}
                          arrow
                        >
                          <Grid
                            item
                            xs={7}
                            className={`${classes.itemValue} truncateLongTexts`}
                          >
                            {fillEmpty(details.mobile && JSON.parse(details.mobile) && JSON.parse(details.mobile).phone ? fillEmpty(JSON.parse(details.mobile).phone) : fillEmpty(details.mobile))}
                          </Grid>
                        </Tooltip>

                        {item.contact_type_id === '1' && (
                          <>
                            <Grid item xs={5} style={{ fontWeight: 'bold' }}>
                              {t('Contacts.Class')}
                            </Grid>
                            <Grid item xs={7} className={classes.itemValue}>
                              {fillEmpty(details.contact_class)}
                            </Grid>
                          </>
                        )}

                        {item.contact_type_id === '2' && (
                          <>
                            <Grid item xs={5} style={{ fontWeight: 'bold' }}>
                              {t('Contacts.Class')}
                            </Grid>
                            <Grid item xs={7} className={classes.itemValue}>
                              {fillEmpty(details.company_class)}
                            </Grid>
                          </>
                        )}
                      </Grid>
                      <Grid container>
                        <Divider
                          style={{
                            width: '95%',
                            margin: 15,
                          }}
                          orientation='horizontal'
                        />
                      </Grid>
                      <Grid
                        container
                        spacing={1}
                        justify='center'
                        alignItems='center'
                      >
                        <Grid item xs={12} style={{ marginBottom: 10 }}>
                          <Tooltip title={t('Contacts.Edit')} aria-label='edit' arrow>
                            <Fab
                              style={{
                                backgroundColor: config.theme_secondary_color,
                                width: 40,
                                height: 40,
                              }}
                              onClick={() => history.push(
                                `/main/edit/${CONTACTS}/${item.contact_type_id}/${item.contact_id}/all`,
                              )}
                            >
                              <EditRounded style={{ color: '#fff' }} />
                            </Fab>
                          </Tooltip>
                          <Tooltip
                            title={t('Contacts.OpenFiles')}
                            aria-label='openFiles'
                            arrow
                          >
                            <Fab
                              style={{
                                backgroundColor: config.theme_primary_color,
                                width: 40,
                                height: 40,
                                marginLeft: 10,
                              }}
                              onClick={() => history.push(
                                `/main/details/${CONTACTS}/${item.contact_type_id}/${item.contact_id}`,
                              )}
                            >
                              <Description style={{ color: '#fff' }} />
                            </Fab>
                          </Tooltip>
                          <Tooltip
                            title={t('Contacts.MissingData')}
                            aria-label='Missing Data'
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
                                `/main/edit/${CONTACTS}/${item.contact_type_id}/${item.contact_id}/missing`,
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
        {(item.isLead) === 1 ? (
          <Grid class='corner-ribbon bottom-right sticky green shadow'>
            {' '}
            {t('Contacts.Lead')}
          </Grid>
) : <Grid class='corner-ribbon bottom-right sticky' />}
      </Card>
    </Grid>
  );
};
ContactCard.propTypes = {
  item: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object),
  getContactsDetailsFieldResponse: PropTypes.instanceOf(Object),
  getContactsDetailsResponseFunction: PropTypes.func,
};
const mapStateToProps = (state) => {
  const {
    contacts: { getContactsDetailsFieldResponse },
  } = state;
  return {
    getContactsDetailsFieldResponse,
  };
};

function mapFuncToProps(dispatch) {
  return {
    dispatch,
    getContactsDetailsResponseFunction: (payload) => dispatch(CONTACTS_DETAILS_FIELD_GET(payload)),
  };
}

export default connect(mapStateToProps, mapFuncToProps)(ContactCard);
