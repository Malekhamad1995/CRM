
Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.SearchTeamServices = exports.GetTeamServices = exports.GetUserServices = exports.GetUserInTeamServices = exports.PostTeamUserServices = exports.DeleteTeamUserServices = exports.DeleteTeamServices = exports.PostTeamServices = exports.EditTeamServices = exports.GetallBusinessGroupsServices = exports.SearchTeam = exports.GetallBusinessGroups = exports.DeleteTeamUser = exports.PostTeamUser = exports.Getuserinteam = exports.Getuser = exports.EditTeam = exports.PostTeam = exports.DeleteTeam = exports.GetTeam = void 0;

const _axios = _interopRequireDefault(require('axios'));

const _config = require('../config/config');

const _helper = require('../helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const GetTeam = function GetTeam(pageIndex, pageSize, searchItem) {
  let result;
  return regeneratorRuntime.async((_context) => {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(_axios.default.get(''.concat(_config.config.server_address, '/Authorization/Teams/').concat(pageIndex, '/').concat(pageSize, '?search=').concat(searchItem)));

        case 3:
          result = _context.sent;
          return _context.abrupt('return', result.data);

        case 7:
          _context.prev = 7;
          _context.t0 = _context.catch(0);
          (0, _helper.showError)((0, _helper.getTranslate)()('TeamView:NotificationErrorView'));

        case 10:
        case 'end':
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.GetTeam = GetTeam;

const Getuser = function Getuser(pageIndex, pageSize) {
  let result;
  return regeneratorRuntime.async((_context2) => {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(_axios.default.get(''.concat(_config.config.server_address, '/Identity/Account/GetAllOrganizationUser/').concat(pageIndex, '/').concat(pageSize)));

        case 3:
          result = _context2.sent;
          return _context2.abrupt('return', result.data);

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2.catch(0);
          (0, _helper.showError)((0, _helper.getTranslate)()('TeamView:NotificationErrorView'));

        case 10:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.Getuser = Getuser;

const Getuserinteam = function Getuserinteam(teamsId, pageIndex, pageSize) {
  let result;
  return regeneratorRuntime.async((_context3) => {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(_axios.default.get(''.concat(_config.config.server_address, '/Authorization/Teams/GetAllTeamMember/').concat(teamsId, '/').concat(pageIndex, '/').concat(pageSize)));

        case 3:
          result = _context3.sent;
          return _context3.abrupt('return', result);

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3.catch(0);
          (0, _helper.showError)((0, _helper.getTranslate)()('null'));

        case 10:
        case 'end':
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.Getuserinteam = Getuserinteam;

const PostTeamUser = function PostTeamUser(body) {
  let result;
  return regeneratorRuntime.async((_context4) => {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(_axios.default.post(''.concat(_config.config.server_address, '/Authorization/Teams/AddUserForTeams'), body));

        case 3:
          result = _context4.sent;
          return _context4.abrupt('return', result.data);

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4.catch(0);
          (0, _helper.showError)((0, _helper.getTranslate)()('null'));

        case 10:
        case 'end':
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.PostTeamUser = PostTeamUser;

const DeleteTeamUser = function DeleteTeamUser(teamUsersId) {
  let result;
  return regeneratorRuntime.async((_context5) => {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(_axios.default.delete(''.concat(_config.config.server_address, '/Authorization/Teams/RemoveUserFromTeams/').concat(teamUsersId)));

        case 3:
          result = _context5.sent;
          return _context5.abrupt('return', result.data);

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5.catch(0);
          (0, _helper.showError)((0, _helper.getTranslate)()('TeamView:DeleteDialog.NotificationErrorDelete'));

        case 10:
        case 'end':
          return _context5.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.DeleteTeamUser = DeleteTeamUser;

const DeleteTeam = function DeleteTeam(teamsId) {
  let result;
  return regeneratorRuntime.async((_context6) => {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(_axios.default.delete(''.concat(_config.config.server_address, '/Authorization/Teams/').concat(teamsId)));

        case 3:
          result = _context6.sent;
          return _context6.abrupt('return', result.data);

        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6.catch(0);
          (0, _helper.showError)((0, _helper.getTranslate)()('TeamView:DeleteDialog.NotificationErrorDelete'));

        case 10:
        case 'end':
          return _context6.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.DeleteTeam = DeleteTeam;

const PostTeam = function PostTeam(body) {
  let result;
  return regeneratorRuntime.async((_context7) => {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(_axios.default.post(''.concat(_config.config.server_address, '/Authorization/Teams'), body));

        case 3:
          result = _context7.sent;
          return _context7.abrupt('return', result.data);

        case 7:
          _context7.prev = 7;
          _context7.t0 = _context7.catch(0);
          (0, _helper.showError)((0, _helper.getTranslate)()('TeamView:AddTeamDialog.NotificationErrorAdd'));

        case 10:
        case 'end':
          return _context7.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.PostTeam = PostTeam;

const EditTeam = function EditTeam(teamsId, body) {
  let result;
  return regeneratorRuntime.async((_context8) => {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap(_axios.default.put(''.concat(_config.config.server_address, '/Authorization/Teams/').concat(teamsId), body));

        case 3:
          result = _context8.sent;
          return _context8.abrupt('return', result.data);

        case 7:
          _context8.prev = 7;
          _context8.t0 = _context8.catch(0);
          (0, _helper.showError)((0, _helper.getTranslate)()('TeamView:EditTeamDialog.NotificationEditTeam'));

        case 10:
        case 'end':
          return _context8.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.EditTeam = EditTeam;

const GetallBusinessGroups = function GetallBusinessGroups(body) {
  let result;
  return regeneratorRuntime.async((_context9) => {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap(_axios.default.get(''.concat(_config.config.server_address, '/Authorization/BusinessGroups'), body));

        case 3:
          result = _context9.sent;
          return _context9.abrupt('return', result.data);

        case 7:
          _context9.prev = 7;
          _context9.t0 = _context9.catch(0);
          (0, _helper.showError)((0, _helper.getTranslate)()('BusinessGroupsView:.AddDialog.NotificationErrorAdd'));

        case 10:
        case 'end':
          return _context9.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.GetallBusinessGroups = GetallBusinessGroups;

const SearchTeam = function SearchTeam(pageIndex, pageSize, search) {
  let result;
  return regeneratorRuntime.async((_context10) => {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _context10.next = 3;
          return regeneratorRuntime.awrap(_axios.default.get(''.concat(_config.config.server_address, '/Authorization/Teams/').concat(pageIndex, '/').concat(pageSize, '/').concat(search)));

        case 3:
          result = _context10.sent;
          return _context10.abrupt('return', result.data);

        case 7:
          _context10.prev = 7;
          _context10.t0 = _context10.catch(0);
          (0, _helper.showError)((0, _helper.getTranslate)()('TeamView: ... search'));

        case 10:
        case 'end':
          return _context10.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // /////////////////////////////////////////////////////////////////////
// /--Services


exports.SearchTeam = SearchTeam;

const GetTeamServices = function GetTeamServices(pageIndex, pageSize, searchItem) {
  let result;
  return regeneratorRuntime.async((_context11) => {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _context11.next = 3;
          return regeneratorRuntime.awrap(_axios.default.get(''.concat(_config.config.server_address, '/Authorization/Teams/').concat(pageIndex, '/').concat(pageSize, '?search=').concat(searchItem)));

        case 3:
          result = _context11.sent;
          return _context11.abrupt('return', result.data);

        case 7:
          _context11.prev = 7;
          _context11.t0 = _context11.catch(0);
          (0, _helper.showError)((0, _helper.getTranslate)()('TeamView:NotificationErrorView'));

        case 10:
        case 'end':
          return _context11.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.GetTeamServices = GetTeamServices;

const GetUserServices = function GetUserServices(pageIndex, pageSize) {
  let result;
  return regeneratorRuntime.async((_context12) => {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          _context12.next = 3;
          return regeneratorRuntime.awrap(_axios.default.get(''.concat(_config.config.server_address, '/Identity/Account/GetAllOrganizationUser/').concat(pageIndex, '/').concat(pageSize)));

        case 3:
          result = _context12.sent;
          return _context12.abrupt('return', result.data);

        case 7:
          _context12.prev = 7;
          _context12.t0 = _context12.catch(0);
          (0, _helper.showError)((0, _helper.getTranslate)()('TeamView:NotificationErrorView'));

        case 10:
        case 'end':
          return _context12.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.GetUserServices = GetUserServices;

const GetUserInTeamServices = function GetUserInTeamServices(teamsId, pageIndex, pageSize) {
  let result;
  return regeneratorRuntime.async((_context13) => {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          _context13.next = 3;
          return regeneratorRuntime.awrap(_axios.default.get(''.concat(_config.config.server_address, '/Authorization/Teams/GetAllTeamMember/').concat(teamsId, '/').concat(pageIndex, '/').concat(pageSize)));

        case 3:
          result = _context13.sent;
          return _context13.abrupt('return', result);

        case 7:
          _context13.prev = 7;
          _context13.t0 = _context13.catch(0);
          (0, _helper.showError)((0, _helper.getTranslate)()('null'));

        case 10:
        case 'end':
          return _context13.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.GetUserInTeamServices = GetUserInTeamServices;

const PostTeamUserServices = function PostTeamUserServices(body) {
  let result;
  return regeneratorRuntime.async((_context14) => {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          _context14.next = 3;
          return regeneratorRuntime.awrap(_axios.default.post(''.concat(_config.config.server_address, '/Authorization/Teams/AddUserForTeams'), body));

        case 3:
          result = _context14.sent;
          return _context14.abrupt('return', result.data);

        case 7:
          _context14.prev = 7;
          _context14.t0 = _context14.catch(0);
          (0, _helper.showError)((0, _helper.getTranslate)()('null'));

        case 10:
        case 'end':
          return _context14.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.PostTeamUserServices = PostTeamUserServices;

const DeleteTeamUserServices = function DeleteTeamUserServices(teamUsersId) {
  let result;
  return regeneratorRuntime.async((_context15) => {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          _context15.next = 3;
          return regeneratorRuntime.awrap(_axios.default.delete(''.concat(_config.config.server_address, '/Authorization/Teams/RemoveUserFromTeams/').concat(teamUsersId)));

        case 3:
          result = _context15.sent;
          return _context15.abrupt('return', result.data);

        case 7:
          _context15.prev = 7;
          _context15.t0 = _context15.catch(0);
          (0, _helper.showError)((0, _helper.getTranslate)()('TeamView:DeleteDialog.NotificationErrorDelete'));

        case 10:
        case 'end':
          return _context15.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.DeleteTeamUserServices = DeleteTeamUserServices;

const DeleteTeamServices = function DeleteTeamServices(teamsId) {
  let result;
  return regeneratorRuntime.async((_context16) => {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _context16.prev = 0;
          _context16.next = 3;
          return regeneratorRuntime.awrap(_axios.default.delete(''.concat(_config.config.server_address, '/Authorization/Teams/').concat(teamsId)));

        case 3:
          result = _context16.sent;
          return _context16.abrupt('return', result.data);

        case 7:
          _context16.prev = 7;
          _context16.t0 = _context16.catch(0);
          (0, _helper.showError)((0, _helper.getTranslate)()('TeamView:DeleteDialog.NotificationErrorDelete'));

        case 10:
        case 'end':
          return _context16.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.DeleteTeamServices = DeleteTeamServices;

const PostTeamServices = function PostTeamServices(body) {
  let result;
  return regeneratorRuntime.async((_context17) => {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          _context17.prev = 0;
          _context17.next = 3;
          return regeneratorRuntime.awrap(_axios.default.post(''.concat(_config.config.server_address, '/Authorization/Teams'), body));

        case 3:
          result = _context17.sent;
          return _context17.abrupt('return', result.data);

        case 7:
          _context17.prev = 7;
          _context17.t0 = _context17.catch(0);
          (0, _helper.showError)((0, _helper.getTranslate)()('TeamView:AddTeamDialog.NotificationErrorAdd'));

        case 10:
        case 'end':
          return _context17.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.PostTeamServices = PostTeamServices;

const EditTeamServices = function EditTeamServices(teamsId, body) {
  let result;
  return regeneratorRuntime.async((_context18) => {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          _context18.prev = 0;
          _context18.next = 3;
          return regeneratorRuntime.awrap(_axios.default.put(''.concat(_config.config.server_address, '/Authorization/Teams/').concat(teamsId), body));

        case 3:
          result = _context18.sent;
          return _context18.abrupt('return', result.data);

        case 7:
          _context18.prev = 7;
          _context18.t0 = _context18.catch(0);
          (0, _helper.showError)((0, _helper.getTranslate)()('TeamView:EditTeamDialog.NotificationEditTeam'));

        case 10:
        case 'end':
          return _context18.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.EditTeamServices = EditTeamServices;

const GetallBusinessGroupsServices = function GetallBusinessGroupsServices(body) {
  let result;
  return regeneratorRuntime.async((_context19) => {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          _context19.prev = 0;
          _context19.next = 3;
          return regeneratorRuntime.awrap(_axios.default.get(''.concat(_config.config.server_address, '/Authorization/BusinessGroups'), body));

        case 3:
          result = _context19.sent;
          return _context19.abrupt('return', result.data);

        case 7:
          _context19.prev = 7;
          _context19.t0 = _context19.catch(0);
          (0, _helper.showError)((0, _helper.getTranslate)()('BusinessGroupsView:.AddDialog.NotificationErrorAdd'));

        case 10:
        case 'end':
          return _context19.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.GetallBusinessGroupsServices = GetallBusinessGroupsServices;

const SearchTeamServices = function SearchTeamServices(pageIndex, pageSize, search) {
  let result;
  return regeneratorRuntime.async((_context20) => {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          _context20.prev = 0;
          _context20.next = 3;
          return regeneratorRuntime.awrap(_axios.default.get(''.concat(_config.config.server_address, '/Authorization/Teams/').concat(pageIndex, '/').concat(pageSize, '/').concat(search)));

        case 3:
          result = _context20.sent;
          return _context20.abrupt('return', result.data);

        case 7:
          _context20.prev = 7;
          _context20.t0 = _context20.catch(0);
          (0, _helper.showError)((0, _helper.getTranslate)()('TeamView: ... search'));

        case 10:
        case 'end':
          return _context20.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.SearchTeamServices = SearchTeamServices;
