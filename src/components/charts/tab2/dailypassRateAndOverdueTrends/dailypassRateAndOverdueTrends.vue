<template>
  <div class="dailypassRateAndOverdueTrends">
    <div id="dailypassRateAndOverdueTrends-pic" style="width: 100%;height: 100%;"></div>
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
  import { getDailyPassRateAndOverdueTrends } from '../../../../common/js/api'

  export default {
    props: ['prop'],
    watch: {
      prop: function () {
        this.channelName = this.prop
        this.getDataInit()
      },
      data: function () {
        this.initData()
      }
    },
    data () {
      return {
        channelName: '',
        date: [],
        tgl: [],
        yql: [],
        data: {}
      }
    },
    created () {
      this.getDataInit()
    },
    methods: {
      getDataInit () {
//        this.axios.post('/api/dailypassRateAndOverdueTrends/daily', {
//          channelName: this.channelName || '汇总'
//        }).then((response) => {
//          if (response.data.code === '404') {
//            this.$router.push('./404')
//          } else if (response.data.code === '1024') {
//            this.date = []
//            this.tgl = []
//            this.yql = []
//            this.$message({
//              message: '请求超时，请增加搜索条件以便搜索',
//              type: 'warning'
//            })
//          } else {
//            this.data = response.data
//            this.date = response.data.a
//            this.tgl = response.data.b
//            this.yql = response.data.c
//          }
//        }).catch(() => {
//          this.date = []
//          this.tgl = []
//          this.yql = []
//          this.$message({
//            message: '数据正在更新，请稍候',
//            type: 'warning'
//          })
//        })
        getDailyPassRateAndOverdueTrends({channelName: this.channelName || '汇总'}).then((res) => {
          if (res.data) {
            this.data = res.data
            this.date = res.data.a
            this.tgl = res.data.b
            this.yql = res.data.c
          } else {
            this.date = []
            this.tgl = []
            this.yql = []
            this.$message({
              message: '数据正在更新，请稍候',
              type: 'warning'
            })
          }
        }).catch(() => {
          this.date = []
          this.tgl = []
          this.yql = []
          this.$message({
            message: '数据正在更新，请稍候',
            type: 'warning'
          })
        })
      },
      initData () {
        this.chart = echarts.init(document.getElementById('dailypassRateAndOverdueTrends-pic'))
        const option = {
          //标题
          title: {
            text: '通过率/逾期率日趋势',
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
            formatter: '{b}<br />{a0}: {c0}<br />{a1}: {c1}',
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
            y: 80,
            x2: 10,
            y2: 20,
            containLabel: true
          },
          //图例组件，颜色和名字
          legend: {
            right: 10,
            top: 0,
            padding: [35, 20, 0, 0],
            itemGap: 16,
            itemWidth: 18,
            itemHeight: 10,
            data: [{
              name: '通过率(%)'
            }, {
              name: '逾期率(%)'
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
              data: this.date || ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
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
              position: 'left',
              name: '通过率(%)',
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
              position: 'right',
              name: '逾期率(%)',
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
              start: 60,
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
          series: [
            {
              name: '通过率(%)',
              type: 'line',
              symbolSize: 10,
              symbol: 'circle',
              itemStyle: {
                normal: {
                  color: '#3CB371',
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
              data: this.tgl
            }, {
              name: '逾期率(%)',
              type: 'line',
              symbolSize: 10,
              symbol: 'circle',
              itemStyle: {
                normal: {
                  color: '#F08080',
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
              data: this.yql
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
  .dailypassRateAndOverdueTrends
    width: 100%
    height: 100%
</style>
