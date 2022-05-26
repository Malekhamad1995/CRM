import React, { useState, useEffect, useCallback } from 'react';
import {
  Slide, Grid, Button, Grow, Paper, Popper, MenuItem, MenuList,
} from '@material-ui/core';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { GlobalHistory, changeLoading } from '../../../Helper';
import Alert from '../../../Components/dfmAddEditAndDelete/Alert';
import AdvancedSerch from '../../../Common/AdvancedSearch';
import {
  CONTACTS_GET,
  CONTACTS_SEARCH_GET,
  CONTACTS_RESET,
} from '../../../store/contacts/Actions';
import {
  LEAD_GET,
  LEAD_SEARCH_GET,
  LEAD_RESET,
} from '../../../store/lead/Actions';
import {
  PROPERTY_GET,
  PROPERTY_SEARCH_GET,
  PROPERTY_RESET,
} from '../../../store/property/Actions';
import {
  UNIT_GET,
  UNIT_SEARCH_GET,
  UNIT_RESET,
} from '../../../store/unit/Actions';
import ContactCard from './cards/ContactCard';
import LeadCard from './cards/LeadCard';
import PropertyCard from './cards/PropertyCard';
import UnitCard from './cards/UnitCard';
import {
  CONTACTS, PROPERTIES, UNITS, LEADS,
} from '../../../config/pagesName';
import { FORM_RESET } from '../../../store/forms/Actions';
import { ContactList } from './Lists/ContactList';
import { PropertyList } from './Lists/PropertyList';
import { UnitList } from './Lists/UnitList';
import { LeadList } from './Lists/LeadList';
import ImportDfmDialog from "./ImportDfmDialog";

const options = require('../../../config/searchOptions.json');

let epageNumber = 1;
const epageSize = 25;
let currentView = 'grid';

const View = ({
  history,
  getContantsSearchResponse,
  getContactsResponse,
  getContactsFunction,
  getContactsSearchFunction,
  getLeadsSearchResponse,
  getLeadsResponse,
  getPropertySearchResponse,
  getPropertyResponse,
  getUnitsSearchResponse,
  getUnitsResponse,
  getLeadsFunction,
  getLeadsSearchFunction,
  getPropertyFunction,
  getPropertySearchFunction,
  getUnitsFunction,
  getUnitsSearchFunction,
  dispatch,
  addRoute,
  match: { params: { pageName } },
}) => {
  const { t } = useTranslation('DataFiles');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(true);
  const [emptyMsg, setEmptymsg] = useState('');
  const [list, setList] = useState([]);
  const [pageSize] = useState(25);
  const [searchMode, setSearchMode] = useState(false);
  const [searchItem, setSearchItem] = useState(null);
  const [layoutview, setLayoutview] = useState('grid');
  currentView = layoutview;
  const [Response, setResponse] = useState([]);
  const [searchResponse, setsearchResponse] = useState([]);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIdsToMerge, setSelectedIdsToMerge] = useState([]);
  const [enableMultiSelect, setEnableMultiSelect] = useState(false);
  const [selectedFromAction, setSelectedFromAction] = useState(null);
  const [openImportDialog, setOpenImportDialog] = useState(false);

  const setSelected = (type, id) => {
    if (selectedIdsToMerge[0]
        && selectedIdsToMerge[0].id === id
        && selectedIdsToMerge[0].type === type) {
      setSelectedIdsToMerge([null, selectedIdsToMerge[1] ? selectedIdsToMerge[1] : null]);
    } else if (selectedIdsToMerge[1] && selectedIdsToMerge[1].id === id && selectedIdsToMerge[1].type === type) {
      setSelectedIdsToMerge([selectedIdsToMerge[0] ? selectedIdsToMerge[0] : null, null]);
    } else if (!selectedIdsToMerge[0]) {
      setSelectedIdsToMerge([{ type, id }]);
    } else if (selectedIdsToMerge[0].type === type) {
      const newState = [...selectedIdsToMerge];
      if (!selectedIdsToMerge[1]) {
        newState[1] = { type, id };
      } else {
        newState[0] = newState[1];
        newState[1] = { type, id };
      }

      setSelectedIdsToMerge(newState);
    } else {
      setSelectedIdsToMerge([{ type, id }]);
    }
  };
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);


  const callGetAllFunction = () => {
    epageNumber = 1;
    setList([]);
    switch (pageName) {
      case CONTACTS:
        dispatch(FORM_RESET());
        dispatch(CONTACTS_RESET());
        break;
      case PROPERTIES:
        dispatch(PROPERTY_RESET());
        break;
      case UNITS:
        dispatch(UNIT_RESET());
        break;
      case LEADS:
        dispatch(LEAD_RESET());
        break;
      default:
    }

    changeLoading(true);
    setEmptymsg('');

    switch (pageName) {
      case CONTACTS:
        getContactsFunction({ pageNumber: 1, pageSize });
        break;
      case PROPERTIES:
        getPropertyFunction({ pageNumber: 1, pageSize });
        break;
      case UNITS:
        getUnitsFunction({ pageNumber: 1, pageSize });
        break;
      case LEADS:
        getLeadsFunction({ pageNumber: 1, pageSize });
        break;
      default:
    }
  };
  useEffect(() => {
    setEnableMultiSelect(false)
    setSelectedFromAction(null)
    setShowAdvancedSearch(true);
    callGetAllFunction();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      setShowAdvancedSearch(false);
      setTimeout(() => { setShowAdvancedSearch(false); setShowAdvancedSearch(true); }, 1000);
    };
  }, [pageName]);

  const handleSearchRespose = (response, data) => {
    if (response.code === 404) {
      setEmptymsg(response.message);
      setList([]);
    } else if (Array.isArray(data)) {
      setList(data);
    } else {
      setEmptymsg(response);
      setList([]);
    }
  };

  useEffect(() => {
    if (getContantsSearchResponse) {
      setsearchResponse(getContantsSearchResponse);
      handleSearchRespose(getContantsSearchResponse, getContantsSearchResponse.contacts);
    }
    changeLoading(false);
  }, [getContantsSearchResponse]);

  useEffect(() => {
    if (getLeadsSearchResponse) {
      setsearchResponse(getLeadsSearchResponse);
      handleSearchRespose(getLeadsSearchResponse, getLeadsSearchResponse.leads);
    }
    changeLoading(false);
  }, [getLeadsSearchResponse]);

  useEffect(() => {
    if (getPropertySearchResponse) {
      setsearchResponse(getPropertySearchResponse);
      handleSearchRespose(getPropertySearchResponse, getPropertySearchResponse.properties);
    }
    changeLoading(false);
  }, [getPropertySearchResponse]);

  useEffect(() => {
    if (getUnitsSearchResponse) {
      setsearchResponse(getUnitsSearchResponse);
      handleSearchRespose(getUnitsSearchResponse, getUnitsSearchResponse.units);
    }
    changeLoading(false);
  }, [getUnitsSearchResponse]);

  const handleResponse = useCallback(
    (response, data) => {
      if (data && Array.isArray(data)) {
        if (epageNumber === 1) {
          setList([...data]);
        } else {
          setList([...list, ...data]);
        }
        setEmptymsg('');
      } else if (response.error && epageNumber === 1) {
        setEmptymsg(response.error.message);
        setList([]);
      } else if (response.code === 404 && epageNumber === 1) {
        setEmptymsg(response.message);
        setList([]);
      }
      else if (response.code === 404 && epageNumber !== 1) {
        epageNumber =epageNumber-1;
      }
      else if (epageNumber === 1) {
        setEmptymsg(response);
        setList([]);
      }
    }, [list],
  );

  useEffect(() => {
    if (getContactsResponse) {
      dispatch(CONTACTS_RESET());
      setResponse(getContactsResponse);
      handleResponse(getContactsResponse, getContactsResponse.contacts);
    }
    changeLoading(false);
  }, [getContactsResponse, dispatch, handleResponse]);

  useEffect(() => {
    if (getLeadsResponse) {
      dispatch(LEAD_RESET());
      setResponse(getLeadsResponse);
      handleResponse(getLeadsResponse, getLeadsResponse.leads);
    }
    changeLoading(false);
  }, [getLeadsResponse, dispatch, handleResponse]);

  useEffect(() => {
    if (getUnitsResponse) {
      setResponse(getUnitsResponse);
      dispatch(UNIT_RESET());
      handleResponse(getUnitsResponse, getUnitsResponse.units);
    }
    changeLoading(false);
  }, [getUnitsResponse, dispatch, handleResponse]);

  useEffect(() => {
    if (getPropertyResponse) {
      dispatch(PROPERTY_RESET());
      setResponse(getPropertyResponse);
      handleResponse(getPropertyResponse, getPropertyResponse.properties);
    }
    changeLoading(false);
  }, [getPropertyResponse, dispatch, handleResponse]);

  const handleScroll = () => {
    // console.log(parseInt(window.innerHeight + document.documentElement.scrollTop) );
    // console.log(document.documentElement.scrollHeight );
    if (parseInt(window.innerHeight + document.documentElement.scrollTop) !== document.documentElement.scrollHeight || currentView === 'list') return;
    epageNumber += 1;
    changeLoading(true);
    if (searchMode) {
      if (pageName === CONTACTS) {
        const body = { contact: { ...searchItem }, pageNumber: epageNumber, pageSize: epageSize };
        getContactsSearchFunction({ body });
      } else if (pageName === LEADS) {
        const body = { lead: { ...searchItem } };
        getLeadsSearchFunction(body);
      } else if (pageName === PROPERTIES) {
        const body = { property: { ...searchItem } };
        getPropertySearchFunction(body);
      } else if (pageName === UNITS) {
        const body = { unit: { ...searchItem } };
        getUnitsSearchFunction(body);
      }
    } else {
      switch (pageName) {
        case CONTACTS:
          dispatch(CONTACTS_GET({ pageNumber: epageNumber, pageSize: epageSize }));
          break;
        case PROPERTIES:
          dispatch(PROPERTY_GET({ pageNumber: epageNumber, pageSize: epageSize }));
          break;
        case UNITS:
          dispatch(UNIT_GET({ pageNumber: epageNumber, pageSize: epageSize }));
          break;
        case LEADS:
          dispatch(LEAD_GET({ pageNumber: epageNumber, pageSize: epageSize }));
          break;
        default:
      }
    }
  };
  return (
    <>
      {addRoute && (
      <div className="addButtonContainer">
        <Grid container item xs={12} spacing={1}>
          <Grid item xs={12} sm={6}>
            <div className="d-inline-block">
              <div className="d-inline-block">
                <Button
                  variant="outlined"
                  color="secondary"
                  className="addButton"
                  disabled={enableMultiSelect && selectedFromAction === 'merge' && selectedIdsToMerge.length !== 2}
                  onClick={() => {
                    if (enableMultiSelect && selectedFromAction === 'merge') {
                        GlobalHistory.push(`/main/merge/${pageName}/${selectedIdsToMerge[0].type}/${selectedIdsToMerge[0].id}/${selectedIdsToMerge[1].id}`);
                    }else if (selectedFromAction === 'import'){
                      setOpenImportDialog(true)
                    } else {
                      const newAddRoute = addRoute.replace(':pageName', pageName);
                      GlobalHistory.push(newAddRoute);
                    }
                  }}
                >
                  {selectedFromAction ? selectedFromAction : t('View.Add")}
                </Button>
              </div>
              {(pageName !== LEADS
                && (
                  <div className="buttonshedaer">
                    <Button
                      className="Buttonoption"
                      ref={anchorRef}
                      aria-controls={open ? 'menu-list-grow' : undefined}
                      onClick={handleToggle}
                    >
                      {t('View.Actions")}&nbsp;
                      {' '}
                      {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </Button>
                    <Popper
                      open={open}
                      anchorEl={anchorRef.current}
                      role={undefined}
                      transition
                      disablePortal
                      style={{ zIndex: '10' }}
                    >
                      {({ TransitionProps, placement }) => (
                        <Grow
                          {...TransitionProps}
                          style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                        >
                          <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                              <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown} className="MenuItem_button">
                                <MenuItem>
                                  <FormControlLabel
                                    control={(
                                      <Checkbox
                                        value="merge"
                                        checked={selectedFromAction === 'merge'}
                                        onClick={(event) => {
                                          if (event.target.checked) setSelectedFromAction(event.target.value);
                                          else setSelectedFromAction(null);
                                          setEnableMultiSelect(!enableMultiSelect);
                                          handleClose(event);
                                        }}

                                      />
)}
                                    label={t('View.Merge")}
                                  />
                                </MenuItem>
                                <MenuItem>
                                  <FormControlLabel
                                    control={(
                                      <Checkbox
                                        value="import"
                                        checked={selectedFromAction === 'import'}
                                        onClick={(event) => {
                                          if (event.target.checked) setSelectedFromAction(event.target.value);
                                          else setSelectedFromAction(null);
                                          handleClose(event);
                                        }}
                                      />
)}
                                    label={t('View.Import")}
                                  />
                                </MenuItem>
                              </MenuList>
                            </ClickAwayListener>
                          </Paper>
                        </Grow>
                      )}
                    </Popper>
                  </div>
                )
            )}
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            { showAdvancedSearch && (
              <AdvancedSerch
                open={showAdvancedSearch}
                setOpen={setShowAdvancedSearch}
                options={options[pageName]}
                layoutview={layoutview}
                setLayoutview={setLayoutview}
                callallfunction={callGetAllFunction}
                setSearchMode={setSearchMode}
                onClick={(items) => {
                  setSearchItem(items);
                  setSearchMode(true);
                  if (pageName === CONTACTS) {
                    const body = { contact: { ...items }, pageNumber: epageNumber, pageSize: epageSize };
                    getContactsSearchFunction({ body });
                  } else if (pageName === LEADS) {
                    const body = { lead: { ...items } };
                    getLeadsSearchFunction({ body });
                  } else if (pageName === PROPERTIES) {
                    const body = { property: { ...items } };
                    getPropertySearchFunction({ body });
                  } else if (pageName === UNITS) {
                    const body = { unit: { ...items } };
                    getUnitsSearchFunction({ body });
                  }
                  setEmptymsg('');
                  changeLoading(true);
                }}
              />
            )}
          </Grid>

        </Grid>
      </div>
      )}
      <Slide direction="down" in={list.length > 0}>
        <div style={{ flexGrow: 1 }}>
          <Grid container spacing={3}>
            {list
              && Array.isArray(list)
              && layoutview === 'grid'
              && list.map((item, index) => {
                if (item) {
                  if (pageName === CONTACTS) {
                    return (
                      <ContactCard
                        key={index}
                        item={item}
                        history={history}
                        enableMultiSelect={enableMultiSelect}
                        setSelectedIdsToMerge={setSelected}
                        checked={selectedIdsToMerge.filter((i) => i && i.id === item.contact_id).length > 0}
                      />
                    );
                  }
                  if (pageName === PROPERTIES) {
                    return (
                      <PropertyCard
                        key={index}
                        item={item}
                        history={history}
                        enableMultiSelect={enableMultiSelect}
                        setSelectedIdsToMerge={setSelected}
                        checked={selectedIdsToMerge.filter((i) => i && i.id === item.property_id).length > 0}
                      />
                    );
                  }

                  if (pageName === UNITS) {
                    return (
                      <UnitCard
                        key={index}
                        item={item}
                        history={history}
                        enableMultiSelect={enableMultiSelect}
                        setSelectedIdsToMerge={setSelected}
                        checked={selectedIdsToMerge.filter((i) => i && i.id === item.unit_id).length > 0}
                      />
                    );
                  }
                  if (pageName === LEADS) {
                    return (
                      <LeadCard
                        key={index}
                        item={item}
                        history={history}
                        enableMultiSelect={enableMultiSelect}
                        setSelectedIdsToMerge={setSelected}
                        checked={selectedIdsToMerge.filter((i) => i && i.id === item.lead_id).length > 0}
                      />
                    );
                  }
                  return item;
                }
                return item;
              })}

            {pageName === CONTACTS
            && layoutview === 'list'
            && Response
            && (
            <ContactList
              response={searchMode ? searchResponse : Response}
              changeLoading={changeLoading}
              Action={(pagesize, pageIndex) => { dispatch(CONTACTS_GET({ pageNumber: pageIndex, pageSize: pagesize })); }}
              enableMultiSelect={enableMultiSelect}
              setSelectedIdsToMerge={setSelected}
              checked={selectedIdsToMerge}
            />
            )}

            {pageName === PROPERTIES
            && layoutview === 'list'
            && Response
            && (
            <PropertyList
              response={searchMode ? searchResponse : Response}
              changeLoading={changeLoading}
              Action={(pagesize, pageIndex) => { dispatch(PROPERTY_GET({ pageNumber: pageIndex, pageSize: pagesize })); }}
              enableMultiSelect={enableMultiSelect}
              setSelectedIdsToMerge={setSelected}
              selectedIdsToMerge={selectedIdsToMerge}
            />
            )}
            {pageName === UNITS
            && layoutview === 'list'
            && Response
            && (
            <UnitList
              response={searchMode ? searchResponse : Response}
              changeLoading={changeLoading}
              Action={(pagesize, pageIndex) => { dispatch(UNIT_GET({ pageNumber: pageIndex, pageSize: pagesize })); }}
              enableMultiSelect={enableMultiSelect}
              setSelectedIdsToMerge={setSelected}
              selectedIdsToMerge={selectedIdsToMerge}
            />
            )}

            {pageName === LEADS
            && layoutview === 'list'
            && Response
            && (
            <LeadList
              response={searchMode ? searchResponse : Response}
              changeLoading={changeLoading}
              Action={(pagesize, pageIndex) => { dispatch(LEAD_GET({ pageNumber: pageIndex, pageSize: pagesize })); }}
              enableMultiSelect={enableMultiSelect}
              setSelectedIdsToMerge={setSelected}
              selectedIdsToMerge={selectedIdsToMerge}
            />
            )}
          </Grid>
        </div>
      </Slide>
        <ImportDfmDialog
        open={openImportDialog}
        setOpen={setOpenImportDialog}
        dfmPage={pageName}/>
      {(emptyMsg !== '' || list.length > 0) && <Alert msg={emptyMsg} />}
    </>
  );
};
View.propTypes = {
  history: PropTypes.instanceOf(Object),
  getContantsSearchResponse: PropTypes.instanceOf(Object),
  getContactsResponse: PropTypes.instanceOf(Object),
  getContactsFunction: PropTypes.func,
  getContactsSearchFunction: PropTypes.func,
  dispatch: PropTypes.instanceOf(Object),
};
const mapStateToProps = (state) => {
  const {
    contacts: {
      getContantsSearchResponse,
      getContactsResponse,
    },
    leads: {
      getLeadsSearchResponse,
      getLeadsResponse,
    },
    properties: {
      getPropertySearchResponse,
      getPropertyResponse,
    },
    units: {
      getUnitsSearchResponse,
      getUnitsResponse,
    },
  } = state;
  return {
    getContantsSearchResponse,
    getContactsResponse,
    getLeadsSearchResponse,
    getLeadsResponse,
    getPropertySearchResponse,
    getPropertyResponse,
    getUnitsSearchResponse,
    getUnitsResponse,
  };
};

function mapFuncToProps(dispatch) {
  return {
    dispatch,
    getContactsFunction: (payload) => dispatch(CONTACTS_GET(payload)),
    getContactsSearchFunction: (payload) => dispatch(CONTACTS_SEARCH_GET(payload)),
    getLeadsFunction: (payload) => dispatch(LEAD_GET(payload)),
    getLeadsSearchFunction: (payload) => dispatch(LEAD_SEARCH_GET(payload)),
    getPropertyFunction: (payload) => dispatch(PROPERTY_GET(payload)),
    getPropertySearchFunction: (payload) => dispatch(PROPERTY_SEARCH_GET(payload)),
    getUnitsFunction: (payload) => dispatch(UNIT_GET(payload)),
    getUnitsSearchFunction: (payload) => dispatch(UNIT_SEARCH_GET(payload)),
  };
}

export default connect(mapStateToProps, mapFuncToProps)(View);
