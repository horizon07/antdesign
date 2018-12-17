import { stringify } from 'qs';
import request from '@/utils/request';

export async function getUsers(params) {
  return request(`yinniapp/api/account/admin/v1/userPage?${stringify(params)}`);
}

export async function createUser(params) {
  return request('yinniapp/api/account/admin/v1/addUser', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateUser(params) {
  return request('yinniapp/api/account/admin/v1/updateUser', {
    method: 'POST',
    body: {
      ...params,
      method: 'PATCH',
    },
  });
}

export async function updateUserStatus(params) {
  return request('yinniapp/api/account/admin/v1/startOrBlockUser', {
    method: 'POST',
    body: {
      ...params,
      method: 'PATCH',
    },
  });
}

export async function getTitles() {
  return request('yinniapp/api/account/admin/v1/positionList');
}

export async function getManagers(params) {
  return request(`yinniapp/api/account/admin/v1/leaderList?${stringify(params)}`);
}

export async function getRoles() {
  return request('yinniapp/api/account/admin/v1/roleList');
}

export async function createRole(params) {
  return request('yinniapp/api/account/admin/v1/addrole', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateRole(params) {
  return request('yinniapp/api/account/admin/v1/updaterole', {
    method: 'POST',
    body: {
      ...params,
      method: 'PATCH',
    },
  });
}

export async function getRoleUsers(params) {
  return request(`yinniapp/api/account/admin/v1/userListByRole?${stringify(params)}`);
}

export async function getRolePermissions(params) {
  return request(`yinniapp/api/account/admin/v1/rightListByRole?${stringify(params)}`);
}
