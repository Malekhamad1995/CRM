import { ContactsPermissions } from '../Permissions'


export const ExceptionPermissionsHelper = () => {
  let userPermissions = localStorage.getItem('session') ;
  if(userPermissions){
  userPermissions = JSON.parse(localStorage.getItem('session')).permissions;
  let  view = false ;
  let edit = false ;
  var array = Object.values(ContactsPermissions);
  var res = userPermissions.filter(item1 =>
    array.some(item2 => (item2.permissionsId === item1.permissionsId)))
    if(res && res.length === 2){
      res.forEach(element => {
        if(element.permissionsId ===  ContactsPermissions.ViewContactInformation.permissionsId)
           view = true ;
           else if(element.permissionsId === ContactsPermissions.EditContactInformation.permissionsId)
           edit = true ;
      });
    }
    if(res && view && edit)
    {
     return true ; 
    }
  return false ; 
}
}

