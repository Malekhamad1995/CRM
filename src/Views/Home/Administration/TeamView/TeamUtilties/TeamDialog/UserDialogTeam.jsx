import React, { useEffect } from 'react';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import StarIcon from '@material-ui/icons/Star';

import { useTranslation } from 'react-i18next';
import { PropTypes } from 'prop-types';
import {
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  TextField,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  FormControl,
} from '@material-ui/core';
import { OrganizationUserSearch } from '../../../../../../Services/userServices';
import { getDownloadableLink, showError, showSuccess } from '../../../../../../Helper';
import {
  DeleteTeamUserServices,
  PostTeamUserServices,
  SetUserAsTeamLead,
} from '../../../../../../Services/Team';

const UserDialogTeam = ({
 open, close, ClearData, reloadData, teamId, Teamname, UserTeam
}) => {
  const { t } = useTranslation('TeamView');
  const [teamUsersId, setteamUsersId] = React.useState();
  const [usersResponse, setUsersResponse] = React.useState();
  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [searchedItem, setSearchedItem] = React.useState('');
  let time = setTimeout(() => {}, 300);
  const handleToggle = (value) => () => {
    setteamUsersId(value);
    setSelectedIndex(value);
  };

  const handleToggleleft = (value) => () => {
    setteamUsersId(value);
    setSelectedIndex(value);
  };

  const handleSearchLeft = async (name, Datauser) => {
    const SearchResult = await OrganizationUserSearch({ name });
    if (SearchResult && SearchResult.result && Datauser) {
      const result = SearchResult.result.filter(
        (f) => Datauser.result.find((e) => e.usersId === f.id) === undefined
      );
      setUsersResponse(result);
    }
  };
  const usersSearchResponse = async (Datauser) => {
    const SearchResult = await OrganizationUserSearch({});

    if (SearchResult && SearchResult.result && SearchResult.result.length > 0 && Datauser) {
      const result = SearchResult.result.filter(
        (f) => Datauser.result && Datauser.result.find((e) => e.usersId === f.id) === undefined
      );
      setUsersResponse(result);
    }
  };

  useEffect(() => {
    usersSearchResponse(UserTeam);
  }, [UserTeam, teamId]);

  const doneHandle = async () => {
    // save value to api
  };

  const CustomListRight = (items) => (
    <div className='right-list'>
      <div className='list-title'>{Teamname}</div>
      <List className='list-users-right' dense component='div' role='list'>
        {items &&
          items.result &&
          items.result.map((value, i) => (
            <ListItem index={i} role='listitem' button onClick={handleToggle(value)}>
              <ListItemIcon>
                <Avatar
                  alt={value && value.users && value.users.fullName}
                  src={getDownloadableLink(value && value.users && value.users.profileImg)}
                  className='imgUserDialog'
                />
              </ListItemIcon>
              <ListItemText
                id={value && value.usersId}
                primary={value && value.users && value.users.fullName}
              />
              <IconButton
                aria-label='comments'
                label='Add team leader'
                onClick={async () => {
                  const result = await SetUserAsTeamLead({
                    teamId: +value.teamsId,
                    userId: value.usersId,
                  });
                  if (result) {
                    showSuccess(t('UserDialog.addTeamLead'));
                    reloadData();
                  }
                }}
              >
                <StarIcon className={value.isTeamLead ? 'star-color' : ''} />
              </IconButton>

              <IconButton
                aria-label='comments'
                className='DeleteForeverIconUserDialog'
                label={t('UserDialog.titleDelete')}
                onClick={async () => {
               const res = await DeleteTeamUserServices(value.teamUsersId);
                  if (!(res && res.status && res.status !== 200))
                  showSuccess(t('UserDialog.NotificationDeleteTeamUser'));
                  reloadData();
                }}
              >
                <DeleteForeverIcon />
              </IconButton>
            </ListItem>
          ))}
      </List>
    </div>
  );

  const CustomListleft = (items, Datauser) => (
    <div className='left-list'>
      <FormControl className='input-wrapper'>
        <div className='text-field-wrapper'>
          <TextField
            value={searchedItem}
            placeholder={t('UserDialog.labelSearch')}
            className='inputs theme-form-builder '
            size='small'
            fullWidth
            variant='outlined'
            onKeyUp={() => {
              time = setTimeout(() => {
                handleSearchLeft(searchedItem, Datauser);
              }, 700);
            }}
            onKeyDown={() => {
              clearTimeout(time);
            }}
            onChange={(e) => {
              setSearchedItem(e.target.value);
            }}
          />
        </div>
      </FormControl>

      <List className='list-users' dense component='div' role='list'>
        {items &&
          items
            .filter((member) => member.userStatus === 'Active')
            .map((value, i) => (
              <div index={i}>
                {value.fullName && (
                  <ListItem role='listitem' button selected={selectedIndex === value.id}>
                    <ListItemIcon>
                      <Avatar alt={value.fullName} src={getDownloadableLink(value.profileImg)} />
                    </ListItemIcon>
                    <ListItemText
                      onClick={handleToggleleft(value.id)}
                      id={value.id}
                      primary={value.fullName}
                    />
                  </ListItem>
                )}
              </div>
            ))}
      </List>
    </div>
  );

  return (
    <Dialog
      className='TeamDialog'
      keepMounted
      open={open}
      onClose={() => {
        close();
        ClearData();
        reloadData();
      }}
      maxWidth={false}
      disableBackdropClick
    >
      <DialogTitle id='alert-dialog-slide-title'>{t('UserDialog.AssignTeam')}</DialogTitle>
      <DialogContent className='dialog-content'>
        {CustomListleft(usersResponse, UserTeam)}
        <div className='assign-button'>
          <Button
            className='btns theme-solid'
            disabled={selectedIndex === null}
            onClick={async () => {
              const result = await PostTeamUserServices({
                teamsId: +teamId,
                usersId: teamUsersId,
              });
              if (result) {
                setSelectedIndex(null);
                showSuccess(t('UserDialog.NotificationADDTeamUser'));
                handleSearchLeft(searchedItem, UserTeam);
                reloadData();
              } else showError(t('UserDialog.NotificationAddTeamUserFiled'));
            }}
          >
            {t('UserDialog.assign')}
          </Button>
        </div>
        {CustomListRight(UserTeam)}
      </DialogContent>
      <DialogActions>
        <Button
          className='btns theme-solid btns theme-solid bg-cancel'
          onClick={() => {
            doneHandle();
            setSearchedItem('');
            close();
            ClearData();
            reloadData();
            setSelectedIndex(null);
          }}
        >
          {t('UserDialog.Cancel')}
        </Button>
        <Button
          className='btns theme-solid'
          onClick={() => {
            doneHandle();
            setSearchedItem('');
            close();
            ClearData();
            reloadData();
            setSelectedIndex(null);
          }}
        >
          {t('UserDialog.done')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default UserDialogTeam;
UserDialogTeam.propTypes = {
  UserTeam: PropTypes.instanceOf(Object).isRequired,
  open: PropTypes.bool.isRequired,
  close: PropTypes.bool.isRequired,
  ClearData: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
  teamId: PropTypes.number.isRequired,
  Teamname: PropTypes.string.isRequired,
};
