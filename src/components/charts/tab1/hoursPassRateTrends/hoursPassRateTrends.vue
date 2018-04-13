<template>
  <div class="hoursPassRateTrends">
    <div id="hoursPassRateTrends-pic" style="width: 100%;height: 100%;"></div>
  </div>
</template>

<script>
  import echarts from 'echarts/lib/echarts'
  // 引入柱状图
  import 'echarts/lib/chart/bar'
  import 'echarts/lib/component/title'
  import 'echarts/lib/component/legend'
  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/toolbox'
  import 'echarts/lib/component/dataZoom'
  import { getHoursPassRateTrends } from '../../../../common/js/api'

  export default {
    created () {
      this.getDataInit()
    },
    data () {
      return {
        data: {},
        data0: [],
        data1: [],
        data2: []
      }
    },
    watch: {
      data: function () {
        this.initData()
      }
    },
    methods: {
      getDataInit () {
        getHoursPassRateTrends().then((res) => {
          if (res.data[0]) {
            this.data = res.data
            this.data0 = res.data[0]
            this.data1 = res.data[1]
            this.data2 = res.data[2]
          } else {
            this.data0 = []
            this.data1 = []
            this.data2 = []
          }
        }).catch(() => {
          this.data0 = []
          this.data1 = []
          this.data2 = []
          this.$message({
            message: '数据正在更新，请稍候',
            type: 'warning'
          })
        })
      },
      initData () {
        this.chart = echarts.init(document.getElementById('hoursPassRateTrends-pic'))
        const option = {
          //标题
          title: {
            text: '通过率申请人数最近24小时变化情况',
            left: 'center',
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
            x: 0,
            y: 70,
            x2: 5,
            y2: 0,
            containLabel: true
          },
          //图例组件，颜色和名字
          legend: {
            right: 10,
            y: 25,
            itemGap: 16,
            itemWidth: 18,
            itemHeight: 10,
            data: [{
              name: '通过率(%)'
            }, {
              name: '申请人数'
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
              data: this.data0 || ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
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
              name: '通过率(%)',
              type: 'value',
              splitNumber: 5,
              axisLabel: {
                textStyle: {
                  color: '#a8aab0',
                  fontStyle: 'normal',
                  fontFamily: '微软雅黑',
                  padding: [0, 0, 0, 10],
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
                show: false,
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
              name: '申请人数',
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
          //工具栏
          toolbox: {
            show: true,
            x: 'left',
            padding: [20, 0, 0, 30],
            showTitle: false,
            feature: {
              magicType: {show: true, type: ['bar']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          //数据区域缩放
          dataZoom: [
            {
              show: false,
              height: 20,
              xAxisIndex: [0],
              bottom: 0,
              type: 'slider',
              start: 0,
              end: 20,
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
              start: 0,
              end: 30
            }
          ],
          series: [
            {
              yAxisIndex: 0,
              name: '通过率(%)',
              type: 'line',
              symbolSize: 10,
              symbol: 'circle',
              itemStyle: {
                normal: {
                  color: '#DAA520',
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
              data: this.data2
            }, {
              yAxisIndex: 1,
              name: '申请人数',
              type: 'bar',
              data: this.data1,
              barWidth: 20,
              barGap: 0.2,
              //柱间距离
              label: {//图形上的文本标签
                normal: {
                  show: false,
                  position: 'inside',
                  textStyle: {
                    color: '#a8aab0',
                    fontStyle: 'normal',
                    fontFamily: '微软雅黑',
                    fontSize: 12
                  }
                }
              },
              itemStyle: {//图形样式
                normal: {
                  barBorderRadius: [5, 5, 0, 0],
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 1, color: 'rgba(226,56,196,0.7)'
                  }, {
                    offset: 0.6, color: 'rgba(138,43,226,0.7)'
                  }, {
                    offset: 0.4, color: 'rgba(30,144,255, 0.7)'
                  }, {
                    offset: 0, color: 'rgba(72,209,204, 0.7)'
                  }], false)
                }
              }
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
  .hoursPassRateTrends
    width: 100%
    height: 100%
</style>
