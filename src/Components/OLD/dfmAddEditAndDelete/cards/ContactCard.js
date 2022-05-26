import React, { useState, useEffect } from "react";
import {
  Collapse,
  Grid,
  Card,
  CardContent,
  Divider,
  Fab,
  Tooltip,
  LinearProgress
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  AccountCircle,
  Business,
  ArrowUpward,
  ArrowDownward,
  EditRounded,
  Description
} from "@material-ui/icons";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Rating from "@material-ui/lab/Rating";
import { config } from "../../../config/config";
import fillEmpty from "../../../utils/fillEmpty";

import { CONTACTS_DETAILS_FIELD_GET } from "../../../store/contacts/Actions";
import { CONTACTS } from "../../../config/pagesName";
import PercentageProgress from "../PercentageProgress";

const useStyles = makeStyles({
  root: {
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#E7E7E7"
    },
    fontSize: "12px"
  },
  RatingStyle: {
    display: "flex",
    flexDirection: "column",
    "& > * + *": {}
  }
});
const StyledRating = withStyles({
  iconFilled: {
    color: "#ff6d75"
  },
  iconHover: {
    color: config.theme_primary_color
  }
})(Rating);

const moment = require("moment");
const ContactCard = ({
  item,
  history,
  getContactsDetailsFieldResponse,
  getContactsDetailsResponseFunction
}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState(false);

  useEffect(() => {
    if (getContactsDetailsFieldResponse && !details) {
      setIsLoading(false);
      if (Array.isArray(getContactsDetailsFieldResponse)) {
        setDetails(getContactsDetailsFieldResponse[0]);
      }
    }
  }, [getContactsDetailsFieldResponse]);
  return (
    <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
      <Card
        className={classes.root}
        onClick={() => {
          setExpanded(!expanded);
          if (!expanded) {
            setDetails(false);
            setIsLoading(true);
            getContactsDetailsResponseFunction({ id: item.contact_id });
          }
          //   history.push(`/main/Editontact/${item.contact_type_id}/${id}`)
        }}
        style={{ width: "100%", padding: 5 }}>
        {isLoading && <LinearProgress color="secondary" />}
        <PercentageProgress dataCompleted={item.data_completed} />
        <Grid container>
          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: -30
            }}>
            {expanded ? <ArrowUpward /> : <ArrowDownward />}
          </Grid>
          <Grid container justify="center" alignItems="center" spacing={3} className="cardFont">
            {/* <CardMedia
                    className={classes.media}
                    image="/assets/images/cards/loginbackground.jpg"
                    title="Contemplative Reptile"
                  /> */}
            <Grid item xs={4}>
              {item.contact_type_id === "1" ? (
                <AccountCircle
                  style={{
                    width: "60%",
                    height: "60%",
                    marginTop: 10,
                    marginLeft: 10,
                    color: config.theme_primary_color
                  }}
                />
              ) : (
                  <Business
                    style={{
                      width: "60%",
                      height: "60%",
                      marginTop: 18,
                      marginLeft: 10,
                      color: config.theme_secondary_color
                    }}
                  />
                )}
            </Grid>
            <Grid item xs={8}>
              <CardContent style={{ marginTop: 0, marginBottom: -25 }}>
                <Grid
                  container
                  spacing={1}
                  style={{ marginLeft: -30, marginTop: -20 }}
                >
                  {item.contact_type_id === "1" && (
                    <>
                      <Tooltip
                        title={`${fillEmpty(item.first_name)} ${fillEmpty(
                          item.last_name
                        )}`}
                        aria-label="fulltNameTip"
                        arrow
                      >
                        <Grid
                          item
                          xs={12}
                          className={`${classes.itemValue} truncateLongTexts`}
                        >
                          {fillEmpty(item.first_name)}{" "}
                          {fillEmpty(item.last_name)}
                        </Grid>
                      </Tooltip>
                    </>
                  )}

                  {item.contact_type_id === "2" && (
                    <>
                      <Tooltip
                        title={fillEmpty(item.company_name)}
                        aria-label="CompanyTip"
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
                    title={fillEmpty(item.general_email)}
                    aria-label="EmailTip"
                    arrow
                  >
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      className={`${classes.itemValue} truncateLongTexts`}
                    >
                      {fillEmpty(item.general_email)}
                    </Grid>
                  </Tooltip>
                  <Grid>
                    <div className={classes.RatingStyle}>
                      <StyledRating name="size-medium" size="small" readOnly />
                    </div>
                  </Grid>

                  <Grid item xs={13} style={{ marginTop: 7 }}>
                    <Collapse
                      in={expanded && details}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Grid container spacing={1}>
                        <Grid item xs={5} style={{ fontWeight: "bold" }}>
                          Creation{" "}
                        </Grid>
                        <Grid item xs={7} className={classes.itemValue}>
                          {fillEmpty(
                            moment(item.created_date).format("DD/MM/YYYY")
                          )}
                        </Grid>

                        <Grid item xs={5} style={{ fontWeight: "bold" }}>
                          Type{" "}
                        </Grid>
                        <Grid item xs={7} className={classes.itemValue}>
                          {item.contact_type_id === "1"
                            ? "Individual"
                            : "Corporate"}
                        </Grid>

                        <Grid item xs={5} style={{ fontWeight: "bold" }}>
                          Nationality
                        </Grid>
                        <Tooltip
                          title={
                            item.contact_type_id === "1"
                              ? fillEmpty(details.nationality)
                              : fillEmpty(
                                details.company_nationality ||
                                details.nationality
                              )
                          }
                          arrow
                        >
                          <Grid
                            item
                            xs={5}
                            className={`${classes.itemValue} truncateLongTexts`}
                          >
                            {item.contact_type_id === "1"
                              ? fillEmpty(details.nationality)
                              : fillEmpty(
                                details.company_nationality ||
                                details.nationality
                              )}
                          </Grid>
                        </Tooltip>

                        <Grid item xs={5} style={{ fontWeight: "bold" }}>
                          Mobile
                        </Grid>
                        <Tooltip title={fillEmpty(details.mobile)} arrow>
                          <Grid
                            item
                            xs={7}
                            className={`${classes.itemValue} truncateLongTexts`}
                          >
                            {fillEmpty(details.mobile)}
                          </Grid>
                        </Tooltip>

                        {item.contact_type_id === "1" && (
                          <>
                            <Grid item xs={5} style={{ fontWeight: "bold" }}>
                              Class
                            </Grid>
                            <Grid item xs={7} className={classes.itemValue}>
                              {fillEmpty(details.contact_class)}
                            </Grid>
                          </>
                        )}

                        {item.contact_type_id === "2" && (
                          <>
                            <Grid item xs={5} style={{ fontWeight: "bold" }}>
                              Class
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
                            width: "95%",
                            margin: 15
                          }}
                          orientation="horizontal"
                        />
                      </Grid>
                      <Grid
                        container
                        spacing={2}
                        justify="center"
                        alignItems="center"
                      >
                        <Grid item xs={12} style={{ marginBottom: 10 }}>
                          <Tooltip title="Edit" aria-label="edit" arrow>
                            <Fab
                              style={{
                                backgroundColor: config.theme_secondary_color,
                                width: 40,
                                height: 40,
                                marginLeft: 20
                              }}
                              onClick={() =>
                                history.push(
                                  `/main/edit/${CONTACTS}/${item.contact_type_id}/${item.contact_id}`
                                )
                              }
                            >
                              <EditRounded style={{ color: "#fff" }} />
                            </Fab>
                          </Tooltip>
                          <Tooltip
                            title="Open Files"
                            aria-label="openFiles"
                            arrow
                          >
                            <Fab
                              style={{
                                backgroundColor: config.theme_secondary_color,
                                width: 40,
                                height: 40,
                                marginLeft: 20
                              }}
                              onClick={() =>
                                history.push(
                                  `/main/details/${CONTACTS}/${item.contact_type_id}/${item.contact_id}`
                                )
                              }
                            >
                              <Description style={{ color: "#fff" }} />
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
ContactCard.propTypes = {
  item: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object),
  getContactsDetailsFieldResponse: PropTypes.instanceOf(Object),
  getContactsDetailsResponseFunction: PropTypes.func
};
const mapStateToProps = state => {
  const {
    contacts: { getContactsDetailsFieldResponse }
  } = state;
  return {
    getContactsDetailsFieldResponse
  };
};

function mapFuncToProps(dispatch) {
  return {
    dispatch,
    getContactsDetailsResponseFunction: payload =>
      dispatch(CONTACTS_DETAILS_FIELD_GET(payload))
  };
}

export default connect(mapStateToProps, mapFuncToProps)(ContactCard);
