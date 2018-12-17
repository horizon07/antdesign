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
  sevPayNew: formatMessage({ id: '近七日平均还款比率' }),
  newCurPayNew: formatMessage({ id: '首次用信当日还款比率' }),
  oldCurPayNew: formatMessage({ id: '非首次用信当日还款比率' })
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
    const { repayments } = this.props;

    const data = repayments.map(r => ({ ...r, avgSevPayMoney: r.avgSevPayMoney * 100, dayPayMoney: r.dayPayMoney * 100, yesPayMoney: r.yesPayMoney * 100 }));

    const maxValue = Math.max(...data.map(r => Math.max(r.avgSevPayMoney, r.dayPayMoney, r.yesPayMoney)));

    const scale = {
      createTime: {
        type: 'cat',
        range: [0, 1]
      },
      sevPayNew: {
        min: 0,
        max: maxValue || 100,
        alias: formatMessage({ id: '还款比率' })
      },
      newCurPayNew: {
        min: 0,
        max: maxValue || 100
      },
      oldCurPayNew: {
        min: 0,
        max: maxValue || 100
      }
    };

    let chartIns = null;

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
          position="top-center"
          offsetY={-10}
          itemFormatter={this.legendItemFormatter}
          items={[
            {
              value: 'sevPayNew',
              marker: {
                symbol: "circle",
                fill: "#3182bd",
                radius: 5
              }
            },
            {
              value: 'newCurPayNew',
              marker: {
                symbol: "circle",
                fill: "#13c2c2",
                radius: 5
              }
            },
            {
              value: 'oldCurPayNew',
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
        <Axis name="sevPayNew"
          label={{
            formatter (text) {
              return `${text}%`
            }
          }}
        />
        <Axis name="newCurPayNew" visible={false} />
        <Axis name="oldCurPayNew" visible={false} />
        <Tooltip
          crosshairs={{
            type: 'line'
          }}
        />
        <Geom
          type="area"
          position="createTime*sevPayNew"
          color="#3182bd"
          shape="smooth"
          tooltip={false}
        />
        <Geom
          type="line"
          position="createTime*sevPayNew"
          size={2}
          color="#3182bd"
          shape="smooth"
          tooltip={['createTime*sevPayNew', (createTime, sevPayNew) => {
            return {
              name: legends.sevPayNew,
              value: `${sevPayNew}%`
            };
          }]}
        />
        <Geom
          type="area"
          position="createTime*newCurPayNew"
          color="#13c2c2"
          shape="smooth"
          tooltip={false}
        />
        <Geom
          type="line"
          position="createTime*newCurPayNew"
          size={2}
          color="#13c2c2"
          shape="smooth"
          tooltip={['createTime*newCurPayNew', (createTime, newCurPayNew) => {
            return {
              name: legends.newCurPayNew,
              value: `${newCurPayNew}%`
            };
          }]}
        />
        <Geom
          type="area"
          position="createTime*oldCurPayNew"
          color="#ffae6b"
          shape="smooth"
          tooltip={false}
        />
        <Geom
          type="line"
          position="createTime*oldCurPayNew"
          size={2}
          color="#ffae6b"
          shape="smooth"
          tooltip={['createTime*oldCurPayNew', (createTime, oldCurPayNew) => {
            return {
              name: legends.oldCurPayNew,
              value: `${oldCurPayNew}%`
            };
          }]}
        />
      </Chart>
    );
  }
}

export default Credit;
