<template>
  <div class="rejectedResons20">
    <div id="rejectedResons20-pic" style="width: 100%;height: 100%;"></div>
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
  import { getRejectedReasons20 } from '../../../../common/js/api'

  export default {
    props: ['times', 'channelTiTle'],
    watch: {
      times: function () {
        this.period = this.times
        this.getDataInit()
      },
      channelTiTle: function () {
        this.channelName = this.channelTiTle
        this.getDataInit()
      },
      data: function () {
        this.initData()
      }
    },
    data () {
      return {
        channelName: '',
        period: '',
        reasons: [],
        num: [],
        data: {}
      }
    },
    created () {
      // this.getDataInit()
    },
    methods: {
      parseArrToInt (arr) {
        return arr.map(a => {
          a = parseInt(a)
          return a
        })
      },
      getDataInit () {
//        this.axios.post('/api/rejectedResons20', {
//          channelName: this.channelName,
//          period: this.period || '日'
//        }).then((response) => {
//          if (response.data.code === '404') {
//            this.$router.push('./404')
//          } else if (response.data.code === '1024') {
//            this.reasons = []
//            this.num = []
//            this.$message({
//              message: '请求超时，请增加搜索条件以便搜索',
//              type: 'warning'
//            })
//          } else {
//            this.data = response.data
//            this.reasons = response.data.a
//            this.num = this.parseArrToInt(response.data.b)
//          }
//        }).catch(() => {
//          this.reasons = []
//          this.num = []
//          this.$message({
//            message: '数据正在更新，请稍候',
//            type: 'warning'
//          })
//        })
        getRejectedReasons20({
          channelName: this.channelName,
          period: this.period || '日'
        }).then((res) => {
          if (res.data) {
            this.data = res.data
            this.reasons = res.data.a
            this.num = this.parseArrToInt(res.data.b)
          } else {
            this.reasons = []
            this.num = []
            this.$message({
              message: '数据正在更新，请稍候',
              type: 'warning'
            })
          }
        }).catch(() => {
          this.reasons = []
          this.num = []
          this.$message({
            message: '数据正在更新，请稍候',
            type: 'warning'
          })
        })
      },
      initData () {
        this.chart = echarts.init(document.getElementById('rejectedResons20-pic'))
        const option = {
          title: {
            text: '被拒原因TOP20',
            left: 'center',
            textStyle: {
              color: '#666',
              fontStyle: 'normal',
              fontFamily: '微软雅黑',
              fontSize: 14
            },
            padding: [20, 0, 0, 0]
          },
          tooltip: {
            trigger: 'axis',
            formatter: '{a} {b}<br/>被拒单数: 共{c}单',
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
            left: '0%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            'axisLabel': {
              'interval': 0,
              formatter: '{value}'
            },
            axisLine: {
              lineStyle: {
                color: '#3E98C5',
                opacity: 0.8
              }
            }
          },
          //工具栏
          toolbox: {
            show: true,
            x: 'left',
            padding: [30, 0, 0, 125],
            showTitle: false,
            feature: {
              magicType: {show: true, type: ['line']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          yAxis: {
            type: 'category',
            data: this.reasons.reverse(),
            axisTick: {
              show: false,
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: '#3E98C5',
                opacity: 0.8
              }
            }
          },
          series: [{
            name: '被拒原因:',
            type: 'bar',
            barGap: 0.2,
            data: this.num.reverse(),
            itemStyle: {//图形样式
              normal: {
                barBorderRadius: [0, 5, 5, 0],
                'color': new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                  'offset': 0,
                  'color': '#ffb069' // 0% 处的颜色
                }, {
                  'offset': 1,
                  'color': '#ec2e85' // 100% 处的颜色
                }], false)
              }
            }
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
  .rejectedResons20
    width: 100%
    height: 100%
</style>
