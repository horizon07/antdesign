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
  total: formatMessage({ id: '放款金额（万元）' }),
  newRate: formatMessage({ id: '首次用信占比' })
}

class Loans extends React.Component {
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
    const { loans } = this.props;

    const data = loans.map(l => ({ ...l, createTime: moment(l.createTime).format('DD/MM'), newRate: l.newRate * 100 }));

    const scale = {
      total: {
        min: 0,
        alias: legends.total
      },
      newRate: {
        min: 0,
        alias: legends.newRate
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
              value: 'total',
              marker: {
                symbol: "circle",
                fill: "#3182bd",
                radius: 5
              }
            },
            {
              value: 'newRate',
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
          name="total"
          grid={null}
          label={{
            textStyle: {
              fill: "#3182bd"
            }
          }}
        />
        <Axis
          name="newRate"
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
          position="createTime*total"
          color="#3182bd"
          tooltip={['createTime*total', (createTime, total) => {
            return {
              name: legends.total,
              value: total
            };
          }]}
        />
        <Geom
          type="line"
          position="createTime*newRate"
          color="#13c2c2"
          size={3}
          shape="smooth"
          tooltip={['createTime*newRate', (createTime, newRate) => {
            return {
              name: legends.newRate,
              value: `${newRate}%`
            };
          }]}
        />
        <Geom
          type="point"
          position="createTime*newRate"
          color="#13c2c2"
          size={3}
          shape="circle"
        />
      </Chart>
    );
  }
}

export default Loans;
