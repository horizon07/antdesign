import { stringify } from 'qs';
import request from '@/utils/request';

export async function getAbstract() {
  return request('yinniapp/api/assets/admin/v1/pandect');
}

export async function getLastSevenDaysApplications() {
  return request('yinniapp/api/assets/admin/v1/sevenapplydata');
}

export async function getLastSevenDaysLoans() {
  return request('yinniapp/api/assets/admin/v1/sevenloandata');
}

export async function getCredits() {
  return request('yinniapp/api/assets/admin/v1/newpaymoney');
}

export async function getNewUserRepayments() {
  return request('yinniapp/api/assets/admin/v1/repayplan');
}

export async function getDailyStatistics(params) {
  return request(`yinniapp/api/assets/admin/v1/daily?${stringify(params)}`);
}

export async function getRepaymentAmounts(params) {
  return request(`yinniapp/api/assets/admin/v1/repaymentamount?${stringify(params)}`);
}

export async function getRepaymentNumbers(params) {
  return request(`yinniapp/api/assets/admin/v1/repaymentstroke?${stringify(params)}`);
}

export async function getBills(params) {
  return request(`yinniapp/api/assets/admin/v1/billstatistics?${stringify(params)}`);
}
