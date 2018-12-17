import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { getMe, updateMe, updatePassword, login, logout } from '@/services/auth';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'auth',

  state: {
    me: {},
  },

  effects: {
    *getMe(_, { call, put }) {
      const response = yield call(getMe);

      if (response) {
        yield put({
          type: 'changeMe',
          payload: response.result,
        });
      }

      setAuthority();
      reloadAuthorized();
    },

    *updateMe(_, { call, put }) {
      const response = yield call(updateMe);

      if (response) {
        yield put({
          type: 'changeMe',
          payload: response.result,
        });
      }
    },

    *updatePassword(_, { call }) {
      yield call(updatePassword);
    },

    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);

      if (response) {
        yield put({
          type: 'changeMe',
          payload: response.result,
        });

        // Login successfully
        if (response.success) {
          if (localStorage && response.result && response.result.token) {
            localStorage.setItem('Authorization', response.result.token);
          }

          setAuthority();
          reloadAuthorized();

          const urlParams = new URL(window.location.href);

          let { redirect } = getPageQuery();

          if (redirect) {
            const redirectUrlParams = new URL(redirect);

            if (redirectUrlParams.origin === urlParams.origin) {
              redirect = redirect.substr(urlParams.origin.length);

              if (redirect.match(/^\/.*#/)) {
                redirect = redirect.substr(redirect.indexOf('#') + 1);
              }
            } else {
              window.location.href = redirect;

              return;
            }
          }

          yield put(routerRedux.replace(redirect || '/'));
        }
      }
    },

    *logout(_, { call, put, select }) {
      const account = yield select(state => state.auth.me.account);

      yield call(logout, { account });

      yield put({
        type: 'changeMe',
        payload: {},
      });

      reloadAuthorized();

      yield put(
        routerRedux.push({
          pathname: '/auth/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeMe(state, action) {
      return {
        ...state,
        me: action.payload || {},
      };
    },
  },
};
