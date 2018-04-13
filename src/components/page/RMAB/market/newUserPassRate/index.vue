<template>
  <div class="newCustomerPassRate">
    <banner></banner>
    <div class="newCustomerPassRate-table">
      <el-select v-model.trim="model" size="mini" placeholder="请选择" class="table-to-pic" @change="goTo">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-tabs v-model="activeName" @tab-click="onTabClick" class="tabs">
        <el-tab-pane label="通过率" name="tab1" class="is-active"></el-tab-pane>
        <el-tab-pane label="渠道分析" name="tab2"></el-tab-pane>
        <el-tab-pane label="被拒原因" name="tab3"></el-tab-pane>
        <router-view></router-view>
      </el-tabs>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import banner from '../../../../common/banner/banner'

  export default {
    data() {
      return {
        activeName: 'tab1',
        model: './tab1',
        options: [{
          label: '图',
          value: './tab1'
        }, {
          label: '表',
          value: './loanThroughRate'
        }]
      }
    },
    components: {
      banner
    },
    methods: {
      onTabClick () {
       this.$router.push(this.activeName)
      },
      goTo() {
        this.$router.push({path: '/RMAB/market/newUserPassRate/loanThroughRate'})
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .newCustomerPassRate-table
    position: relative
    .table-to-pic
      position: absolute
      top: 5px
      width:100px
      z-index:10
    .tabs
      margin-top :10px
      .el-tabs__content
        z-index: 99

</style>
