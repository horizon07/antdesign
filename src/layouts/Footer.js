import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import { formatMessage } from 'umi/locale';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        // { key, title, href, blankTraget (Boolean) }
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2018 ZRobot {formatMessage({ id: '出品' })}
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
