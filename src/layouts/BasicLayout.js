import React from 'react';
import { Layout, Spin } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import Media from 'react-media';
import { formatMessage } from 'umi/locale';
import Authorized from '@/utils/Authorized';
import logo from '../assets/logo.svg';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import Exception403 from '../pages/Exception/403';
import SiderMenu from '@/components/SiderMenu';

import styles from './BasicLayout.less';

const { Content } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

class BasicLayout extends React.PureComponent {
  state = {
    breadcrumbNameMap: {},
    authorized: false,
  };

  exclutions = [
    '/auth/login',
    '/exception/403',
    '/exception/404',
    '/exception/500'
  ];

  componentDidMount() {
    const {
      dispatch,
    } = this.props;

    dispatch({
      type: 'auth/getMe',
    });

    dispatch({
      type: 'setting/getSetting',
    });

    this.updateSidebarMenu();
    this.updateBreadcrumbs();
    this.updateAuthorized();
  }

  componentDidUpdate(prevProps) {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    const {
      collapsed,
      isMobile,
      me,
      menuData,
      location: { pathname },
    } = this.props;

    if (isMobile && !prevProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }

    if (prevProps.me.menus !== me.menus) {
      this.updateSidebarMenu();
    }

    if (prevProps.menuData !== menuData) {
      this.updateBreadcrumbs();
    }

    if (prevProps.location.pathname !== pathname || prevProps.me.menus !== me.menus) {
      this.updateAuthorized();
    }
  }

  getContext() {
    const { location } = this.props;
    const { breadcrumbNameMap } = this.state;

    return {
      location,
      breadcrumbNameMap,
    };
  }

  /**
   * 获取面包屑映射
   * @param {Object} menuData 菜单配置
   */
  getBreadcrumbNameMap() {
    const routerMap = {};
    const { menuData } = this.props;
    const flattenMenuData = data => {
      data.forEach(menuItem => {
        if (menuItem.children) {
          flattenMenuData(menuItem.children);
        }
        // Reduce memory usage
        routerMap[menuItem.path] = menuItem;
      });
    };
    flattenMenuData(menuData);
    return routerMap;
  }

  updateSidebarMenu = () => {
    const {
      dispatch,
      route: { routes },
      me,
    } = this.props;

    dispatch({
      type: 'menu/getMenuData',
      payload: { routes, userMenu: me.menus || [] },
    });
  };

  updateBreadcrumbs = () => {
    const breadcrumbNameMap = this.getBreadcrumbNameMap();

    this.setState({
      breadcrumbNameMap,
    });
  };

  updateAuthorized = () => {
    const {
      location: { pathname },
      me,
    } = this.props;

    let authorized = false;

    if (pathname) {
      if (this.exclutions.indexOf(pathname) >= 0) {
        authorized = true;
      } else if (me.menus) {
        authorized = me.menus.findIndex(m => m.location && m.location.toLowerCase() === pathname.toLowerCase()) >= 0;
      }
    }

    this.setState({
      authorized,
    });
  };

  matchParamsPath = pathname => {
    const { breadcrumbNameMap } = this.state;

    const pathKey = Object.keys(breadcrumbNameMap).find(key => pathToRegexp(key).test(pathname));

    return breadcrumbNameMap[pathKey];
  };

  getPageTitle = pathname => {
    const brand = formatMessage({ id: 'Happy Dong' });

    if (this.exclutions.indexOf(pathname) >= 0) {
      const title = formatMessage({ id: `menu${pathname}`.replace(/\//g, '.') });

      return `${title} - ${brand}`;
    }

    const currRouterData = this.matchParamsPath(pathname);

    if (!currRouterData) {
      return brand;
    }
    const pageName = formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name,
    });
    return `${pageName} - ${brand}`;
  };

  getLayoutStyle = () => {
    const { fixSiderbar, isMobile, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  getContentStyle = () => {
    const { fixedHeader } = this.props;
    return {
      margin: '24px 24px 0',
      paddingTop: fixedHeader ? 64 : 0,
    };
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  render() {
    const {
      me,
      navTheme,
      layout: PropsLayout,
      children,
      location: { pathname },
      isMobile,
      menuData,
      loading,
    } = this.props;
    const { authorized } = this.state;
    const isTop = PropsLayout === 'topmenu';
    const authority = () => authorized;
    const layout = (
      <Layout>
        {(isTop && !isMobile) || !me.account ? null : (
          <SiderMenu
            logo={logo}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={menuData}
            isMobile={isMobile}
            {...this.props}
          />
        )}
        <Layout
          style={{
            ...(me.account ? this.getLayoutStyle() : {}),
            minHeight: '100vh',
          }}
        >
          {!me.account ? null : (
            <Header
              menuData={menuData}
              handleMenuCollapse={this.handleMenuCollapse}
              logo={logo}
              isMobile={isMobile}
              {...this.props}
            />
          )}
          <Content style={this.getContentStyle()}>
            <Authorized
              authority={authority}
              noMatch={<Exception403 />}
            >
              {children}
            </Authorized>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle title={this.getPageTitle(pathname)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                {loading ? <div className={styles.spinWrapper}><Spin size="large" /></div> : <div className={classNames(params)}>{layout}</div>}
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
      </React.Fragment>
    );
  }
}

export default connect(({ auth, global, setting, menu, loading }) => ({
  me: auth.me,
  collapsed: global.collapsed,
  layout: setting.layout,
  menuData: menu.menuData,
  loading: loading.effects['auth/getMe'],
  ...setting,
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <BasicLayout {...props} isMobile={isMobile} />}
  </Media>
));
