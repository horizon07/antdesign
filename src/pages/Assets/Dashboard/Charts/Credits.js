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

const legends = {
  avgSevPayMoney: formatMessage({ id: '近七日平均授信金额' }),
  dayPayMoney: formatMessage({ id: '当日授信金额' }),
  yesPayMoney: formatMessage({ id: '昨日授信金额' })
}

class Credit extends React.Component {
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
    const { credits } = this.props;

    const maxValue = Math.max(...credits.map(c => Math.max(c.avgSevPayMoney, c.dayPayMoney, c.yesPayMoney)));

    const scale = {
      createTime: {
        type: 'cat',
        range: [0, 1]
      },
      avgSevPayMoney: {
        min: 0,
        max: maxValue || 10000,
        alias: formatMessage({ id: '授信金额（万元）' })
      },
      dayPayMoney: {
        min: 0,
        max: maxValue || 10000
      },
      yesPayMoney: {
        min: 0,
        max: maxValue || 10000
      }
    };

    return (
      <Chart
        height={this.state.height}
        padding="auto"
        scale={scale}
        forceFit={true}
        data={credits}
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
          position="top-center"
          offsetY={-10}
          itemFormatter={this.legendItemFormatter}
          items={[
            {
              value: 'avgSevPayMoney',
              marker: {
                symbol: "circle",
                fill: "#3182bd",
                radius: 5
              }
            },
            {
              value: 'dayPayMoney',
              marker: {
                symbol: "circle",
                fill: "#13c2c2",
                radius: 5
              }
            },
            {
              value: 'yesPayMoney',
              marker: {
                symbol: "circle",
                fill: "#ffae6b",
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
        <Axis name="createTime" />
        <Axis name="avgSevPayMoney" />
        <Axis name="dayPayMoney" visible={false} />
        <Axis name="yesPayMoney" visible={false} />
        <Tooltip
          crosshairs={{
            type: 'line'
          }}
        />
        <Geom
          type="area"
          position="createTime*avgSevPayMoney"
          color="#3182bd"
          shape="smooth"
          tooltip={false}
        />
        <Geom
          type="line"
          position="createTime*avgSevPayMoney"
          size={2}
          color="#3182bd"
          shape="smooth"
          tooltip={['createTime*avgSevPayMoney', (createTime, avgSevPayMoney) => {
            return {
              name: legends.avgSevPayMoney,
              value: avgSevPayMoney
            };
          }]}
        />
        <Geom
          type="area"
          position="createTime*dayPayMoney"
          color="#13c2c2"
          shape="smooth"
          tooltip={false}
        />
        <Geom
          type="line"
          position="createTime*dayPayMoney"
          size={2}
          color="#13c2c2"
          shape="smooth"
          tooltip={['createTime*dayPayMoney', (createTime, dayPayMoney) => {
            return {
              name: legends.dayPayMoney,
              value: dayPayMoney
            };
          }]}
        />
        <Geom
          type="area"
          position="createTime*yesPayMoney"
          color="#ffae6b"
          shape="smooth"
          tooltip={false}
        />
        <Geom
          type="line"
          position="createTime*yesPayMoney"
          size={2}
          color="#ffae6b"
          shape="smooth"
          tooltip={['createTime*yesPayMoney', (createTime, yesPayMoney) => {
            return {
              name: legends.yesPayMoney,
              value: yesPayMoney
            };
          }]}
        />
      </Chart>
    );
  }
}

export default Credit;
