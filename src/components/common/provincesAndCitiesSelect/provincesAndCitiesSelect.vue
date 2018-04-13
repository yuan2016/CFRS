<template>
  <div class="provincesAndCitiesSelect">
    <el-row :gutter="10">
      <el-col :span="5">
        <el-select size="mini" v-model="province" placeholder="请选择省份" width="300px" filterable @change="provinceChange">
          <el-option
            v-for="item in provinceOptions" :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-select size="mini" v-model="city" placeholder="请选择城市" width="130px" filterable @change="cityChange">
          <el-option
            v-for="item in cityOptions" :key="item.value"
            :label="item.value"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: ['provinceValue', 'cityValue'],
    data: function () {
      return {
        province: this.provinceValue,
        city: this.cityValue,
        provinceOptions: [{
          value: '全国',
          label: '全国'
        }, {
          value: '北京市',
          label: '北京市'
        }, {
          value: '天津市',
          label: '天津市'
        }, {
          value: '上海市',
          label: '上海市'
        }, {
          value: '重庆市',
          label: '重庆市'
        }, {
          value: '新疆维吾尔自治区',
          label: '新疆维吾尔自治区'
        }, {
          value: '广西壮族自治区',
          label: '广西壮族自治区'
        }, {
          value: '西藏自治区',
          label: '西藏自治区'
        }, {
          value: '内蒙古自治区',
          label: '内蒙古自治区'
        }, {
          value: '宁夏回族自治区',
          label: '宁夏回族自治区'
        }, {
          value: '河北省',
          label: '河北省'
        }, {
          value: '河南省',
          label: '河南省'
        }, {
          value: '云南省',
          label: '云南省'
        }, {
          value: '辽宁省',
          label: '辽宁省'
        }, {
          value: '黑龙江省',
          label: '黑龙江省'
        }, {
          value: '湖南省',
          label: '湖南省'
        }, {
          value: '安徽省',
          label: '安徽省'
        }, {
          value: '山东省',
          label: '山东省'
        }, {
          value: '江苏省',
          label: '江苏省'
        }, {
          value: '浙江省',
          label: '浙江省'
        }, {
          value: '江西省',
          label: '江西省'
        }, {
          value: '湖北省',
          label: '湖北省'
        }, {
          value: '甘肃省',
          label: '甘肃省'
        }, {
          value: '山西省',
          label: '山西省'
        }, {
          value: '陕西省',
          label: '陕西省'
        }, {
          value: '吉林省',
          label: '吉林省'
        }, {
          value: '福建省',
          label: '福建省'
        }, {
          value: '贵州省',
          label: '贵州省'
        }, {
          value: '广东省',
          label: '广东省'
        }, {
          value: '青海省',
          label: '青海省'
        }, {
          value: '四川省',
          label: '四川省'
        }, {
          value: '海南省',
          label: '海南省'
        }, {
          value: '台湾省',
          label: '台湾省'
        }, {
          value: '香港特别行政区',
          label: '香港特别行政区'
        }, {
          value: '澳门特别行政区',
          label: '澳门特别行政区'
        }],
        cityOptions: []
      }
    },
    methods: {
      provinceChange (val) {
        let vm = this
        switch (val) {
          case '全国':
            vm.cityOptions = [{'value': '全国'}]
            break
          case '北京市':
            vm.cityOptions = [
              {'value': '全部'},
              {'value': '市辖区'},
              {'value': '市辖县'}
            ]
            break
          case '天津市':
            vm.cityOptions = [
              {'value': '全部'},
              {'value': '市辖区'},
              {'value': '市辖县'}
            ]
            break
          case '上海市':
            vm.cityOptions = [
              {'value': '全部'},
              {'value': '市辖区'},
              {'value': '市辖县'}
            ]
            break
          case '重庆市':
            vm.cityOptions = [
              {'value': '全部'},
              {'value': '市辖区'},
              {'value': '市辖县'}
            ]
            break
          case '新疆维吾尔自治区':
            vm.cityOptions = [
              {'value': '全部'},
              {'value': '乌鲁木齐市'},
              {'value': '克拉玛依市'},
              {'value': '吐鲁番市'},
              {'value': '哈密市'},
              {'value': '昌吉回族自治州'},
              {'value': '博尔塔拉蒙古自治州'},
              {'value': '巴音郭楞蒙古自治州'},
              {'value': '阿克苏地区'},
              {'value': '克孜勒苏柯尔克孜自治州'},
              {'value': '喀什地区'},
              {'value': '和田地区'},
              {'value': '伊犁哈萨克自治州'},
              {'value': '塔城地区'},
              {'value': '阿勒泰地区'},
              {'value': '石河子市'},
              {'value': '阿拉尔市'},
              {'value': '图木舒克市'},
              {'value': '五家渠市'},
              {'value': '北屯市'}
            ]
            break
          case '广西壮族自治区':
            vm.cityOptions = [
              {'value': '全部'},
              {'value': '南宁市'},
              {'value': '柳州市'},
              {'value': '桂林市'},
              {'value': '梧州市'},
              {'value': '北海市'},
              {'value': '防城港市'},
              {'value': '钦州市'},
              {'value': '贵港市'},
              {'value': '玉林市'},
              {'value': '百色市'},
              {'value': '贺州市'},
              {'value': '河池市'},
              {'value': '来宾市'},
              {'value': '崇左市'}
            ]
            break
          case '西藏自治区':
            vm.cityOptions = [
              {'value': '全部'},
              {'value': '拉萨市'},
              {'value': '日喀则市'},
              {'value': '昌都市'},
              {'value': '林芝市'},
              {'value': '山南市'},
              {'value': '那曲地区'},
              {'value': '阿里地区'}
            ]
            break
          case '内蒙古自治区':
            vm.cityOptions = [
              {'value': '全部'},
              {'value': '呼和浩特市'},
              {'value': '包头市'},
              {'value': '乌海市'},
              {'value': '赤峰市'},
              {'value': '通辽市'},
              {'value': '鄂尔多斯市'},
              {'value': '呼伦贝尔市'},
              {'value': '巴彦淖尔市'},
              {'value': '乌兰察布市'},
              {'value': '兴安盟'},
              {'value': '锡林郭勒盟'},
              {'value': '阿拉善盟'}
            ]
            break
          case '宁夏回族自治区':
            vm.cityOptions = [
              {'value': '全部'},
              {'value': '银川市'},
              {'value': '石嘴山市'},
              {'value': '吴忠市'},
              {'value': '固原市'},
              {'value': '中卫市'}
            ]
            break
          case '河北省':
            vm.cityOptions = [
              {'value': '全部'},
              {'value': '石家庄市'},
              {'value': '唐山市'},
              {'value': '秦皇岛市'},
              {'value': '邯郸市'},
              {'value': '邢台市'},
              {'value': '张家口市'},
              {'value': '保定市'},
              {'value': '承德市'},
              {'value': '沧州市'},
              {'value': '廊坊市'},
              {'value': '衡水市'}
            ]
            break
          case '河南省':
            vm.cityOptions = [
              {'value': '全部'},
              {'value': '郑州市'},
              {'value': '开封市'},
              {'value': '洛阳市'},
              {'value': '商丘市'},
              {'value': '安阳市'},
              {'value': '平顶山市'},
              {'value': '新乡市'},
              {'value': '焦作市'},
              {'value': '许昌市'},
              {'value': '漯河市'},
              {'value': '三门峡市'},
              {'value': '鹤壁市'},
              {'value': '周口市'},
              {'value': '驻马店市'},
              {'value': '南阳市'},
              {'value': '信阳市'},
              {'value': '濮阳市'},
              {'value': '济源市'}
            ]
            break
          case '云南省':
            vm.cityOptions = [
              {'value': '全部'},
              {'value': '昆明市'},
              {'value': '曲靖市'},
              {'value': '玉溪市'},
              {'value': '保山市'},
              {'value': '昭通市'},
              {'value': '丽江市'},
              {'value': '普洱市'},
              {'value': '临沧市'},
              {'value': '楚雄彝族自治州'},
              {'value': '红河哈尼族彝族自治州'},
              {'value': '文山壮族苗族自治州'},
              {'value': '西双版纳傣族自治州'},
              {'value': '大理白族自治州'},
              {'value': '德宏傣族景颇族自治州'},
              {'value': '怒江傈僳族自治州'},
              {'value': '迪庆藏族自治州'}
            ]
            break
          case '辽宁省':
            vm.cityOptions = [
              {'value': '全部'},
              {'value': '沈阳市'},
              {'value': '大连市'},
              {'value': '鞍山市'},
              {'value': '抚顺市'},
              {'value': '本溪市'},
              {'value': '丹东市'},
              {'value': '锦州市'},
              {'value': '营口市'},
              {'value': '阜新市'},
              {'value': '辽阳市'},
              {'value': '盘锦市'},
              {'value': '铁岭市'},
              {'value': '朝阳市'},
              {'value': '葫芦岛市'}
            ]
            break
          case '黑龙江省':
            vm.cityOptions = [
              {'value': '全部'},
              {'value': '哈尔滨市'},
              {'value': '齐齐哈尔市'},
              {'value': '鸡西市'},
              {'value': '鹤岗市'},
              {'value': '双鸭山市'},
              {'value': '大庆市'},
              {'value': '伊春市'},
              {'value': '佳木斯市'},
              {'value': '七台河市'},
              {'value': '牡丹江市'},
              {'value': '黑河市'},
              {'value': '绥化市'},
              {'value': '大兴安岭地区'}
            ]
            break
          case '湖南省':
            vm.cityOptions = [
              {'value': '全部'},
              {'value': '长沙市'},
              {'value': '株洲市'},
              {'value': '湘潭市'},
              {'value': '衡阳市'},
              {'value': '邵阳市'},
              {'value': '岳阳市'},
              {'value': '张家界市'},
              {'value': '怀化市'},
              {'value': '常德市'},
              {'value': '益阳市'},
              {'value': '郴州市'},
              {'value': '永州市'},
              {'value': '娄底市'},
              {'value': '湘西土家族苗族自治州'}
            ]
            break
          case '安徽省':
            vm.cityOptions = [
              {'value': '全部'},
              {'value': '合肥市'},
              {'value': '芜湖市'},
              {'value': '蚌埠市'},
              {'value': '马鞍山市'},
              {'value': '安庆市'},
              {'value': '淮南市'},
              {'value': '滁州市'},
              {'value': '铜陵市'},
              {'value': '亳州市'},
              {'value': '淮北市'},
              {'value': '阜阳市'},
              {'value': '宿州市'},
              {'value': '六安市'},
              {'value': '宣城市'},
              {'value': '黄山市'},
              {'value': '池州市'}
            ]
            break
          case '山东省':
            vm.cityOptions = [
              {'value': '全部'},
              {'value': '济南市'},
              {'value': '青岛市'},
              {'value': '淄博市'},
              {'value': '枣庄市'},
              {'value': '东营市'},
              {'value': '烟台市'},
              {'value': '潍坊市'},
              {'value': '济宁市'},
              {'value': '泰安市'},
              {'value': '威海市'},
              {'value': '日照市'},
              {'value': '滨州市'},
              {'value': '德州市'},
              {'value': '聊城市'},
              {'value': '临沂市'},
              {'value': '菏泽市'},
              {'value': '莱芜市'}
            ]
            break
          case '江苏省':
            vm.cityOptions = [
              {'value': '全部'},
              {'value': '南京市'},
              {'value': '无锡市'},
              {'value': '徐州市'},
              {'value': '常州市'},
              {'value': '苏州市'},
              {'value': '南通市'},
              {'value': '扬州市'},
              {'value': '镇江市'},
              {'value': '盐城市'},
              {'value': '淮安市'},
              {'value': '泰州市'},
              {'value': '连云港市'},
              {'value': '宿迁市'}
            ]
            break
          case '浙江省':
            vm.cityOptions = [
              {'value': '全部'},
              {'value': '杭州市'},
              {'value': '宁波市'},
              {'value': '温州市'},
              {'value': '绍兴市'},
              {'value': '湖州市'},
              {'value': '嘉兴市'},
              {'value': '金华市'},
              {'value': '衢州市'},
              {'value': '舟山市'},
              {'value': '台州市'},
              {'value': '丽水市'}
            ]
            break
          case '江西省':
            vm.cityOptions = [
              {'value': '全部'},
              {'value': '南昌市'},
              {'value': '赣州市'},
              {'value': '宜春市'},
              {'value': '吉安市'},
              {'value': '上饶市'},
              {'value': '抚州市'},
              {'value': '九江市'},
              {'value': '景德镇市'},
              {'value': '萍乡市'},
              {'value': '新余市'},
              {'value': '鹰潭市'}
            ]
            break
          case '湖北省':
            vm.cityOptions = [
              {'value': '全部'},
              {'value': '武汉市'},
              {'value': '黄石市'},
              {'value': '十堰市'},
              {'value': '宜昌市'},
              {'value': '襄阳市'},
              {'value': '鄂州市'},
              {'value': '荆门市'},
              {'value': '孝感市'},
              {'value': '荆州市'},
              {'value': '黄冈市'},
              {'value': '咸宁市'},
              {'value': '随州市'},
              {'value': '恩施土家族苗族自治州'},
              {'value': '仙桃市'},
              {'value': '潜江市'},
              {'value': '天门市'},
              {'value': '神农架林区'}
            ]
            break
          case '甘肃省':
            vm.cityOptions = [
              {'value': '全部'},
              {'value': '兰州市'},
              {'value': '嘉峪关市'},
              {'value': '金昌市'},
              {'value': '白银市'},
              {'value': '天水市'},
              {'value': '武威市'},
              {'value': '张掖市'},
              {'value': '平凉市'},
              {'value': '酒泉市'},
              {'value': '庆阳市'},
              {'value': '定西市'},
              {'value': '陇南市'},
              {'value': '临夏回族自治州'},
              {'value': '甘南藏族自治州'}
            ]
            break
          case '山西省':
            vm.cityOptions = [
              {'value': '全部'},
              {'value': '太原市'},
              {'value': '大同市'},
              {'value': '阳泉市'},
              {'value': '长治市'},
              {'value': '晋城市'},
              {'value': '晋中市'},
              {'value': '朔州市'},
              {'value': '运城市'},
              {'value': '忻州市'},
              {'value': '临汾市'},
              {'value': '吕梁市'}
            ]
            break
          case '陕西省':
            vm.cityOptions = [
              {'value': '全部'},
              {'value': '西安市'},
              {'value': '铜川市'},
              {'value': '咸阳市'},
              {'value': '渭南市'},
              {'value': '汉中市'},
              {'value': '安康市'},
              {'value': '商洛市'},
              {'value': '延安市'},
              {'value': '榆林市'},
              {'value': '宝鸡市'}
            ]
            break
          case '吉林省':
            vm.cityOptions = [
              {'value': '全部'},
              {'value': '长春市'},
              {'value': '吉林市'},
              {'value': '四平市'},
              {'value': '辽源市'},
              {'value': '通化市'},
              {'value': '白山市'},
              {'value': '松原市'},
              {'value': '白城市'},
              {'value': '延边朝鲜族自治州'}
            ]
            break
          case '福建省':
            vm.cityOptions = [
              {'value': '全部'},
              {'value': '福州市'},
              {'value': '厦门市'},
              {'value': '泉州市'},
              {'value': '莆田市'},
              {'value': '漳州市'},
              {'value': '三明市'},
              {'value': '南平市'},
              {'value': '龙岩市'},
              {'value': '宁德市'}
            ]
            break
          case '贵州省':
            vm.cityOptions = [
              {'value': '全部'},
              {'value': '贵阳市'},
              {'value': '六盘水市'},
              {'value': '遵义市'},
              {'value': '铜仁市'},
              {'value': '安顺市'},
              {'value': '毕节市'},
              {'value': '黔西南布依族苗族自治州'},
              {'value': '黔东南苗族侗族自治州'},
              {'value': '黔南布依族苗族自治州'}
            ]
            break
          case '广东省':
            vm.cityOptions = [
              {'value': '全部'},
              {'value': '广州市'},
              {'value': '深圳市'},
              {'value': '珠海市'},
              {'value': '汕头市'},
              {'value': '佛山市'},
              {'value': '韶关市'},
              {'value': '湛江市'},
              {'value': '肇庆市'},
              {'value': '江门市'},
              {'value': '茂名市'},
              {'value': '惠州市'},
              {'value': '梅州市'},
              {'value': '汕尾市'},
              {'value': '河源市'},
              {'value': '阳江市'},
              {'value': '清远市'},
              {'value': '东莞市'},
              {'value': '中山市'},
              {'value': '潮州市'},
              {'value': '揭阳市'},
              {'value': '云浮市'}
            ]
            break
          case '青海省':
            vm.cityOptions = [
              {'value': '全部'},
              {'value': '西宁市'},
              {'value': '海东市'},
              {'value': '海北藏族自治州'},
              {'value': '黄南藏族自治州'},
              {'value': '海南藏族自治州'},
              {'value': '果洛藏族自治州'},
              {'value': '玉树藏族自治州'},
              {'value': '海西蒙古族藏族自治州'}
            ]
            break
          case '四川省':
            vm.cityOptions = [
              {'value': '全部'},
              {'value': '成都市'},
              {'value': '自贡市'},
              {'value': '攀枝花市'},
              {'value': '泸州市'},
              {'value': '德阳市'},
              {'value': '绵阳市'},
              {'value': '广元市'},
              {'value': '遂宁市'},
              {'value': '内江市'},
              {'value': '乐山市'},
              {'value': '南充市'},
              {'value': '眉山市'},
              {'value': '广安市'},
              {'value': '宜宾市'},
              {'value': '达州市'},
              {'value': '雅安市'},
              {'value': '巴中市'},
              {'value': '资阳市'},
              {'value': '阿坝藏族羌族自治州'},
              {'value': '甘孜藏族自治州'},
              {'value': '凉山彝族自治州'}
            ]
            break
          case '海南省':
            vm.cityOptions = [
              {'value': '全部'},
              {'value': '海口市'},
              {'value': '三亚市'},
              {'value': '三沙市'},
              {'value': '儋州市'},
              {'value': '五指山市'},
              {'value': '琼海市'},
              {'value': '文昌市'},
              {'value': '万宁市'},
              {'value': '东方市'},
              {'value': '定安县'},
              {'value': '屯昌县'},
              {'value': '澄迈县'},
              {'value': '临高县'},
              {'value': '白沙黎族自治县'},
              {'value': '昌江黎族自治县'},
              {'value': '乐东黎族自治县'},
              {'value': '陵水黎族自治县'},
              {'value': '保亭黎族苗族自治县'},
              {'value': '琼中黎族苗族自治县'}
            ]
            break
          case '台湾省':
            vm.cityOptions = [
              {'value': '全部'},
              {'value': '台北市'},
              {'value': '新北市'},
              {'value': '桃园市'},
              {'value': '台中市'},
              {'value': '台南市'},
              {'value': '高雄市'}
            ]
            break
          case '香港特别行政区':
            vm.cityOptions = [
              {'value': '香港'}
            ]
            break
          case '澳门特别行政区':
            vm.cityOptions = [
              {'value': '澳门'}
            ]
            break
        }
        this.city = this.cityOptions[0].value
        this.$emit('selectProvince', this.province)
      },
      cityChange () {
        this.$emit('selectCity', this.city)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
