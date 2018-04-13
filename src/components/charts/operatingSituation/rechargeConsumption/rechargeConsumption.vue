<template>
  <div class="rechargeConsumption">
    <div id="rechargeConsumption-pic" style="width: 100%;height: 100%;"></div>
  </div>
</template>

<script>
  import echarts from 'echarts/lib/echarts'
  // 引入柱状图
  import 'echarts/lib/component/title'
  import 'echarts/lib/component/legend'
  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/toolbox'
  import 'echarts/lib/chart/line'
  import 'echarts/lib/component/dataZoom'
  import { getRechargeConsumption } from '../../../../common/js/api'

  export default {
    created () {
      this.getDataInit()
    },
    watch: {
      message: function () {
        this.getDataInit()
      },
      data: function () {
        this.initData()
      }
    },
    props: ['message'],
    data () {
      return {
        date: [],
        value: [],
        chart: {},
        data: {},
        dfrecharge_amt: '',
        darecharge_amt: '',
        dcoin1_consumption: ''
      }
    },
    methods: {
      getDataInit () {
        getRechargeConsumption({startTime: this.message}).then((res) => {
          if (res.data) {
            this.data = res.data
            this.date = res.data.a
            this.dfrecharge_amt = res.data.b
            this.darecharge_amt = res.data.c
            this.dcoin1_consumption = res.data.d
          } else {
            this.date = []
            this.dfrecharge_amt = []
            this.darecharge_amt = []
            this.dcoin1_consumption = []
          }
        }).catch(() => {
          this.date = []
          this.dfrecharge_amt = []
          this.darecharge_amt = []
          this.dcoin1_consumption = []
          this.$message({
            message: '数据正在更新，请稍候',
            type: 'warning'
          })
        })
      },
      initData () {
        this.chart = echarts.init(document.getElementById('rechargeConsumption-pic'))
        const option = {
          //标题
          title: {
            text: '充值消耗金额趋势',
            left: 'center',
            y: 0,
            textStyle: {
              color: '#666',
              fontStyle: 'normal',
              fontFamily: '微软雅黑',
              fontSize: 14
            }
          },
          //背景
          backgroundColor: '#fff',
          //提示框组件
          tooltip: {
            trigger: 'axis',
            formatter: '{b}<br>{a0}: {c0}<br>{a1}: {c1}<br>{a2}: {c2}',
            backgroundColor: 'rgba(230,230,250,0.7)',
            textStyle: {color: '#06061b', align: 'left'},
            axisPointer: {
              type: 'shadow',
              label: {
                backgroundColor: '#F0F8FF'
              }
            }
          },
          //位置
          grid: {
            x: 0,
            y: 70,
            x2: '6%',
            y2: 24,
            containLabel: true
          },
          //工具栏
          toolbox: {
            show: true,
            x: 'left',
            padding: [30, 0, 0, 18],
            showTitle: false,
            feature: {
//              magicType: {show: true, type: ['bar']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          //图例组件，颜色和名字
          legend: {
            right: 10,
            y: 30,
            itemGap: 10,
            itemWidth: 18,
            itemHeight: 10,
            data: [{
              name: '日首充总额'
            }, {
              name: '日复冲充总额'
            }, {
              name: '日拍币消耗总额'
            }],
            textStyle: {
              color: '#a8aab0',
              fontStyle: 'normal',
              fontFamily: '微软雅黑',
              fontSize: 12
            }
          },
          //横轴
          xAxis: [
            {
              show: true,
              type: 'category',
              boundaryGap: true,
              //坐标轴两边留白
              data: this.date,
              axisLabel: { //坐标轴刻度标签的相关设置。
                interval: 'auto',
                //设置为 1，表示『隔一个标签显示一个标签』
                margin: 15,
                textStyle: {
                  color: '#078ceb',
                  fontStyle: 'normal',
                  fontFamily: '微软雅黑',
                  fontSize: 12
                }
              },
              //坐标轴刻度相关设置。
              axisTick: {
                show: true,
                alignWithLabel: true
              },
              //坐标轴轴线相关设置
              axisLine: {
                lineStyle: {
                  color: '#3E98C5',
                  opacity: 0.8
                }
              },
              //坐标轴在 grid 区域中的分隔线。
              splitLine: {
                show: false
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              splitNumber: 5,
              axisLabel: {
                textStyle: {
                  color: '#a8aab0',
                  fontStyle: 'normal',
                  fontFamily: '微软雅黑',
                  fontSize: 12
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#3E98C5',
                  opacity: 0.8
                }
              },
              axisTick: {
                show: false
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: ['#3E98C5'],
                  opacity: 0.2
                }
              },
              splitArea: {
                show: true,
                areaStyle: {
                  color: [
                    'rgba(250,250,250,0.3)',
                    'rgba(200,200,200,0.1)'
                  ]
                }
              }
            }
          ],
          //数据区域缩放
          dataZoom: [
            {
              show: false,
              height: 20,
              xAxisIndex: [0],
              bottom: 0,
              start: 70,
              end: 100,
              type: 'slider',
              handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
              handleSize: '110%',
              handleStyle: {
                color: '#9B4E4E'
              }
            },
            {
              show: true,
              type: 'inside',
              height: 15,
              start: 1,
              end: 35
            }
          ],
          series: [
            {
              name: '日首充总额',
              type: 'line',
//              symbolSize: 10,
//              symbol: 'circle',
              itemStyle: {
                normal: {
                  color: '#ffb980',
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    position: 'top',
                    formatter: function (p) {
                      return p.value > 0 ? (p.value) : ''
                    }
                  }
                }
              },
              data: this.dfrecharge_amt
            },
            {
              name: '日复冲充总额',
              type: 'line',
//              symbolSize: 10,
//              symbol: 'circle',
              itemStyle: {
                normal: {
                  color: '#6ba3cb',
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    position: 'top',
                    formatter: function (p) {
                      return p.value > 0 ? (p.value) : ''
                    }
                  }
                }
              },
              data: this.darecharge_amt
            },
            {
              name: '日拍币消耗总额',
              type: 'line',
//              symbolSize: 10,
//              symbol: 'circle',
              itemStyle: {
                normal: {
                  color: '#2ec7c9',
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    position: 'top',
                    formatter: function (p) {
                      return p.value > 0 ? (p.value) : ''
                    }
                  }
                }
              },
              data: this.dcoin1_consumption
            }]
        }
        this.chart.setOption(option)
        window.addEventListener('resize', this.chart.resize)
        window.addEventListener('mouseover', this.chart.resize)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .rechargeConsumption
    width: 100%
    height: 100%
</style>
