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

import styles from './Bills.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

/* eslint react/no-multi-comp:0 */
@connect(({ assets, loading }) => ({
  assets,
  loading: loading.effects['assets/getBills'],
}))
class Bills extends PureComponent {
  state = {
    params: {
      todayOrYes: 1,
      size: 10,
      current: 1,
    },
  };

  columns = [
    {
      title: formatMessage({ id: '账单起始日期' }),
      dataIndex: 'bill_start_date',
      fixed: 'left',
      width: 120,
      render: text => text ? moment(text).format('DD/MM/YYYY') : '',
    },
    {
      title: formatMessage({ id: '账单结束日期' }),
      dataIndex: 'bill_end_date',
      fixed: 'left',
      width: 120,
      render: text => text ? moment(text).format('DD/MM/YYYY') : '',
    },
    {
      title: formatMessage({ id: '应还本金' }),
      dataIndex: 'paymentSum',
      width: 130,
    },
    {
      title: formatMessage({ id: '未还本金' }),
      dataIndex: 'unPaymentSum',
      width: 160,
    },
    {
      title: formatMessage({ id: '利息收益' }),
      dataIndex: 'interestIncome',
      width: 130,
    },
    {
      title: formatMessage({ id: '放款笔数' }),
      dataIndex: 'loanAmount',
      width: 130,
    },
    {
      title: formatMessage({ id: '还款笔数' }),
      dataIndex: 'repaymentCount',
      width: 130,
    },
    {
      title: formatMessage({ id: '还款比例' }),
      dataIndex: 'repaymentRate',
      width: 130,
    },
    {
      title: formatMessage({ id: '新户应还笔数' }),
      dataIndex: 'loanAmountNew',
      width: 130,
    },
    {
      title: formatMessage({ id: '新户还款笔数' }),
      dataIndex: 'repaymentCountNew',
      width: 130,
    },
    {
      title: formatMessage({ id: '新户还款比例' }),
      dataIndex: 'repaymentRateNew',
      width: 130,
    },
    {
      title: formatMessage({ id: '续贷应还笔数' }),
      dataIndex: 'loanAmountOld',
      width: 145,
    },
    {
      title: formatMessage({ id: '续贷还款笔数' }),
      dataIndex: 'repaymentCountOld',
      width: 145,
    },
    {
      title: formatMessage({ id: '续贷还款比例' }),
      dataIndex: 'repaymentRateOld',
    },
  ];

  componentDidMount() {
    this.getBills();
  }

  componentDidUpdate(_, prevState) {
    const { params } = this.state;

    if (prevState.params !== params) {
      this.getBills();
    }
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

  handleChangeRadio = (e) => {
    const { params } = this.state;

    this.setState({
      params: {
        ...params,
        todayOrYes: e.target.value
      }
    });
  };

  getBills = () => {
    const { dispatch } = this.props;

    const { params } = this.state;

    dispatch({
      type: 'assets/getBills',
      payload: params,
    });
  };

  render() {
    const {
      assets: { bills },
      loading,
    } = this.props;

    return (
      <PageHeaderWrapper
        title={formatMessage({ id: '还款金额统计' })}
      >
        <Card bordered={false}>
          <Row type="flex" justify="end" gutter={16} className={styles.buttonGroups}>
            <Col>
              <RadioGroup disabled={loading} onChange={this.handleChangeRadio} defaultValue="1">
                <RadioButton value="1">
                  <FormattedMessage id="账单起始日期" />
                </RadioButton>
                <RadioButton value="2">
                  <FormattedMessage id="账单结束日期" />
                </RadioButton>
              </RadioGroup>
            </Col>
          </Row>
          <Table
            dataSource={bills.list}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              ...bills.pagination,
            }}
            onChange={this.handleTableChange}
            loading={loading}
            columns={this.columns}
            scroll={{ x: 1975, y: '100%' }}
            rowKey={record => `${record.bill_start_date || ''}${record.bill_end_date || ''}`}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Bills;
