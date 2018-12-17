import { stringify } from 'qs';
import request from '@/utils/request';

export async function login(params) {
  return request('/yinniapp/api/login/admin/v1/login', {
    method: 'POST',
    body: params,
  });

}

export async function getFakeCaptcha(mobile) {
  return request(`/yinniapp/api/captcha?mobile=${mobile}`);
}
