<div class="selectTags">
  <div class="tagContent">
    <el-tag
      v-for="tag in tags"
      :key="tag.name"
      :closable="true"
      :type="tag.type"
      :close-transition="false"
      @close="handleClose(tag)"
    >
      <a :title="tag.name" :href="tag.href">{{tag.name}}</a>
    </el-tag>
    <i class="el-icon-caret el-icon-caret-bottom"></i>
  </div>
</div>
<script type="text/ecmascript-6">

</script>
<style lang="stylus" rel="stylesheet/stylus">


</style>
