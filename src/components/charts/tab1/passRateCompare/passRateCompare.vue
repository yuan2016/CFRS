<template>
  <div class="passRateCompare">
    <div id="passRateCompare-pic" style="width: 100%;height: 100%;"></div>
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
  import { getPassRateCompare } from '../../../../common/js/api'

  export default {
    created () {
      // this.title = this.message.split('-')
      // this.title = this.title.join('.').slice(5)
      // this.name = this.info.split('-')
      // this.name = this.name.join('.').slice(5)
      // this.getDataInit()
    },
    data () {
      return {
        data0: [],
        data1: [],
        title: '',
        name: '',
        data: {}
      }
    },
    watch: {
      message: function () {
        this.title = this.message.split('-')
        this.title = this.title.join('.').slice(5)
        this.getDataInit()
      },
      info: function () {
        this.name = this.info.split('-')
        this.name = this.name.join('.').slice(5)
        this.getDataInit()
      },
      data: function () {
        this.initData()
      }
    },
    props: ['message', 'info'],
    methods: {
      getDataInit () {
        getPassRateCompare({
          start: this.message,
          end: this.info}).then((res) => {
          if (res.data) {
            this.data = res.data
            this.data0 = res.data[1]
            this.data1 = res.data[0]
          } else {
            this.data0 = []
            this.data1 = []
          }
        }).catch(() => {
          this.data0 = []
          this.data1 = []
          this.$message({
            message: '数据正在更新，请稍候',
            type: 'warning'
          })
        })
      },
      initData () {
        this.chart = echarts.init(document.getElementById('passRateCompare-pic'))
        const option = {
          //标题
          title: {
            text: '通过率申请人数趋势比较',
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
            formatter: '{b}时<br />{a0}: {c0}<br />{a1}: {c1}',
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
              name: this.name + '通过率(%)'
            }, {
              name: this.title + '通过率(%)'
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
              data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
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
              start: 30,
              end: 78,
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
          //工具栏
          toolbox: {
            show: true,
            x: 'left',
            padding: [30, 0, 0, 31],
            showTitle: false,
            feature: {
              magicType: {show: true, type: ['bar']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          //主题图（柱子或者折线）
          series: [
            {
              yAxisIndex: 0,
              name: this.name + '通过率(%)',
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
              data: this.data0
            }, {
              yAxisIndex: 0,
              name: this.title + '通过率(%)',
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
              data: this.data1
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
  .passRateCompare
    width: 100%
    height: 100%
</style>
