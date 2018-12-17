import {
  getUsers,
  createUser,
  updateUser,
  updateUserStatus,
  getTitles,
  getManagers,
  getRoles,
  createRole,
  updateRole,
  getRoleUsers,
  getRolePermissions,
} from '@/services/rbac';

export default {
  namespace: 'rbac',

  state: {
    titles: [],
    managers: [],
    roles: [],
    roleUsers: [],
    rolePermissions: [],
    permissions: [],
    users: {
      list: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
    },
  },

  effects: {
    *getUsers({ payload }, { call, put }) {
      const response = yield call(getUsers, payload);

      if (response) {
        yield put({
          type: 'changeUsers',
          payload: response.result,
        });
      }
    },
    *createUser({ payload }, { call }) {
      yield call(createUser, payload);
    },
    *updateUser({ payload }, { call }) {
      yield call(updateUser, payload);
    },
    *updateUserStatus({ payload }, { call }) {
      yield call(updateUserStatus, payload);
    },
    *getTitles(_, { call, put }) {
      const response = yield call(getTitles);

      if (response) {
        yield put({
          type: 'changeTitles',
          payload: response.result,
        });
      }
    },
    *getManagers({ payload }, { call, put }) {
      const response = yield call(getManagers, payload);

      if (response) {
        yield put({
          type: 'changeManagers',
          payload: response.result,
        });
      }
    },
    *clearManagers(_, { put }) {
      yield put({
        type: 'changeManagers',
        payload: [],
      });
    },
    *getRoles(_, { call, put }) {
      const response = yield call(getRoles);

      if (response) {
        yield put({
          type: 'changeRoles',
          payload: response.result,
        });
      }
    },
    *createRole({ payload }, { call }) {
      yield call(createRole, payload);
    },
    *updateRole({ payload }, { call }) {
      yield call(updateRole, payload);
    },
    *getRoleUsers({ payload }, { call, put }) {
      const response = yield call(getRoleUsers, payload);

      if (response) {
        yield put({
          type: 'changeRoleUsers',
          payload: response.result,
        });
      }
    },
    *clearRoleUsers(_, { put }) {
      yield put({
        type: 'changeRoleUsers',
        payload: [],
      });
    },
    *getRolePermissions({ payload }, { call, put }) {
      const response = yield call(getRolePermissions, payload);

      if (response) {
        yield put({
          type: 'changeRolePermissions',
          payload: response.result,
        });
      }
    },
    *clearRolePermissions(_, { put }) {
      yield put({
        type: 'changeRolePermissions',
        payload: [],
      });
    },
    *getPermissions(_, { call, put }) {
      const response = yield call(getRolePermissions);

      if (response) {
        yield put({
          type: 'changePermissions',
          payload: response.result,
        });
      }
    },
  },

  reducers: {
    changeUsers(state, action) {
      const { users } = state;
      const { pagination } = users;
      return {
        ...state,
        users: {
          list: action.payload.records,
          pagination: {
            ...pagination,
            current: action.payload.current,
            pageSize: action.payload.size,
            total: action.payload.total
          }
        },
      }
    },
    changeTitles(state, action) {
      return {
        ...state,
        titles: action.payload,
      }
    },
    changeManagers(state, action) {
      return {
        ...state,
        managers: action.payload,
      }
    },
    changeRoles(state, action) {
      return {
        ...state,
        roles: action.payload,
      }
    },
    changeRoleUsers(state, action) {
      return {
        ...state,
        roleUsers: action.payload,
      }
    },
    changeRolePermissions(state, action) {
      return {
        ...state,
        rolePermissions: action.payload,
      }
    },
    changePermissions(state, action) {
      return {
        ...state,
        permissions: action.payload,
      }
    },
  },
};
