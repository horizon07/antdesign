import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Row, Col, Card } from 'antd';
import { FormattedMessage } from 'umi/locale';

import GridContent from '@/components/PageHeaderWrapper/GridContent';
import PageLoading from '@/components/PageLoading';

const Abstract = React.lazy(() => import('./Abstract'));

const ChartApplications = React.lazy(() => import('./Charts/Applications'));
const ChartLoans = React.lazy(() => import('./Charts/Loans'));
const ChartCredits = React.lazy(() => import('./Charts/Credits'));
const ChartRepayments = React.lazy(() => import('./Charts/Repayments'));

@connect(({ assets, loading }) => ({
  assets,
  loadingAbstract: loading.effects['assets/getAbstract'],
  loadingApplications: loading.effects['assets/getApplications'],
  loadingLoans: loading.effects['assets/getLoans'],
  loadingCredits: loading.effects['assets/getCredits'],
  loadingRepayments: loading.effects['assets/getRepayments'],
}))
class Dashboard extends Component {
  componentDidMount() {
    const { dispatch } = this.props;

    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'assets/getAbstract',
      });
      dispatch({
        type: 'assets/getApplications',
      });
      dispatch({
        type: 'assets/getLoans',
      });
      dispatch({
        type: 'assets/getCredits',
      });
      dispatch({
        type: 'assets/getRepayments',
      });
    });
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.reqRef);
  }

  render() {
    const {
      assets,
      loadingAbstract,
      loadingApplications,
      loadingLoans,
      loadingCredits,
      loadingRepayments
    } = this.props;

    return (
      <GridContent>
        <Suspense fallback={<PageLoading />}>
          <Abstract loading={loadingAbstract} abstract={assets.abstract} />
        </Suspense>
        <Row gutter={24}>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <Card
                loading={loadingApplications}
                bordered={false}
                title={
                  <FormattedMessage id="近七日申请数据（授信）" />
                }
                style={{ marginBottom: 24 }}
              >
                <ChartApplications applications={assets.applications} />
              </Card>
            </Suspense>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <Card
                loading={loadingLoans}
                bordered={false}
                title={
                  <FormattedMessage id="近七日放款数据" />
                }
                style={{ marginBottom: 24 }}
              >
                <ChartLoans loans={assets.loans} />
              </Card>
            </Suspense>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <Card
                loading={loadingCredits}
                bordered={false}
                title={
                  <FormattedMessage id="授信金额" />
                }
                style={{ marginBottom: 24 }}
              >
                <ChartCredits credits={assets.credits} />
              </Card>
            </Suspense>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <Card
                loading={loadingRepayments}
                bordered={false}
                title={
                  <FormattedMessage id="新户还款进度" />
                }
                style={{ marginBottom: 24 }}
              >
                <ChartRepayments repayments={assets.repayments} />
              </Card>
            </Suspense>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Dashboard;
