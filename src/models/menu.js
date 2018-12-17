import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import { formatMessage } from 'umi/locale';
import Authorized from '@/utils/Authorized';

const { check } = Authorized;

// Conversion router to menu.
function formatter(data, userMenu, parentName) {
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      let locale = 'menu';
      if (parentName) {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }

      const authority = userMenu.findIndex(m => m.location === item.path) >= 0;

      const result = {
        ...item,
        name: formatMessage({ id: locale, defaultMessage: item.name }),
        locale,
        authority() {
          return authority;
        },
      };
      if (item.routes) {
        const children = formatter(item.routes, userMenu, locale);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item && item.authority());
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * get SubMenu or Item
 */
const getSubMenu = item => {
  // doc: add hideChildrenInMenu
  if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
    return {
      ...item,
      children: filterMenuData(item.children), // eslint-disable-line
    };
  }
  return item;
};

/**
 * filter menuData
 */
const filterMenuData = menuData => {
  if (!menuData) {
    return [];
  }
  return menuData
    .filter(item => item.name && !item.hideInMenu)
    .map(item => {
      // make dom
      const ItemDom = getSubMenu(item);
      const data = check(item.authority, ItemDom);
      return data;
    })
    .filter(item => item);
};

export default {
  namespace: 'menu',

  state: {
    menuData: [],
  },

  effects: {
    *getMenuData({ payload }, { put }) {
      const { routes, userMenu } = payload;
      yield put({
        type: 'save',
        payload: filterMenuData(memoizeOneFormatter(routes, userMenu)),
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        menuData: action.payload,
      };
    },
  },
};
