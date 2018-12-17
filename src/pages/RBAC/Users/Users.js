import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Divider, Badge, Button, Modal, message } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import UserForm from './UserForm';

import './Users.less';

/* eslint react/no-multi-comp:0 */
@connect(({ auth, rbac, loading }) => ({
  me: auth.me,
  rbac,
  loading: loading.effects['rbac/getUsers'],
  creating: loading.effects['rbac/createUser'],
  updating: loading.effects['rbac/updateUser'],
  updatingStatus: loading.effects['rbac/updateUserStatus'],
}))
class Users extends PureComponent {
  columns = [
    {
      title: formatMessage({ id: '员工姓名' }),
      dataIndex: 'nickName',
      fixed: 'left',
      width: 160,
    },
    {
      title: formatMessage({ id: '登录账号' }),
      dataIndex: 'account',
      width: 160,
    },
    {
      title: formatMessage({ id: '角色' }),
      dataIndex: 'roleName',
      width: 120,
    },
    {
      title: formatMessage({ id: '职位' }),
      dataIndex: 'positionName',
      width: 120,
    },
    {
      title: formatMessage({ id: '最后登录时间' }),
      dataIndex: 'lastLoginTime',
      width: 160,
      render: text => (text ? moment(text).format('HH:mm DD/MM/YYYY') : ''),
    },
    {
      title: formatMessage({ id: '状态' }),
      dataIndex: 'status',
      render: text => (
        <Badge
          status={parseInt(text, 10) === 0 ? 'processing' : 'default'}
          text={
            parseInt(text, 10) === 0 ? formatMessage({ id: '正常' }) : formatMessage({ id: '停用' })
          }
        />
      ),
    },
    {
      title: formatMessage({ id: '操作' }),
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <span>
          <a onClick={() => this.openUpdateModal(record)}>{formatMessage({ id: '编辑' })}</a>
          <Divider type="vertical" />
          <a onClick={() => this.toggleUserStatus(record)}>
            {parseInt(record.status, 10) === 0
              ? formatMessage({ id: '关闭' })
              : formatMessage({ id: '启用' })}
          </a>
        </span>
      ),
    },
  ];

  constructor(props) {
    super(props);

    this.state = {
      params: {
        size: 10,
        current: 1,
      },
      showModal: false,
      formVals: {},
    };

    this.formRef = null;
  }

  componentDidMount() {
    this.getUsers();

    const { dispatch } = this.props;

    dispatch({
      type: 'rbac/getTitles',
    });

    dispatch({
      type: 'rbac/getRoles',
    });
  }

  componentDidUpdate(_, prevState) {
    const { params } = this.state;

    if (prevState.params !== params) {
      this.getUsers();
    }
  }

  handleTableChange = pagination => {
    const { params } = this.state;

    this.setState({
      params: {
        ...params,
        current: pagination.current,
        size: pagination.pageSize,
      },
    });
  };

  getUsers = () => {
    const { dispatch } = this.props;

    const { params } = this.state;

    dispatch({
      type: 'rbac/getUsers',
      payload: params,
    });
  };

  openCreateModal = () => {
    this.setState({
      showModal: true,
      formVals: {}
    });
  };

  openUpdateModal = user => {
    this.setState({
      showModal: true,
      formVals: user,
    });
  };

  closeModal = () => {
    this.setState({
      showModal: false,
      formVals: {},
    });
  };

  handleFormValsChange = vals => {
    this.setState({
      formVals: vals,
    });
  };

  createOrUpdate = () => {
    const { me, dispatch } = this.props;

    const {
      props: {
        form: { validateFieldsAndScroll },
        formVals,
      },
    } = this.formRef;

    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const type = formVals.id ? 'updateUser' : 'createUser';
        const payload = formVals.id ? { ...values, id: formVals.id } : values;
        const successMessage = formVals.id ? '{name}已修改成功' : '{name}已添加成功';
        const errorMessage = formVals.id ? '{name}修改失败，请重试' : '{name}添加失败，请重试';

        dispatch({
          type: `rbac/${type}`,
          payload: { ...payload, curAccount: me.account },
        }).then(() => {
          this.closeModal();
          this.getUsers();
          message.success(formatMessage({ id: successMessage }, { name: formatMessage({ id: '账号' }) }));
        }).catch(() => {
          message.error(formatMessage({ id: errorMessage }, { name: formatMessage({ id: '账号' }) }));
        });
      }
    });
  };

  toggleUserStatus = user => {
    const { dispatch } = this.props;

    dispatch({
      type: 'rbac/updateUserStatus',
      payload: {
        ...user,
        status: parseInt(user.status, 10) === 0 ? 1 : 0,
      },
    }).then(() => {
      this.getUsers();
    });
  };

  render() {
    const {
      rbac: {
        users: { list, pagination },
      },
      loading,
      creating,
      updating,
      updatingStatus,
    } = this.props;

    const { showModal, formVals } = this.state;

    const createTitle = (
      <span>
        {formatMessage({ id: '新建{name}' }, { name: formatMessage({ id: '账号' }) })}
        <small>
          {formatMessage({ id: '填写{name}信息' }, { name: formatMessage({ id: '账号' }) })}
        </small>
      </span>
    );
    const updateTitle = (
      <span>
        {formatMessage({ id: '编辑{name}' }, { name: formatMessage({ id: '账号' }) })}
        <small>
          {formatMessage({ id: '编辑{name}信息' }, { name: formatMessage({ id: '账号' }) })}
        </small>
      </span>
    );

    return (
      <PageHeaderWrapper
        title={formatMessage({ id: '共 {total} 个账号' }, { total: pagination.total })}
        action={
          <Button type="primary" onClick={this.openCreateModal}>
            {formatMessage({ id: '添加{name}' }, { name: formatMessage({ id: '用户' }) })}
          </Button>
        }
      >
        <Card bordered={false}>
          <Table
            dataSource={list}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              ...pagination,
            }}
            onChange={this.handleTableChange}
            loading={loading || updatingStatus}
            columns={this.columns}
            scroll={{ x: 980, y: '100%' }}
            rowKey="id"
          />
        </Card>
        <Modal
          title={formVals.id ? updateTitle : createTitle}
          destroyOnClose
          closable={!creating && !updating}
          confirmLoading={creating || updating}
          keyboard={!creating && !updating}
          maskClosable={!creating && !updating}
          visible={showModal}
          okText={formatMessage({ id: '确定' })}
          cancelText={formatMessage({ id: '取消' })}
          okButtonProps={{ disabled: creating || updating }}
          cancelButtonProps={{ disabled: creating || updating }}
          onCancel={this.closeModal}
          onOk={this.createOrUpdate}
        >
          <UserForm
            formVals={formVals}
            loading={creating || updating}
            wrappedComponentRef={element => {
              this.formRef = element;
            }}
          />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default Users;
