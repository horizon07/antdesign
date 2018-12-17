import React, { memo } from 'react';
import { Row, Col, Icon, Tooltip } from 'antd';
import { FormattedMessage } from 'umi/locale';
import styles from './Abstract.less';
import { ChartCard, MiniProgress, Field } from '@/components/Charts';
import Trend from '@/components/Trend';
import numeral from 'numeral';
import Yuan from '@/utils/Yuan';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const Abstract = memo(({ loading, abstract }) => {
  let dayTrendFlag = '-';
  let weekTrendFlag = '-';

  if (abstract.dayRepaymentPro > 0) {
    dayTrendFlag = 'up';
  } else if (abstract.dayRepaymentPro < 0) {
    dayTrendFlag = 'down';
  }

  if (abstract.weekRepaymentRate > 0) {
    weekTrendFlag = 'up';
  } else if (abstract.weekRepaymentRate < 0) {
    weekTrendFlag = 'down';
  }

  return (
    <Row gutter={24}>
      <Col {...topColResponsiveProps}>
        <ChartCard
          loading={loading}
          bordered={false}
          title={
            <FormattedMessage
              id="当日还款率"
              defaultMessage="Today Repayment Ratio"
            />
          }
          action={
            <Tooltip
              title={<FormattedMessage id="指标说明" />}
            >
              <Icon type="info-circle-o" />
            </Tooltip>
          }
          total={`${abstract.dayRepaymentRate}%`}
          footer={
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
              <Trend
                flag={dayTrendFlag}
                style={{ marginRight: 16 }}
              >
                <FormattedMessage id="日环比" />
                <span className={styles.trendText}>{Math.abs(abstract.dayRepaymentPro)}%</span>
              </Trend>
              <Trend
                flag={weekTrendFlag}
              >
                <FormattedMessage id="周同比" />
                <span className={styles.trendText}>{Math.abs(abstract.weekRepaymentRate)}%</span>
              </Trend>
            </div>
          }
          contentHeight={26}
        >
          <MiniProgress percent={abstract.dayRepaymentRate} strokeWidth={8} target={80} color="#13C2C2" />
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title={<FormattedMessage id="当日放款金额（万元）" />}
          action={
            <Tooltip
              title={<FormattedMessage id="指标说明" />}
            >
              <Icon type="info-circle-o" />
            </Tooltip>
          }
          loading={loading}
          total={() => <Yuan>{abstract.dayLoanAmount}</Yuan>}
          footer={
            <Field
              label={<FormattedMessage id="当月预计放款金额（万元）" />}
              value={`${numeral(abstract.curMonthPredictLoanAmount).format('0,0.0')} ₫`}
            />
          }
          contentHeight={26}
        >
          &nbsp;
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title={<FormattedMessage id="累计放款金额（万元）" />}
          action={
            <Tooltip
              title={<FormattedMessage id="指标说明" />}
            >
              <Icon type="info-circle-o" />
            </Tooltip>
          }
          loading={loading}
          total={() => <Yuan>{abstract.totalLoanAmount}</Yuan>}
          footer={
            <Field
              label={<FormattedMessage id="月均放款金额（万元）" />}
              value={`${numeral(abstract.avgMonthLoanAmount).format('0,0.0')} ₫`}
            />
          }
          contentHeight={26}
        >
          &nbsp;
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title={<FormattedMessage id="累计放款笔数" />}
          action={
            <Tooltip
              title={<FormattedMessage id="指标说明" />}
            >
              <Icon type="info-circle-o" />
            </Tooltip>
          }
          loading={loading}
          total={abstract.totalLoanAmountCount}
          footer={
            <Field
              label={<FormattedMessage id="日均放款笔数" />}
              value={abstract.avgDayLoanAmountCount}
            />
          }
          contentHeight={26}
        >
          &nbsp;
        </ChartCard>
      </Col>
    </Row>
  );
});

export default Abstract;
