import React from 'react';
import {
  Card, Typography, Grid, IconButton, Tooltip, Fab
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import DeleteDialog from '../BusinessGroupsDialogs/DeleteDialog';
import { BusinessGroupsPermissions } from '../../../../../../Permissions';
import { PermissionsComponent } from '../../../../../../Components';

const Genealogy = (props) => {
  const { t } = useTranslation('BusinessGroupsView');
  const [deletedName, setDeletedName] = React.useState('');
  const [deletedId, setDeletedId] = React.useState(0);
  const [deleteDialog, setDeleteDialog] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);

  const getChildByPairantId = (id) => {
    if (props.response && props.response.result)
      return props.response.result.filter((w) => w.businessGroupsParentId === id);
    return [];
  };

  return (
    <>
      {props.isVisible && props.Parent !== null && (
        <li>
          <div
            className={
              props.searchNode &&
                Array.isArray(props.searchNode) &&
                props.searchNode.find((el) => el.businessGroupsId === props.Parent.businessGroupsId) ?
                'searchedCard member-view-box' :
                'member-view-box'
            }
          >
            <div className='member-card no-bottom'>
              <Card
                className='cardControl'
                onClick={() =>
                (getChildByPairantId(props.Parent.businessGroupsId).length > 0 ?
                  setIsVisible(!isVisible) :
                  '')}
              >
                <Grid spacing={3} container direction='row' justify='center' alignItems='center'>
                  <Grid item>
                    <Tooltip title={props.Parent.businessGroupsName}>
                      <Typography className='memberDetails truncateLongTexts'>
                        {props.Parent.businessGroupsName}
                      </Typography>
                    </Tooltip>
                  </Grid>
                  <div className='d-flex-column-center  icon-action'>
                    <PermissionsComponent
                      permissionsList={Object.values(BusinessGroupsPermissions)}
                      permissionsId={BusinessGroupsPermissions.EditRecordCard.permissionsId}
                    >
                      <IconButton size='small top'>
                        <span
                          className='mdi mdi-pencil-outline Edit'
                          title={t('Edit')}
                          onClick={(e) => {
                            e.stopPropagation();
                            props.handleSentData(
                              props.Parent.businessGroupsName,
                              props.Parent.businessGroupsParentName,
                              props.Parent.businessGroupsId,
                              true,
                              props.Parent.businessGroupsParentId
                            );
                            props.setTreeGroup(true);
                            props.setopenAddDialog();
                          }}
                        />

                      </IconButton>
                    </PermissionsComponent>
                    <PermissionsComponent
                      permissionsList={Object.values(BusinessGroupsPermissions)}
                      permissionsId={BusinessGroupsPermissions.DeleteRecordCard.permissionsId}
                    >
                      <IconButton size='small top'>
                        <span
                          className='mdi mdi-trash-can-outline Deleted '
                          title={t('Delete')}
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletedId(props.Parent.businessGroupsId);
                            setDeletedName(props.Parent.businessGroupsName);
                            setDeleteDialog(true);
                          }}
                        />
                      </IconButton>
                    </PermissionsComponent>
                  </div>
                </Grid>
                <Grid container justify='center' className='collapseIcon'>
                  <Grid item>
                    {isVisible ? (
                      ''
                    ) : (
                      <div
                        className={
                          isVisible ?
                            'triangleDown flex-the-action' :
                            'triangleDown flex-the-action-open'
                        }
                      >
                        <Fab size='small' color='primary' aria-label='add' className=''>
                          <span className='mdi mdi-chevron-down icon-arrow' />
                        </Fab>
                      </div>
                    )}
                  </Grid>
                  <div className={isVisible ? 'add-bbt add-pt-lock' : 'add-bbt add-pt-open'}>
                    <PermissionsComponent
                      permissionsList={Object.values(BusinessGroupsPermissions)}
                      permissionsId={BusinessGroupsPermissions.AddRecordCard.permissionsId}
                    >
                      <Fab
                        size='small'
                        title={t('Add')}
                        color='primary'
                        aria-label='add'
                        className=''
                        onClick={(e) => {
                          e.stopPropagation();
                          props.handleSentData(
                            props.Parent.businessGroupsName,
                            props.Parent.businessGroupsParentName,
                            props.Parent.businessGroupsId,
                            false,
                            props.Parent.businessGroupsParentId
                          );
                          props.setTreeGroup(true);
                          props.setopenAddDialog();
                        }}
                      >
                        <span className='mdi mdi-plus icon-arrow' />
                      </Fab>
                    </PermissionsComponent>

                  </div>
                </Grid>
              </Card>
            </div>
          </div>
          {isVisible && getChildByPairantId(props.Parent.businessGroupsId).length > 0 && (
            <ul>
              {getChildByPairantId(props.Parent.businessGroupsId).map((item, i) => (
                <Genealogy
                  key={i}
                  searchNode={props.searchNode}
                  isVisible={isVisible}
                  isTree={props.isTree}
                  setTreeGroup={(x) => props.setTreeGroup(x)}
                  reloadData={() => props.reloadData()}
                  Parent={item}
                  response={props.response}
                  handleSentData={props.handleSentData}
                  setopenAddDialog={() => props.setopenAddDialog()}
                />
              ))}
            </ul>
          )}
        </li>
      )}
      <DeleteDialog
        isTree={props.isTree}
        open={deleteDialog}
        close={() => setDeleteDialog(false)}
        deletedId={deletedId}
        name={deletedName}
        reloadData={() => props.reloadData(props.page + 1, props.rowsPerPage, props.searchedItem)}
      />
    </>
  );
};

export default Genealogy;
