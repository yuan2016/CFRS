<template>
  <div class="hourlyRepaymentRatePic">
    <div id="hourlyRepaymentRatePic-pic" style="width: 100%;height: 100%;"></div>
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
  import { getHourlyRepaymentRatePic } from '../../../common/js/api'

  export default {
    created () {
      this.date = this.message.split('-')
      this.date = this.date.join('.').slice(5)
      this.hour = this.info
      this.getDataInit()
    },
    data () {
      return {
        dates: [],
        f21RepaymentedAmount: [],
        f21RateRepaymented: [],
        fv21RepaymentedAmount: [],
        fv21RateRepaymented: [],
        date: '',
        hour: '',
        data: []
      }
    },
    watch: {
      message: function () {
        this.date = this.message.split('-')
        this.date = this.date.join('.').slice(5)
        this.getDataInit()
      },
      info: function () {
        this.hour = this.info
        this.getDataInit()
      },
      data: function () {
        this.initData()
      }
    },
    props: ['message', 'info'],
    methods: {
      formatTime (v) {
        if (v) {
          return ' ' + v.slice(1) + '时'
        }
      },
      getDataInit () {
        getHourlyRepaymentRatePic({
          date: this.message,
          hour: this.hour}).then((res) => {
          if (res.data) {
            this.data = res.data
            this.dates = this.data[0]
            this.f21RepaymentedAmount = this.data[1]
            this.f21RateRepaymented = this.data[2]
            this.fv21RepaymentedAmount = this.data[3]
            this.fv21RateRepaymented = this.data[4]
          } else {
            this.dates = []
            this.f21RepaymentedAmount = []
            this.f21RateRepaymented = []
            this.fv21RepaymentedAmount = []
            this.fv21RateRepaymented = []
          }
        }).catch(() => {
          this.dates = []
          this.f21RepaymentedAmount = []
          this.f21RateRepaymented = []
          this.fv21RepaymentedAmount = []
          this.fv21RateRepaymented = []
          this.$message({
            message: '数据正在更新，请稍候',
            type: 'warning'
          })
        })
      },
      initData () {
        this.chart = echarts.init(document.getElementById('hourlyRepaymentRatePic-pic'))
        const option = {
          //标题
          title: {
            text: '分时段还款率',
            left: 'center',
            padding: [0, 0, 0, 0],
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
            formatter: '{b}日' + this.formatTime(this.hour) + '<br />{a0}: {c0}<br />{a1}: {c1}<br />{a2}: {c2}<br />{a3}: {c3}',
            backgroundColor: 'rgba(230,230,250,0.7)',
            textStyle: {color: '#06061b', align: 'left'},
            axisPointer: {
              type: 'shadow',
              label: {
                backgroundColor: '#F0F8FF'
              }
            }
          },
          grid: {
            x: 10,
            y: 70,
            x2: 20,
            y2: 0,
            containLabel: true
          },
          //图例组件，颜色和名字
          legend: {
            x: 'right',
            y: 'top',
            padding: [35, 20, 0, 0],
            top: 0,
            itemGap: 16,
            itemWidth: 18,
            itemHeight: 10,
            data: [{
              name: '21天分期还款率(%)'
            }, {
              name: '21天分期提额还款率(%)'
            }, {
              name: '21天分期还款金额'
            }, {
              name: '21天分期提额还款金额'
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
              data: this.dates,
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
          //纵轴
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
            },
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
              type: 'slider',
              start: 0,
              end: 100,
              handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
              handleSize: '110%',
              handleStyle: {
                color: '#9B4E4E'
              }
            }
          ],
          //工具栏
          toolbox: {
            show: true,
            x: 'left',
            padding: [30, 0, 0, 31],
            showTitle: false,
            feature: {
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          //主题图（柱子或者折线）
          series: [
            {
              yAxisIndex: 0,
              name: '21天分期还款率(%)',
              type: 'line',
              symbolSize: 10,
              symbol: 'circle',
              itemStyle: {
                normal: {
                  color: '#3bbb06',
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
              data: this.f21RateRepaymented
            }, {
              yAxisIndex: 0,
              name: '21天分期提额还款率(%)',
              type: 'line',
              symbolSize: 10,
              symbol: 'circle',
              itemStyle: {
                normal: {
                  color: '#6495ED',
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
              data: this.fv21RateRepaymented
            }, {
              yAxisIndex: 1,
              name: '21天分期还款金额',
              type: 'line',
              symbolSize: 10,
              symbol: 'circle',
              itemStyle: {
                normal: {
                  color: '#E27E80',
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
              data: this.f21RepaymentedAmount
            }, {
              yAxisIndex: 1,
              name: '21天分期提额还款金额',
              type: 'line',
              symbolSize: 10,
              symbol: 'circle',
              itemStyle: {
                normal: {
                  color: '#75b9de',
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
              data: this.fv21RepaymentedAmount
            }
          ]
        }
        this.chart.setOption(option)
        window.addEventListener('resize', this.chart.resize)
        window.addEventListener('mouseover', this.chart.resize)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .hourlyRepaymentRatePic
    width: 100%
    height: 100%
</style>
