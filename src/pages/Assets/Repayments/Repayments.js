import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Table,
  Radio,
  Row,
  Col,
} from 'antd';
import {
  formatMessage,
  FormattedMessage,
} from 'umi/locale';
import moment from 'moment'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Repayments.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

/* eslint react/no-multi-comp:0 */
@connect(({ assets, loading }) => ({
  assets,
  loading: loading.effects['assets/getRepaymentNumbers'],
}))
class Repayments extends PureComponent {
  state = {
    tabActiveKey: 'all',
    params: {
      dayOrWeekOrYear: 1,
      todayOrYes: 1,
      payIndex: null,
      size: 10,
      current: 1,
    },
  };

  tabList = [
    {
      key: 'all',
      tab: formatMessage({ id: '全量客户' }),
      payIndex: null,
    },
    {
      key: 'new',
      tab: formatMessage({ id: '新户' }),
      payIndex: 1,
    },
    {
      key: 'regular',
      tab: formatMessage({ id: '续贷客户' }),
      payIndex: 2,
    },
  ];

  startDateColumn = {
    title: formatMessage({ id: '账单起始日期' }),
    dataIndex: 'bill_start_date',
    fixed: 'left',
    width: 120,
    render: text => text ? moment(text).format('DD/MM/YYYY') : '',
  };

  endDateColumn = {
    title: formatMessage({ id: '账单结束日期' }),
    dataIndex: 'bill_end_date',
    fixed: 'left',
    width: 120,
    render: text => text ? moment(text).format('DD/MM/YYYY') : '',
  };

  regularColumns = [
    {
      title: formatMessage({ id: '总放款笔数' }),
      dataIndex: 'paymentSum',
      width: 130,
    },
    {
      title: formatMessage({ id: '账单日内已还款笔数' }),
      dataIndex: 'repaymentSum',
      width: 160,
    },
    {
      title: formatMessage({ id: '逾期1-3天' }),
      dataIndex: 'overdue1to3',
      width: 130,
    },
    {
      title: formatMessage({ id: '逾期4-7天' }),
      dataIndex: 'overdue4to7',
      width: 130,
    },
    {
      title: formatMessage({ id: '逾期8-15天' }),
      dataIndex: 'overdue8to15',
      width: 130,
    },
    {
      title: formatMessage({ id: '逾期16-30天' }),
      dataIndex: 'overdue16to30',
      width: 130,
    },
    {
      title: formatMessage({ id: '逾期31-60天' }),
      dataIndex: 'overdue31to60',
      width: 130,
    },
    {
      title: formatMessage({ id: '逾期61-90天' }),
      dataIndex: 'overdue61to90',
      width: 130,
    },
    {
      title: formatMessage({ id: '逾期90天以上' }),
      dataIndex: 'overdue90ton',
      width: 130,
    },
    {
      title: formatMessage({ id: '未还款笔数占比' }),
      dataIndex: 'unRepaymentRate',
    },
  ];

  componentDidMount() {
    this.getRepayments();
  }

  componentDidUpdate(_, prevState) {
    const { params } = this.state;

    if (prevState.params !== params) {
      this.getRepayments();
    }
  }

  getTabList() {
    const { loading } = this.props;

    return this.tabList.map(tab => ({ ...tab, disabled: loading }))
  }

  getColumns() {
    const { params } = this.state;
    const { dayOrWeekOrYear } = params;

    return (parseInt(dayOrWeekOrYear, 10) === 1 ? [this.startDateColumn, this.endDateColumn] : [this.endDateColumn]).concat(this.regularColumns);
  }

  getWidth() {
    const { params } = this.state;
    const { dayOrWeekOrYear } = params;

    return parseInt(dayOrWeekOrYear, 10) === 1 ? 1585 : 1465;
  }

  handleTableChange = (pagination) => {
    const { params } = this.state;

    this.setState({
      params: {
        ...params,
        current: pagination.current,
        size: pagination.pageSize,
      }
    });
  };

  handleChangeRadioOne = (e) => {
    const { params } = this.state;

    this.setState({
      params: {
        ...params,
        todayOrYes: e.target.value
      }
    });
  };

  handleChangeRadioTwo = (e) => {
    const { params } = this.state;
    const { todayOrYes } = params;
    let newTodayOrYes;

    if (parseInt(e.target.value, 10) === 1) {
      newTodayOrYes = todayOrYes;
    } else {
      newTodayOrYes = 2;
    }

    this.setState({
      params: {
        ...params,
        todayOrYes: newTodayOrYes,
        dayOrWeekOrYear: e.target.value
      }
    });
  };

  handleTabChange = key => {
    const { params } = this.state;
    const tab = this.tabList.find(t => t.key === key);

    this.setState({
      tabActiveKey: key,
      params: {
        ...params,
        payIndex: tab ? tab.payIndex : null
      }
    });
  };

  getRepayments = () => {
    const { dispatch } = this.props;

    const { params } = this.state;

    dispatch({
      type: 'assets/getRepaymentNumbers',
      payload: params,
    });
  };

  render() {
    const {
      assets: { repaymentNumbers },
      loading,
    } = this.props;

    const { tabActiveKey, params } = this.state;
    const { todayOrYes, dayOrWeekOrYear } = params;

    return (
      <PageHeaderWrapper
        title={formatMessage({ id: '还款笔数统计' })}
        tabList={this.getTabList()}
        tabActiveKey={tabActiveKey}
        onTabChange={this.handleTabChange}
      >
        <Card bordered={false}>
          <Row type="flex" justify="end" gutter={16} className={styles.buttonGroups}>
            <Col>
              <RadioGroup disabled={loading || parseInt(dayOrWeekOrYear, 10) !== 1} onChange={this.handleChangeRadioOne} defaultValue="1">
                <RadioButton value="1" checked={parseInt(todayOrYes, 10) === 1}>
                  <FormattedMessage id="账单起始日期" />
                </RadioButton>
                <RadioButton value="2" checked={parseInt(todayOrYes, 10) === 2}>
                  <FormattedMessage id="账单结束日期" />
                </RadioButton>
              </RadioGroup>
            </Col>
            <Col>
              <RadioGroup disabled={loading} onChange={this.handleChangeRadioTwo} defaultValue="1">
                <RadioButton value="1">
                  <FormattedMessage id="日" />
                </RadioButton>
                <RadioButton value="2">
                  <FormattedMessage id="周" />
                </RadioButton>
                <RadioButton value="3">
                  <FormattedMessage id="月" />
                </RadioButton>
              </RadioGroup>
            </Col>
          </Row>
          <Table
            dataSource={repaymentNumbers.list}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              ...repaymentNumbers.pagination,
            }}
            onChange={this.handleTableChange}
            loading={loading}
            columns={this.getColumns()}
            scroll={{ x: this.getWidth(), y: '100%' }}
            rowKey={record => `${record.bill_start_date || ''}${record.bill_end_date || ''}`}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Repayments;
