<template>
  <div class="conversionFunnel">
    <div id="conversionFunnel-pic" style="width: 100%;height: 100%;"></div>
  </div>
</template>

<script>
  import echarts from 'echarts/lib/echarts'
  // 引入柱状图
  import 'echarts/lib/component/title'
  import 'echarts/lib/component/legend'
  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/toolbox'
  import 'echarts/lib/chart/funnel'
  import 'echarts/lib/component/dataZoom'
  import { getConversionFunnel } from '../../../../common/js/api'

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
        register_num: '',
        recharge_num: '',
        real_win_num: ''
      }
    },
    methods: {
      getDataInit () {
        getConversionFunnel().then((res) => {
          if (res.data) {
            this.data = res.data
            this.date = res.data.a
            this.register_num = res.data.b || '0'
            this.recharge_num = res.data.c || '0'
            this.real_win_num = res.data.d || '0'
          } else {
            this.date = []
            this.register_num = []
            this.recharge_num = []
            this.real_win_num = []
          }
        }).catch(() => {
          this.date = []
          this.hrecharge_conis = []
          this.hcoin_consumption = []
          this.$message({
            message: '数据正在更新，请稍候',
            type: 'warning'
          })
        })
      },
      initData () {
        this.chart = echarts.init(document.getElementById('conversionFunnel-pic'))
        const option = {
          //标题
          title: {
            text: ' 转化漏斗',
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
            formatter: '{b} : {c}',
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
            right: 10,
            y: 30,
            itemGap: 10,
            itemWidth: 18,
            itemHeight: 10,
            data: [{
              name: '总注册用户数量'
            }, {
              name: '总充值人数'
            }, {
              name: '真实中拍人数'
            }],
            textStyle: {
              color: '#a8aab0',
              fontStyle: 'normal',
              fontFamily: '微软雅黑',
              fontSize: 12
            }
          },
          calculable: true,
          series: [
            {
              name: '漏斗图',
              type: 'funnel',
              width: '40%',
              height: '45%',
              left: '30%',
              top: '80',
              funnelAlign: 'left',
              center: ['25%', '25%'],  // for pie
              label: {
                normal: {
                  position: 'left'
                }
              },
              data: [
                {value: this.register_num, name: '总注册用户数量'},
                {value: this.recharge_num, name: '总充值人数'},
                {value: this.real_win_num, name: '真实中拍人数'}]
            }],
          color: ['#0864FF', '#409eff', '#8DC9FF']
        }
        this.chart.setOption(option)
        window.addEventListener('resize', this.chart.resize)
        window.addEventListener('mouseover', this.chart.resize)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .conversionFunnel
    width: 100%
    height: 100%
</style>
