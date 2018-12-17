import {
  getAbstract,
  getLastSevenDaysApplications,
  getLastSevenDaysLoans,
  getCredits,
  getNewUserRepayments,
  getDailyStatistics,
  getRepaymentAmounts,
  getRepaymentNumbers,
  getBills
} from '@/services/assets';

export default {
  namespace: 'assets',

  state: {
    abstract: {},
    applications: [],
    loans: [],
    credits: [],
    repayments: [],
    dailyStatistics: {
      list: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
    },
    repaymentAmounts: {
      list: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
    },
    repaymentNumbers: {
      list: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
    },
    bills: {
      list: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
    },
  },

  effects: {
    *getAbstract(_, { call, put }) {
      const response = yield call(getAbstract);

      if (response) {
        yield put({
          type: 'changeAbstract',
          payload: response.result,
        });
      }
    },
    *getApplications(_, { call, put }) {
      const response = yield call(getLastSevenDaysApplications);

      if (response) {
        yield put({
          type: 'changeApplications',
          payload: response.result,
        });
      }
    },
    *getLoans(_, { call, put }) {
      const response = yield call(getLastSevenDaysLoans);

      if (response) {
        yield put({
          type: 'changeLoans',
          payload: response.result,
        });
      }
    },
    *getCredits(_, { call, put }) {
      const response = yield call(getCredits);

      if (response) {
        yield put({
          type: 'changeCredits',
          payload: response.result,
        });
      }
    },
    *getRepayments(_, { call, put }) {
      const response = yield call(getNewUserRepayments);

      if (response) {
        yield put({
          type: 'changeRepayments',
          payload: response.result,
        });
      }
    },
    *getDailyStatistics({ payload }, { call, put }) {
      const response = yield call(getDailyStatistics, payload);

      if (response) {
        yield put({
          type: 'changeDailyStatistics',
          payload: response.result,
        });
      }
    },
    *getRepaymentAmounts({ payload }, { call, put }) {
      const response = yield call(getRepaymentAmounts, payload);

      if (response) {
        yield put({
          type: 'changeRepaymentAmounts',
          payload: response.result,
        });
      }
    },
    *getRepaymentNumbers({ payload }, { call, put }) {
      const response = yield call(getRepaymentNumbers, payload);

      if (response) {
        yield put({
          type: 'changeRepaymentNumbers',
          payload: response.result,
        });
      }
    },
    *getBills({ payload }, { call, put }) {
      const response = yield call(getBills, payload);

      if (response) {
        yield put({
          type: 'changeBills',
          payload: response.result,
        });
      }
    },
  },

  reducers: {
    changeAbstract(state, action) {
      return {
        ...state,
        abstract: action.payload,
      };
    },
    changeApplications(state, action) {
      return {
        ...state,
        applications: action.payload,
      };
    },
    changeLoans(state, action) {
      return {
        ...state,
        loans: action.payload,
      };
    },
    changeCredits(state, action) {
      return {
        ...state,
        credits: action.payload,
      };
    },
    changeRepayments(state, action) {
      return {
        ...state,
        repayments: action.payload,
      };
    },
    changeDailyStatistics(state, action) {
      const { dailyStatistics } = state;
      const { pagination } = dailyStatistics;
      return {
        ...state,
        dailyStatistics: {
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
    changeRepaymentAmounts(state, action) {
      const { repaymentAmounts } = state;
      const { pagination } = repaymentAmounts;
      return {
        ...state,
        repaymentAmounts: {
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
    changeRepaymentNumbers(state, action) {
      const { repaymentNumbers } = state;
      const { pagination } = repaymentNumbers;
      return {
        ...state,
        repaymentNumbers: {
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
    changeBills(state, action) {
      const { bills } = state;
      const { pagination } = bills;
      return {
        ...state,
        bills: {
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
  },
};
