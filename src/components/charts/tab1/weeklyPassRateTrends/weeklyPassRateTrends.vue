<template>
  <div class="weeklyPassRateTrends">
    <div id="weeklyPassRateTrends-pic" style="width: 100%;height: 100%;"></div>
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
  import { getWeeklyPassRateTrends } from '../../../../common/js/api'

  export default {
    data () {
      return {
        data: {},
        date: '',
        value: ''
      }
    },
    watch: {
      data: function () {
        this.initData()
      }
    },
    created () {
      this.getDataInit()
    },
    methods: {
      getDataInit () {
        getWeeklyPassRateTrends().then((res) => {
          if (res.data) {
            this.data = res.data
            this.date = res.data.a
            this.value = res.data.b
          } else {
            this.date = []
            this.value = []
          }
        }).catch(() => {
          this.date = []
          this.value = []
          this.$message({
            message: '数据正在更新，请稍候',
            type: 'warning'
          })
        })
      },
      initData () {
        this.chart = echarts.init(document.getElementById('weeklyPassRateTrends-pic'))
        const option = {
          //标题
          title: {
            text: '通过率周趋势',
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
            formatter: '{b}<br/>{a}: {c}',
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
            x: '1%',
            y: 70,
            x2: '47',
            y2: 0,
            containLabel: true
          },
          //图例组件，颜色和名字
          legend: {
            right: 10,
            y: 30,
            itemGap: 16,
            itemWidth: 18,
            itemHeight: 10,
            data: [{
              name: '通过率(%)'
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
                },
                formatter: function (val) {
                  return val.split('-').join('\n-\n')
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
          //工具栏
          toolbox: {
            show: true,
            x: 'left',
            padding: [30, 0, 0, 26],
            showTitle: false,
            feature: {
              magicType: {show: true, type: ['line']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
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
              start: 70,
              end: 100,
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
              name: '通过率(%)',
              type: 'bar',
              data: this.value,
              barWidth: 20,
              barGap: 0,
              //柱间距离
              label: {//图形上的文本标签
                normal: {
                  show: true,
                  position: 'top',
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
                    offset: 1, color: 'rgba(127, 128, 225, 0.7)'
                  }, {
                    offset: 0.9, color: 'rgba(72, 73, 181, 0.7)'
                  }, {
                    offset: 0.31, color: 'rgba(0, 208, 208, 0.7)'
                  }, {
                    offset: 0.15, color: 'rgba(0, 208, 208, 0.7)'
                  }, {
                    offset: 0, color: 'rgba(104, 253, 255, 0.7)'
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
  .weeklyPassRateTrends
    width: 100%
    height: 100%
</style>
