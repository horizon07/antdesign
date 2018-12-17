import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Button } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ rbac, loading }) => ({
  rbac,
  loadingTitles: loading.effects['rbac/getTitles'],
  loadingManagers: loading.effects['rbac/getManagers'],
  loadingRoles: loading.effects['rbac/getRoles'],
}))
@Form.create()
class UserForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showPasswordInput: !props.formVals.id,
    };
  }

  componentDidMount() {
    const { formVals, dispatch } = this.props;

    if (formVals.position) {
      this.getManagers(formVals.position);
    } else {
      dispatch({
        type: 'rbac/clearManagers',
      });
    }
  }

  togglePasswordInput = () => {
    const { showPasswordInput } = this.state;

    this.setState({
      showPasswordInput: !showPasswordInput,
    });
  };

  handleTitleChange = val => {
    const {
      form: { setFieldsValue },
    } = this.props;

    setFieldsValue({
      managerId: undefined,
    });

    this.getManagers(val);
  };

  getManagers = val => {
    const {
      dispatch,
      rbac: { titles },
    } = this.props;

    const title = titles.find(t => t.id === val);

    dispatch({
      type: 'rbac/getManagers',
      payload: { managerId: title.managerId },
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      formVals,
      loading,
      rbac,
      loadingTitles,
      loadingManagers,
      loadingRoles,
    } = this.props;

    const { showPasswordInput } = this.state;

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };

    const passwordInput = getFieldDecorator('password', {
      initialValue: formVals.password,
      rules: [
        {
          required: true,
          message: formatMessage(
            { id: '请输入{field}' },
            { field: formatMessage({ id: '登录密码' }) }
          ),
        },
        {
          pattern: /^(?=.*[a-z])(?=.*\d)[a-z\d]{6,}$/i,
          message: formatMessage({ id: '至少6位数字和字母组合' }),
        },
      ],
    })(
      <Input
        type="password"
        disabled={loading}
        placeholder={formatMessage({ id: '至少6位数字和字母组合' })}
      />
    );

    const togglePasswordButton = (
      <Button onClick={this.togglePasswordInput}>{formatMessage({ id: '修改密码' })}</Button>
    );

    return (
      <Form hideRequiredMark>
        <FormItem {...formItemLayout} label={<FormattedMessage id="登录账号" />}>
          {getFieldDecorator('account', {
            initialValue: formVals.account,
            rules: [
              {
                required: true,
                message: formatMessage(
                  { id: '请输入{field}' },
                  { field: formatMessage({ id: '登录账号' }) }
                ),
              },
              {
                pattern: /^[a-z\d]{1,30}$/i,
                message: formatMessage({ id: '30个字符以内字母/数字组合' }),
              },
            ],
          })(<Input disabled={loading} placeholder={formatMessage({ id: '请输入' })} />)}
        </FormItem>
        <FormItem {...formItemLayout} label={<FormattedMessage id="登录密码" />}>
          {showPasswordInput ? passwordInput : togglePasswordButton}
        </FormItem>
        <FormItem {...formItemLayout} label={<FormattedMessage id="员工姓名" />}>
          {getFieldDecorator('name', {
            initialValue: formVals.nickName,
            rules: [
              {
                required: true,
                message: formatMessage(
                  { id: '请输入{field}' },
                  { field: formatMessage({ id: '员工姓名' }) }
                ),
              },
              {
                max: 72,
                message: formatMessage({ id: '72个字符以内' }),
              },
            ],
          })(<Input disabled={loading} placeholder={formatMessage({ id: '请输入' })} />)}
        </FormItem>
        <FormItem {...formItemLayout} label={<FormattedMessage id="所属职位" />}>
          {getFieldDecorator('positionId', {
            initialValue: formVals.position || undefined,
            rules: [
              {
                required: true,
                message: formatMessage(
                  { id: '请选择{field}' },
                  { field: formatMessage({ id: '所属职位' }) }
                ),
              },
            ],
          })(
            <Select
              disabled={loading || loadingTitles}
              loading={loadingTitles}
              placeholder={formatMessage({ id: '请选择' })}
              onChange={this.handleTitleChange}
            >
              {rbac.titles.map(t => (
                <Option key={t.id} value={t.id}>
                  {t.name}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={<FormattedMessage id="上级领导" />}>
          {getFieldDecorator('managerId', {
            initialValue: formVals.leaderId || undefined,
          })(
            <Select
              disabled={loading || loadingManagers}
              loading={loadingManagers}
              placeholder={formatMessage({ id: '请选择' })}
            >
              {rbac.managers.map(m => (
                <Option key={m.id} value={m.id}>
                  {m.name}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={<FormattedMessage id="角色权限" />}>
          {getFieldDecorator('roleId', {
            initialValue: formVals.roleId || undefined,
            rules: [
              {
                required: true,
                message: formatMessage(
                  { id: '请选择{field}' },
                  { field: formatMessage({ id: '角色权限' }) }
                ),
              },
            ],
          })(
            <Select
              disabled={loading || loadingRoles}
              loading={loadingRoles}
              placeholder={formatMessage({ id: '请选择' })}
            >
              {rbac.roles.map(r => (
                <Option key={r.id} value={r.id}>
                  {r.roleName}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
      </Form>
    );
  }
}

export default UserForm;
