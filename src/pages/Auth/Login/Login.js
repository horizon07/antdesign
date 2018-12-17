import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Checkbox } from 'antd';
import router from 'umi/router';
import Login from '@/components/Login';
import styles from './Login.less';

const { Tab, UserName, Password, Submit } = Login;

@connect(({ auth, loading }) => ({
  me: auth.me,
  submitting: loading.effects['auth/login'],
}))
class LoginPage extends Component {
  state = {
    autoLogin: true,
  };

  componentDidMount() {
    this.checkUser();
  }

  componentDidUpdate() {
    this.checkUser();
  }

  checkUser = () => {
    const { me } = this.props;

    if (me.account) {
      router.push('/');
    }
  };

  handleSubmit = (err, values) => {
    if (!err) {
      const { dispatch } = this.props;

      dispatch({
        type: 'auth/login',
        payload: {
          ...values,
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  render() {
    const { submitting } = this.props;
    const { autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey="account"
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab={formatMessage({ id: '账号密码登录' })}>
            <UserName
              name="account"
              placeholder={formatMessage(
                { id: '请输入{field}' },
                { field: formatMessage({ id: '账号' }) }
              )}
            />
            <Password
              name="password"
              placeholder={formatMessage({ id: '请输入{field}' }, { field: formatMessage({ id: '密码' }) })}
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
          </Tab>
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="自动登录" />
            </Checkbox>
            {/* <a style={{ float: 'right' }} href="">
              <FormattedMessage id="忘记密码" />
            </a> */}
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="登录" />
          </Submit>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
