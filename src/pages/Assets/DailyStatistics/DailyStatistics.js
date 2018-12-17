import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Table,
  DatePicker,
} from 'antd';
import {
  formatMessage,
} from 'umi/locale';
import moment from 'moment'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './DailyStatistics.less';

const { RangePicker } = DatePicker;

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ assets, loading }) => ({
  assets,
  loading: loading.effects['assets/getDailyStatistics'],
}))
@Form.create()
class DailyStatistics extends PureComponent {
  state = {
    params: {
      size: 10,
      current: 1,
    },
  };

  columns = [
    {
      title: formatMessage({ id: '日期' }),
      dataIndex: 'create_date',
      fixed: 'left',
      width: 120,
      render: text => text ? moment(text).format('DD/MM/YYYY') : '',
    },
    {
      title: formatMessage({ id: '注册人数' }),
      dataIndex: 'zcrs',
      width: 100,
    },
    {
      title: formatMessage({ id: '申请笔数' }),
      dataIndex: 'sqbs',
      width: 100,
    },
    {
      title: formatMessage({ id: '放款笔数' }),
      dataIndex: 'fkbs',
      width: 100,
    },
    {
      title: formatMessage({ id: '实际放款金额' }),
      dataIndex: 'sjfkje',
      width: 130,
    },
    {
      title: formatMessage({ id: '还款金额' }),
      dataIndex: 'hkje',
      width: 100,
    },
    {
      title: formatMessage({ id: '已还清笔数' }),
      dataIndex: 'yhqbs',
      width: 115,
    },
    {
      title: formatMessage({ id: '提前还款结清笔数' }),
      dataIndex: 'tqhkjqbs',
      width: 160,
    },
    {
      title: formatMessage({ id: '到期还款结清笔数' }),
      dataIndex: 'dqhkjqbs',
      width: 160,
    },
    {
      title: formatMessage({ id: '逾期还款结清笔数' }),
      dataIndex: 'yqhkjqbs',
      width: 160,
    },
    {
      title: formatMessage({ id: '还款结清金额' }),
      dataIndex: 'hkjqje',
      width: 130,
    },
    {
      title: formatMessage({ id: '提前还款结清金额' }),
      dataIndex: 'tqhkjqje',
      width: 160,
    },
    {
      title: formatMessage({ id: '到期还款结清金额' }),
      dataIndex: 'dqhkjqje',
      width: 160,
    },
    {
      title: formatMessage({ id: '逾期还款结清金额' }),
      dataIndex: 'yqhkjqje',
      width: 160,
    },
    {
      title: formatMessage({ id: '当日到期应还笔数' }),
      dataIndex: 'drdqyhbs',
      width: 160,
    },
    {
      title: formatMessage({ id: '当日到期已还笔数' }),
      dataIndex: 'drdqshbs',
      width: 160,
    },
    {
      title: formatMessage({ id: '当日到期未还笔数' }),
      dataIndex: 'drdqwhbs',
      width: 160,
    },
    {
      title: formatMessage({ id: '当日首逾率' }),
      dataIndex: 'drsyl',
      width: 115,
    },
    {
      title: formatMessage({ id: '当日到期应还金额' }),
      dataIndex: 'drdqyhje',
      width: 160,
    },
    {
      title: formatMessage({ id: '当日到期已还金额' }),
      dataIndex: 'drdqshje',
      width: 160,
    },
    {
      title: formatMessage({ id: '当日到期未还金额' }),
      dataIndex: 'drdqwhje',
      width: 160,
    },
    {
      title: formatMessage({ id: '当日金额首逾率' }),
      dataIndex: 'drjesyl',
    },
  ];

  componentDidMount() {
    this.getDailyStatistics();
  }

  componentDidUpdate(_, prevState) {
    const { params } = this.state;

    if (prevState.params !== params) {
      this.getDailyStatistics();
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

  handleRangeChange = (dates) => {
    const { params } = this.state;

    this.setState({
      params: {
        ...params,
        from: dates.length ? dates[0].format('DD/MM/YYYY') : '',
        to: dates.length > 1 ? dates[1].format('DD/MM/YYYY') : '',
      }
    });
  };

  getDailyStatistics = () => {
    const { dispatch } = this.props;

    const { params } = this.state;

    dispatch({
      type: 'assets/getDailyStatistics',
      payload: params,
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
      loading,
    } = this.props;
    return (
      <Form layout="inline">
        <FormItem label={formatMessage({ id: '查询日期' })}>
          {getFieldDecorator('range')(<RangePicker className={styles.rangePicker} disabled={loading} onChange={this.handleRangeChange} format="DD/MM/YYYY" />)}
        </FormItem>
      </Form>
    );
  }

  render() {
    const {
      assets: { dailyStatistics },
      loading,
    } = this.props;

    return (
      <PageHeaderWrapper title={formatMessage({ id: '日报' })}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Table
              dataSource={dailyStatistics.list}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                ...dailyStatistics.pagination,
              }}
              onChange={this.handleTableChange}
              loading={loading}
              columns={this.columns}
              scroll={{ x: 3090, y: '100%' }}
              rowKey="create_date"
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default DailyStatistics;
