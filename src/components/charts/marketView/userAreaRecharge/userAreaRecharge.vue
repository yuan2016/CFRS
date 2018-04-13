<template>
  <div class="userAreaRecharge">
    <div id="userAreaRecharge-pic" style="width: 100%;height: 100%;"></div>
  </div>
</template>

<script>
  import echarts from 'echarts/lib/echarts'
  // 引入柱状图
  import 'echarts/lib/component/title'
  import 'echarts/lib/component/legend'
  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/toolbox'
  import 'echarts/lib/chart/pie'
  import 'echarts/lib/component/dataZoom'
  import { getUserAreaRecharge } from '../../../../common/js/api'

  export default {
    created () {
      this.getDataInit()
    },
    watch: {
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
        arr: {},
        name: {}
      }
    },
    methods: {
      getDataInit () {
        getUserAreaRecharge().then((res) => {
          if (res.data) {
            this.data = res.data
            this.arr = res.data.a
            this.name = res.data.b
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
        this.chart = echarts.init(document.getElementById('userAreaRecharge-pic'))
        const option = {
          //标题
          title: {
            text: '用户区域充值分析',
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
            trigger: 'item',
            formatter: '{b} 用户充值金额: {c}({d}%)',
            backgroundColor: 'rgba(230,230,250,0.7)',
            textStyle: {color: '#06061b', align: 'left'},
            axisPointer: {
              type: 'shadow',
              label: {
                backgroundColor: '#F0F8FF'
              }
            }
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
            orient: 'vertical',
            right: '10',
            top: '50',
            bottom: 20,
            data: this.name,
            textStyle: {
              color: '#a8aab0',
              fontStyle: 'normal',
              fontFamily: '微软雅黑',
              fontSize: 12
            }
          },
          series: [
            {
              name: '比例',
              type: 'pie',
              top: '100',
              radius: '65%',
              center: ['43%', '60%'],
              data: this.arr,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }],
          color: ['#5ab1ef', '#b6a2de', '#2ec7c9', '#ffb980', '#d87a80', '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa', '#2f4554']
        }
        this.chart.setOption(option)
        window.addEventListener('resize', this.chart.resize)
        window.addEventListener('mouseover', this.chart.resize)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .userAreaRecharge
    width: 100%
    height: 100%
</style>
