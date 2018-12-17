import React from "react";
import { findDOMNode } from 'react-dom';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from "bizcharts";
import {
  formatMessage,
} from 'umi/locale';
import moment from 'moment';

const legends = {
  applyNum: formatMessage({ id: '申请笔数' }),
  passRate: formatMessage({ id: '申请通过率' })
}

class Applications extends React.Component {
  state = {
    height: 200,
    g2Chart: null
  };

  componentDidMount() {
    this.updateChartHeight();

    window.addEventListener('resize', this.updateChartHeight);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateChartHeight);
  }

  legendItemFormatter = (value) => legends[value];

  updateChartHeight = () => {
    const width = this.chart ? findDOMNode(this.chart).offsetWidth : null;
    const height = width ? (width * 9 / 16) : 200;

    this.setState({
      height
    });
  };

  render() {
    const { applications } = this.props;

    const data = applications.map(a => ({ ...a, createTime: moment(a.createTime).format('DD/MM'), passRate: a.passRate * 100 }));

    const scale = {
      applyNum: {
        min: 0,
        alias: legends.applyNum
      },
      passRate: {
        min: 0,
        alias: legends.passRate
      }
    };

    return (
      <Chart
        height={this.state.height}
        padding="auto"
        scale={scale}
        forceFit={true}
        data={data}
        onGetG2Instance={g2Chart => {
          this.setState({
            g2Chart
          })
        }}
        ref={ref => {
          this.chart = ref;
        }}
      >
        <Legend
          custom={true}
          allowAllCanceled={true}
          offsetY={-10}
          position="top-center"
          itemFormatter={this.legendItemFormatter}
          items={[
            {
              value: 'applyNum',
              marker: {
                symbol: "circle",
                fill: "#3182bd",
                radius: 5
              }
            },
            {
              value: 'passRate',
              marker: {
                symbol: "circle",
                fill: "#13c2c2",
                radius: 5
              }
            }
          ]}
          onClick={ev => {
            const { item, checked } = ev;
            const { value } = item;
            const geoms = this.state.g2Chart.getAllGeoms();

            for (let i = 0; i < geoms.length; i++) {
              const geom = geoms[i];

              if (geom.getYScale().field === value) {
                if (checked) {
                  geom.show();
                } else {
                  geom.hide();
                }
              }
            }
          }}
        />
        <Axis
          name="applyNum"
          grid={null}
          label={{
            textStyle: {
              fill: "#3182bd"
            }
          }}
        />
        <Axis
          name="passRate"
          grid={null}
          label={{
            textStyle: {
              fill: "#13c2c2"
            },
            formatter (text) {
              return `${text}%`
            }
          }}
        />
        <Tooltip />
        <Geom
          type="interval"
          position="createTime*applyNum"
          color="#3182bd"
          tooltip={['createTime*applyNum', (createTime, applyNum) => {
            return {
              name: legends.applyNum,
              value: applyNum
            };
          }]}
        />
        <Geom
          type="line"
          position="createTime*passRate"
          color="#13c2c2"
          size={3}
          shape="smooth"
          tooltip={['createTime*passRate', (createTime, passRate) => {
            return {
              name: legends.passRate,
              value: `${passRate}%`
            };
          }]}
        />
        <Geom
          type="point"
          position="createTime*passRate"
          color="#13c2c2"
          size={3}
          shape="circle"
        />
      </Chart>
    );
  }
}

export default Applications;
