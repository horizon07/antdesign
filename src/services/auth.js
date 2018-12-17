import request from '@/utils/request';

export async function login(params) {
  return request('yinniapp/api/login/admin/v1/login', {
    method: 'POST',
    body: params,
  });
}

export async function logout(params) {
  return request('yinniapp/api/login/admin/v1/logout', {
    method: 'POST',
    body: params,
  });
}

export async function getMe() {
  return request('yinniapp/api/login/admin/v1/refresh');
}

export async function updateMe(params) {
  return request('yinniapp/api/account/admin/v1/updateuserinfo', {
    method: 'POST',
    body: params,
  });
}

export async function updatePassword(params) {
  return request('/yinniapp/api/account/admin/v1/updatepwd', {
    method: 'POST',
    body: params,
  });
}
