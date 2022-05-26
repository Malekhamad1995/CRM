/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { useState } from 'react';
import {
  IconButton,
  Tooltip,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@material-ui/core';
import DeleteTeamDialog from '../TeamDialog/DeleteTeamDialog';
import EditTeamDialog from '../TeamDialog/EditTeamDialog';
import { Getuserinteam } from '../../../../../../Services/Team';
import UserDialogTeam from '../TeamDialog/UserDialogTeam';
import { AddTeamTreeDialog } from '../TeamDialog/AddTeamTreeDialog';
import { Spinner, PermissionsComponent } from '../../../../../../Components';
import { TeamPermissions } from '../../../../../../Permissions';

const TeamTreeItem = (props) => {
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [title, setitle] = useState();
  const [deletedId, setDeletedId] = useState(0);
  const [businessGroupsId, setbusinessGroupsId] = useState('');
  const [openDialogEDIT, setopenDialogEDIT] = useState(false);
  const [openUserDialog, setopenUserDialog] = useState(false);
  const [userinteam, SetUserinteam] = useState({});
  const [loading, setloading] = useState(false);
  const [indexhover, setindexhover] = useState(false);
  const opencolseDialogEDIT = () => {
    setopenDialogEDIT(true);
  };
  const GetAllUsersInTeam = async (teamsId, pageIndex, pageSize) => {
    setloading(true);
    const DataUser = await Getuserinteam(teamsId, pageIndex, pageSize);
    if (DataUser) SetUserinteam(DataUser);
    setloading(false);
  };
  return (
    <>
      <Spinner isActive={loading} className='spinner-wrapper' />
      <div
        className={`tree-item ${props.className} ${indexhover === props.itemindex ? 'active' : ''}   `}
        onMouseMove={
          () => setindexhover(props.itemindex)
        }
        onMouseLeave={
          () => setindexhover(null)
        }
      >
        <div className='item-name'>
          <span className='mdi mdi-account-outline px-1' />
          {props.teamsName}
        </div>
        <div className='item-actions'>
          <PermissionsComponent
            permissionsList={Object.values(TeamPermissions)}
            permissionsId={TeamPermissions.EditRecordCard.permissionsId}
          >
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setbusinessGroupsId(props.businessGroupsId);
                setDeletedId(props.teamsId);
                setitle(props.teamsName);
                opencolseDialogEDIT();
              }}
            >
              <span className='mdi mdi-pencil-outline' />
            </IconButton>
          </PermissionsComponent>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setitle(props.teamsName);
              setDeletedId(props.teamsId);
              GetAllUsersInTeam(props.teamsId, 1, 30);
              setopenUserDialog(true);
            }}
          >
            <span className='mdi mdi-account-outline' />
          </IconButton>
          <PermissionsComponent
            permissionsList={Object.values(TeamPermissions)}
            permissionsId={TeamPermissions.DeleteRecordCard.permissionsId}
          >
            <div className='delete-icon'>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  setDeletedId(props.teamsId);
                  setitle(props.teamsName);
                  setDeleteDialog(true);
                }}
              >
                <span className='mdi mdi-trash-can-outline' />
              </IconButton>
            </div>
          </PermissionsComponent>
        </div>
      </div>

      <DeleteTeamDialog
        open={deleteDialog}
        reloadData={() => props.reloadData()}
        close={() => setDeleteDialog(false)}
        deletedId={deletedId}
        name={title}
      />
      <EditTeamDialog
        open={openDialogEDIT}
        close={() => setopenDialogEDIT(false)}
        editId={deletedId}
        name={title}
        response={props.response}
        reloadData={() => props.reloadData()}
        businessGroupsId={businessGroupsId}
        setName={(name) => setitle(name)}
        setbusinessGroupsId={(value) => setbusinessGroupsId(value)}
      />
      <UserDialogTeam
        open={openUserDialog}
        close={() => setopenUserDialog(false)}
        Teamname={title}
        UserTeam={userinteam}
        teamId={deletedId}
        reloadData={() => GetAllUsersInTeam(props.teamsId, 1, 30)}
        ClearData={() => SetUserinteam({})}
      />
    </>
  );
};

export const Genealogy = (props) => {
  const [expanded, setExpanded] = useState(false);
  const [AddTeamTreeDialogopen, setAddTeamTreeDialogopen] = useState(false);
  const [title, setTitle] = useState();
  const [businessGroupsId, setBusinessGroupsId] = useState('');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const getChildByPairantId = (id) => {
    if (props.response && props.response)
      return props.response.filter((w) => w.businessGroupsParentId === id);
    return [];
  };

  return (
    <>
      {props.isVisible && props.Parent !== null && (
        <li>
          <div>
            <div className='team-view-tree-wrapper'>
              <Accordion
                className={`team-item-detailes ${expanded && props.Parent.businessGroupsId && props.Parent.teams.length !== 0 ?
                  'is-open' :
                  ''
                  }`}
                expanded={
                  props.searchNode &&
                    props.Parent &&
                    Array.isArray(props.searchNode) &&
                    props.searchNode.find((f) => f.businessGroupsId === props.Parent.businessGroupsId) ?
                    true :
                    expanded && props.Parent.businessGroupsId && props.Parent.teams.length !== 0
                }
                onChange={handleChange(props.Parent.businessGroupsId)}
              >
                <AccordionSummary>
                  <Tooltip title={props.Parent.businessGroupsName}>
                    <div className='team-name'>{props.Parent.businessGroupsName}</div>
                  </Tooltip>
                </AccordionSummary>
                <AccordionDetails>
                  {props.Parent.teams &&
                    props.Parent.teams.map((c, i) => (
                      <TeamTreeItem
                        key={`${i + 1}-team`}
                        itemindex={i}
                        response={props.response}
                        teamsId={c.teamsId}
                        teamsName={c.teamsName}
                        businessGroupsId={c.businessGroupsId}
                        reloadData={() => props.reloadData()}
                        handleSentData={() => props.handleSentData()}
                        setopenAddDialog={() => props.setopenAddDialog()}
                        businessGroupsName={props.Parent.businessGroupsName}
                        businessGroupsParentId={props.Parent.businessGroupsParentId}
                        businessGroupsParentName={props.Parent.businessGroupsParentName}
                        className={
                          props.searchNode &&
                            props.Parent &&
                            Array.isArray(props.searchNode) &&
                            props.searchNode.find((f) => f.teamsId === c.teamsId) ?
                            'searched-node' :
                            ''
                        }
                      />
                    ))}
                </AccordionDetails>
              </Accordion>
              <div className='tree-node-actions'>
                <div className='add-action'>
                  <PermissionsComponent
                    permissionsList={Object.values(TeamPermissions)}
                    permissionsId={TeamPermissions.AddRecordCard.permissionsId}
                  >
                    <IconButton
                      onClick={() => {
                        setTitle(props.Parent.businessGroupsName);
                        setBusinessGroupsId(props.Parent.businessGroupsId);
                        setAddTeamTreeDialogopen(true);
                      }}
                    >
                      <span className='mdi mdi-plus' />
                    </IconButton>
                  </PermissionsComponent>
                </div>
                {props.Parent.teams.length > 0 && (
                  <div className='expand-action'>
                    <IconButton onClick={() => setExpanded(!expanded)}>
                      <span className={`mdi mdi-chevron-${expanded ? 'up' : 'down'}`} />
                    </IconButton>
                  </div>
                )}
              </div>

              {getChildByPairantId(props.Parent.businessGroupsId).length > 0 && (
                <ul>
                  {getChildByPairantId(props.Parent.businessGroupsId).map((item, i) => (
                    <Genealogy
                      key={`${i + 2}-gen`}
                      isVisible
                      Parent={item}
                      isTree={props.isTree}
                      Groupsid={props.Groupsid}
                      response={props.response}
                      searchNode={props.searchNode}
                      handleSentData={props.handleSentData}
                      reloadData={() => props.reloadData()}
                      setTreeGroup={(x) => props.setTreeGroup(x)}
                      setopenAddDialog={() => props.setopenAddDialog()}
                    />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </li>
      )}
      <AddTeamTreeDialog
        name={title}
        open={AddTeamTreeDialogopen}
        businessGroupsid={businessGroupsId}
        reloadData={() => props.reloadData()}
        close={() => setAddTeamTreeDialogopen(false)}
      />
    </>
  );
};
