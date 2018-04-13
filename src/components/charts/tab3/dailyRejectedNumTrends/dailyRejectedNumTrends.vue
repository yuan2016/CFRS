<template>
  <div class="dailyRejectedNumTrends">
    <div id="dailyRejectedNumTrends-pic" style="width: 100%;height: 100%;"></div>
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
  import { getDailyRejectedNumTrends } from '../../../../common/js/api'

  export default {
    props: ['prop'],
    watch: {
      prop: function () {
        this.reason = this.prop
        this.getDataInit()
      },
      data: function () {
        this.initData()
      }
    },
    data () {
      return {
        date: [],
        num: [],
        reason: '',
        data: {}
      }
    },
    created () {
      this.getDataInit()
    },
    methods: {
      getDataInit () {
//        this.axios.post('/api/dailyRejectedNumTrends', {
//          reason: this.reason || '汇总'
//        }).then((response) => {
//          if (response.data.code === '404') {
//            this.$router.push('./404')
//          } else if (response.data.code === '1024') {
//            this.date = []
//            this.num = []
//            this.$message({
//              message: '请求超时，请增加搜索条件以便搜索',
//              type: 'warning'
//            })
//          } else {
//            this.data = response.data
//            this.date = response.data.a
//            this.num = response.data.b
//          }
//        }).catch(() => {
//          this.date = []
//          this.num = []
//          this.$message({
//            message: '数据正在更新，请稍候',
//            type: 'warning'
//          })
//        })
        getDailyRejectedNumTrends({reason: this.reason || '汇总'}).then((res) => {
          if (res.data) {
            this.data = res.data
            this.date = res.data.a
            this.num = res.data.b
          } else {
            this.date = []
            this.num = []
            this.$message({
              message: '数据正在更新，请稍候',
              type: 'warning'
            })
          }
        }).catch(() => {
          this.date = []
          this.num = []
          this.$message({
            message: '数据正在更新，请稍候',
            type: 'warning'
          })
        })
      },
      initData () {
        this.chart = echarts.init(document.getElementById('dailyRejectedNumTrends-pic'))
        const option = {
          //标题
          title: {
            text: '被拒单数日趋势',
            left: 'center',
            textStyle: {
              color: '#666',
              fontStyle: 'normal',
              fontFamily: '微软雅黑',
              fontSize: 14
            },
            padding: [20, 0, 0, 0]
          },
          //背景
          backgroundColor: '#fff',
          //提示框组件
          tooltip: {
            trigger: 'axis',
            formatter: '{b}日<br />{a0}: 共{c0}单<br />',
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
            y: 60,
            x2: 20,
            y2: 0,
            containLabel: true
          },
          //图例组件，颜色和名字
          legend: {
            right: 10,
            top: 0,
            padding: [40, 0, 0, 0],
            itemGap: 16,
            itemWidth: 18,
            itemHeight: 10,
            data: [{
              name: '被拒单数'
            }],
            textStyle: {
              color: '#a8aab0',
              fontStyle: 'normal',
              fontFamily: '微软雅黑',
              fontSize: 12
            }
          },
          //工具栏
          toolbox: {
            show: true,
            x: 'left',
            padding: [30, 0, 0, 40],
            showTitle: false,
            feature: {
              magicType: {show: true, type: ['bar']},
              restore: {show: true},
              saveAsImage: {show: true}
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
              type: 'slider',
              start: 55,
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
              name: '被拒单数',
              type: 'line',
              symbolSize: 10,
              symbol: 'circle',
              itemStyle: {
                normal: {
                  color: '#FF4500',
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
              data: this.num
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
  .dailyRejectedNumTrends
    width: 100%
    height: 100%
</style>
