<template>
  <div class="employeeList" v-loading.body="loading" element-loading-text="拼命加载中">
    <banner></banner>
    <div class="date-filter">
      <li>
        <span class="managerFront">姓名：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText" v-model.trim="user_name"
                  @keyup.enter.native="search"></el-input>
      </li>
      <li>
        <span class="managerFront">手机号：</span>
        <el-input size="mini" type="text" placeholder="请输入内容" class="managerText" v-model.trim="user_mobile"
                  @keyup.enter.native="search"></el-input>
      </li>
      <!--<li>-->
      <!--<span class="managerFront">邮箱：</span>-->
      <!--<el-input size="mini" type="text" placeholder="请输入内容" class="managerText" v-model.trim="user_email"-->
      <!--@keyup.enter.native="search"></el-input>-->
      <!--</li>-->
      <li>
        <span class="managerFront">部门：</span>
        <el-select v-model.trim="department" size="mini" placeholder="不限" class="employeeListSelectL">
          <el-option
            v-for="item in departments"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
      <li>
        <el-button type="primary" size="mini" class="searchButton" @click.prevent.stop="search">搜索</el-button>
        <el-button type="primary" size="mini" class="searchButton" @click="handleAdd">新增用户</el-button>
        <el-button type="primary" size="mini" class="searchButton" @click="addMultiple">批量修改</el-button>
      </li>
    </div>
    <el-table :data="fundData" highlight-current-row border stripe style="width: 100%;overflow: auto" :height="height"
              class="employeeList-table" @selection-change="handleSelectionChange">
      <el-table-column type="selection" show-overflow-tooltip></el-table-column>
      <el-table-column property="user_name" min-width="80" label="姓名"></el-table-column>
      <el-table-column property="user_sex" min-width="80" label="性别"></el-table-column>
      <el-table-column property="department" min-width="110" label="部门"></el-table-column>
      <el-table-column property="user_mobile" min-width="110" label="手机号"></el-table-column>
      <el-table-column property="user_email" min-width="150" label="邮箱"></el-table-column>
      <el-table-column min-width="150" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="showDialog(scope.row)">删除
          </el-button>
          <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            :modal-append-to-body="false">
            <span>执行删除用户[ <a class="userNameDel">{{ userNameDel }}</a> ]操作后无法恢复，确定继续吗？</span>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="isDialog">确 定</el-button>
              <el-button @click="isDialogVisible">取 消</el-button>
            </span>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: center;margin-top: 10px;" v-show="fundData.length!=0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="20"
        :layout="pageContent"
        :total="count">
      </el-pagination>
    </div>
    <transition name="fade">
      <div class="multiple" v-show="isShowMultiple">
        <div class="multiple-wrapper">
          <div class="multiple-header">批量修改</div>
          <div class="multiple-name">
            <el-tag v-for="tag in names" hit :key="tag">{{tag}}</el-tag>
          </div>
          <div class="multiple-tree">
            <el-carousel trigger="click" height="408px" :autoplay="false">
              <el-carousel-item class="multiple-carousel-item">
                <div class="multiple-carousel-item-title">开心钱包</div>
                <el-tree
                  :data="xjkdTable"
                  show-checkbox
                  node-key="label"
                  ref="multiple"
                  highlight-current
                  :props="defaultProps">
                </el-tree>
              </el-carousel-item>
              <el-carousel-item class="multiple-carousel-item">
                <div class="multiple-carousel-item-title">企鹅抓娃娃</div>
                <el-tree
                  :data="zwwTable"
                  show-checkbox
                  node-key="label"
                  ref="multiple1"
                  highlight-current
                  :props="defaultProps">
                </el-tree>
              </el-carousel-item>
              <el-carousel-item class="multiple-carousel-item">
                <div class="multiple-carousel-item-title">开心拍卖</div>
                <el-tree
                  :data="jpTable"
                  show-checkbox
                  node-key="label"
                  ref="multiple2"
                  highlight-current
                  :props="defaultProps">
                </el-tree>
              </el-carousel-item>
              <el-carousel-item class="multiple-carousel-item">
                <div class="multiple-carousel-item-title">开心分期</div>
                <el-tree
                  :data="fqTable"
                  show-checkbox
                  node-key="label"
                  ref="multiple3"
                  highlight-current
                  :props="defaultProps">
                </el-tree>
              </el-carousel-item>
            </el-carousel>
          </div>
          <el-button type="primary" size="mini" class="multiple-button" @click="submitMultiple()">
            立即修改
          </el-button>
        </div>
        <div class="multiple-close">
          <i class="el-icon-close" @click.stop.prevent="closeMulti"></i>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="detail" v-show="isShowDetail">
        <div class="detail-wrapper">
          <div class="detial-main">
            <div class="main-header clearfix">
              <span class="avatar">
                <i class="elextra-icon-avatar"></i>
              </span>
              <span class="company-name">上海灿福信息科技发展有限公司</span>
            </div>
            <div class="main-content">
              <el-form :model="ruleForm" :rules="rules" :label-position="labelPosition" ref="ruleForm"
                       label-width="50px" class="ruleForm">
                <el-form-item label="姓名:">
                  <el-input size="mini" class="form-input" v-model="ruleForm.user_name"></el-input>
                </el-form-item>
                <el-form-item label="性别:">
                  <el-radio-group v-model="ruleForm.user_sex">
                    <el-radio label="男"></el-radio>
                    <el-radio label="女"></el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="部门:">
                  <el-select class="form-input" v-model="ruleForm.department" placeholder="请选择所属部门" popper-class="ZIndex99">
                    <el-option label="外部" value="外部"></el-option>
                    <el-option label="总经办" value="总经办"></el-option>
                    <el-option label="财务部" value="财务部"></el-option>
                    <el-option label="商务部" value="商务部"></el-option>
                    <el-option label="招财猫" value="招财猫"></el-option>
                    <el-option label="数据中心" value="数据中心"></el-option>
                    <el-option label="技术中心" value="技术中心"></el-option>
                    <el-option label="电催中心" value="电催中心"></el-option>
                    <el-option label="运营中心(运营)" value="运营中心(运营)"></el-option>
                    <el-option label="运营中心(市场)" value="运营中心(市场)"></el-option>
                    <el-option label="产品中心" value="产品中心"></el-option>
                    <el-option label="机构商务部" value="机构商务部"></el-option>
                    <el-option label="人力行政中心" value="人力行政中心"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="邮箱:">
                  <el-input :disabled="true" size="mini" class="form-input" v-model="ruleForm.user_email"></el-input>
                </el-form-item>
                <el-form-item label="电话:" prop="user_mobile">
                  <el-input size="mini" class="form-input" v-model="ruleForm.user_mobile"></el-input>
                </el-form-item>
                <el-form-item label="功能:" ref="permission">
                  <el-select v-model="ruleForm.user_permission" multiple size="mini" placeholder="请选择"
                             class="permisssionSelect" popper-class="ZIndex99">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="mini" class="employeeList-button" @click="submitForm('ruleForm')">
                    立即修改
                  </el-button>
                </el-form-item>
              </el-form>
              <div class="employeeList-tree">
                <el-carousel trigger="click" height="308px" :autoplay="false">
                  <el-carousel-item class="employeeList-carousel-item">
                    <div class="employeeList-carousel-item-title">开心钱包</div>
                    <el-tree
                      :data="xjkdTable"
                      show-checkbox
                      node-key="label"
                      ref="tree"
                      highlight-current
                      :props="defaultProps">
                    </el-tree>
                  </el-carousel-item>
                  <el-carousel-item class="employeeList-carousel-item">
                    <div class="employeeList-carousel-item-title">企鹅抓娃娃</div>
                    <el-tree
                      :data="zwwTable"
                      show-checkbox
                      node-key="label"
                      ref="tree1"
                      highlight-current
                      :props="defaultProps">
                    </el-tree>
                  </el-carousel-item>
                  <el-carousel-item class="employeeList-carousel-item">
                    <div class="employeeList-carousel-item-title">开心拍卖</div>
                    <el-tree
                      :data="jpTable"
                      show-checkbox
                      node-key="label"
                      ref="tree2"
                      highlight-current
                      :props="defaultProps">
                    </el-tree>
                  </el-carousel-item>
                  <el-carousel-item class="employeeList-carousel-item">
                    <div class="employeeList-carousel-item-title">开心分期</div>
                    <el-tree
                      :data="fqTable"
                      show-checkbox
                      node-key="label"
                      ref="tree3"
                      highlight-current
                      :props="defaultProps">
                    </el-tree>
                  </el-carousel-item>
                </el-carousel>
              </div>
            </div>
          </div>
        </div>
        <div class="detail-close">
          <i class="el-icon-close" @click.stop.prevent="closeDetail"></i>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="detail newDetail" v-show="isShowAdd">
        <div class="detail-wrapper">
          <div class="detial-main">
            <div class="main-header clearfix">
              <span class="avatar">
                <i class="elextra-icon-avatar"></i>
              </span>
              <span class="company-name">上海灿福信息科技发展有限公司</span>
            </div>
            <div class="main-content">
              <el-form :model="newRuleForm" :rules="rules" ref="newRuleForm" :label-position="labelPosition"
                       label-width="54px" class="ruleForm">
                <el-form-item label="姓名:" prop="user_name">
                  <el-input size="mini" class="form-input" v-model="newRuleForm.user_name"></el-input>
                </el-form-item>
                <el-form-item label="性别:">
                  <el-radio-group v-model="newRuleForm.user_sex">
                    <el-radio label="男"></el-radio>
                    <el-radio label="女"></el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="部门:">
                  <el-select class="form-input" v-model="newRuleForm.department" placeholder="请选择所属部门" popper-class="ZIndex99">
                    <el-option label="外部" value="外部"></el-option>
                    <el-option label="总经办" value="总经办"></el-option>
                    <el-option label="财务部" value="财务部"></el-option>
                    <el-option label="商务部" value="商务部"></el-option>
                    <el-option label="招财猫" value="招财猫"></el-option>
                    <el-option label="数据中心" value="数据中心"></el-option>
                    <el-option label="技术中心" value="技术中心"></el-option>
                    <el-option label="电催中心" value="电催中心"></el-option>
                    <el-option label="运营中心(运营)" value="运营中心(运营)"></el-option>
                    <el-option label="运营中心(市场)" value="运营中心(市场)"></el-option>
                    <el-option label="产品中心" value="产品中心"></el-option>
                    <el-option label="机构商务部" value="机构商务部"></el-option>
                    <el-option label="人力行政中心" value="人力行政中心"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="邮箱:" prop="user_email">
                  <el-input size="mini" class="form-input input_email" v-model="newRuleForm.user_email"
                            prop="user_email"></el-input>
                  <span class="email_suffix">@xianjinkd.com</span>
                </el-form-item>
                <el-form-item label="电话:" prop="user_mobile">
                  <el-input size="mini" class="form-input" v-model="newRuleForm.user_mobile"></el-input>
                </el-form-item>
                <el-form-item label="功能:">
                  <el-select v-model="newRuleForm.user_permission" multiple size="mini" placeholder="请选择"
                             class="permisssionSelect" popper-class="ZIndex99">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="mini" class="employeeList-button" @click="insertForm('newRuleForm')">
                    提交
                  </el-button>
                  <!--<el-button type="primary" size="mini" class="employeeList-button2" @click="resetForm('newRuleForm')">
                    重置
                  </el-button>-->
                </el-form-item>
              </el-form>
              <div class="employeeList-tree">
                <el-carousel trigger="click" height="308px" :autoplay="false">
                  <el-carousel-item class="employeeList-carousel-item">
                    <div class="employeeList-carousel-item-title">开心钱包</div>
                    <el-tree
                      :data="xjkdTable"
                      show-checkbox
                      node-key="label"
                      ref="treeAdd"
                      highlight-current
                      :props="defaultProps">
                    </el-tree>
                  </el-carousel-item>
                  <el-carousel-item class="employeeList-carousel-item">
                    <div class="employeeList-carousel-item-title">企鹅抓娃娃</div>
                    <el-tree
                      :data="zwwTable"
                      show-checkbox
                      node-key="label"
                      ref="treeAdd1"
                      highlight-current
                      :props="defaultProps">
                    </el-tree>
                  </el-carousel-item>
                  <el-carousel-item class="employeeList-carousel-item">
                    <div class="employeeList-carousel-item-title">开心拍卖</div>
                    <el-tree
                      :data="jpTable"
                      show-checkbox
                      node-key="label"
                      ref="treeAdd2"
                      highlight-current
                      :props="defaultProps">
                    </el-tree>
                  </el-carousel-item>
                  <el-carousel-item class="employeeList-carousel-item">
                    <div class="employeeList-carousel-item-title">开心分期</div>
                    <el-tree
                      :data="fqTable"
                      show-checkbox
                      node-key="label"
                      ref="treeAdd3"
                      highlight-current
                      :props="defaultProps">
                    </el-tree>
                  </el-carousel-item>
                </el-carousel>
              </div>
            </div>
          </div>
        </div>
        <div class="detail-close">
          <i class="el-icon-close" @click.stop.prevent="handleAdd"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import banner from '../../../common/banner/banner'
  import {getNowFormatDate, formatDate} from '../../../../common/js/utils'
  import {isCfEmail} from '../../../../common/js/validate'
  import {parentTable} from '../../../../common/js/config'
  import {
    getEmployeeList,
    getEmployeeListCount,
    getEmployeeListModify,
    getEmployeeListAdd,
    getEmployeeListDelete,
    modifyMultiple
  } from '../../../../common/js/api'

  let temp

  export default {
    data() {
      const validatePhone = (rule, value, callback) => {
        if (!value) {
          callback(new Error('手机不能为空'))
        } else {
          if (!(/^1[34578]\d{9}$/).test(value.split('-').join(''))) {
            callback(new Error('手机格式有误'))
          } else {
            callback()
          }
        }
      }
      const validateEmail = (rule, value, callback) => {
        if (!isCfEmail(value + '@xianjinkd.com')) {
          callback(new Error('请输入正确的邮箱'))
        } else {
          callback()
        }
      }
      return {
        department: '',
        departments: [{
          value: '',
          label: '不限'
        }, {
          value: '外部',
          label: '外部'
        }, {
          value: '总经办',
          label: '总经办'
        }, {
          value: '财务部',
          label: '财务部'
        }, {
          value: '商务部',
          label: '商务部'
        }, {
          value: '招财猫',
          label: '招财猫'
        }, {
          value: '数据中心',
          label: '数据中心'
        }, {
          value: '技术中心',
          label: '技术中心'
        }, {
          value: '电催中心',
          label: '电催中心'
        }, {
          value: '运营中心(运营)',
          label: '运营中心(运营)'
        }, {
          value: '运营中心(市场)',
          label: '运营中心(市场)'
        }, {
          value: '产品中心',
          label: '产品中心'
        }, {
          value: '机构商务部',
          label: '机构商务部'
        }, {
          value: '人力行政中心',
          label: '人力行政中心'
        }],
        names: [],
        phones: [],
        isShowMultiple: false,
        multipleSelection: [],
        xjkdTable: [{label: '首页', mark: ['首页']}, {
          id: 1,
          label: 'RMAB',
          children: [{
            id: 9,
            label: '市场',
            mark: ['市场', 'RMAB'],
            children: [{
              id: 39,
              label: '新用户借款通过率',
              mark: ['新用户借款通过率', '市场', 'RMAB']
            }]
          }, {
            id: 10,
            label: '运营',
            children: [{
              id: 40,
              label: '邀请活动',
              mark: ['邀请活动', '运营', 'RMAB']
            }]
          }, {
            label: '风控',
            children: [{
              label: '风控因素分析',
              mark: ['风控因素分析', '风控', 'RMAB']
            }]
          }, {
            id: 11,
            label: '催收',
            children: [{
              id: 41,
              label: '借款逾期催回率',
              mark: ['借款逾期催回率', '催收', 'RMAB']
            }]
          }, {
            id: 12,
            label: '用户画像',
            children: [{
              id: 42,
              label: '基础用户画像',
              mark: ['基础用户画像', '用户画像', 'RMAB']
            }, {
              label: '运营用户画像',
              mark: ['运营用户画像', '用户画像', 'RMAB']
            }]
          }]
        }, {
          id: 2,
          label: '用户信息管理',
          children: [{
            id: 13,
            label: '用户列表',
            mark: ['用户列表', '用户信息管理']
          }, {
            id: 14,
            label: '用户通讯录',
            mark: ['用户通讯录', '用户信息管理']
          }, {
            id: 15,
            label: '银行卡列表',
            mark: ['银行卡列表', '用户信息管理']
          }, {
            id: 16,
            label: '用户实名认证列表',
            mark: ['用户实名认证列表', '用户信息管理']
          }, {
            id: 17,
            label: '用户认证列表',
            mark: ['用户认证列表', '用户信息管理']
          }, {
            label: '优惠券信息列表',
            mark: ['优惠券信息列表', '用户信息管理']
          }, {
            label: '新用户用户标签列表',
            mark: ['新用户用户标签列表', '用户信息管理']
          }, {
            label: '老用户用户标签列表',
            mark: ['老用户用户标签列表', '用户信息管理']
          }]
        }, {
          id: 3,
          label: '借款管理',
          children: [{
            id: 18,
            label: '借款申请列表',
            mark: ['借款申请列表', '借款管理']
          }, {
            id: 19,
            label: '放款审核列表',
            mark: ['放款审核列表', '借款管理']
          }, {
            id: 20,
            label: '提额记录表',
            mark: ['提额记录表', '借款管理']
          }, {
            id: 21,
            label: '对账功能',
            mark: ['对账功能', '借款管理']
          }, {
            id: 22,
            label: '资产信息-招财猫',
            mark: ['资产信息-招财猫', '借款管理']
          }]
        }, {
          id: 4,
          label: '还款管理',
          children: [{
            id: 23,
            label: '还款列表',
            mark: ['还款列表', '还款管理'],
            children: [{
              id: 43,
              label: '待还列表',
              mark: ['待还列表', '还款列表', '还款管理']
            }, {
              id: 44,
              label: '已还列表',
              mark: ['已还列表', '还款列表', '还款管理']
            }]
          }, {
            id: 24,
            label: '对账列表',
            mark: ['对账列表', '还款管理'],
            children: [{
              id: 45,
              label: '还款对账',
              mark: ['还款对账', '对账列表', '还款管理']
            }, {
              id: 46,
              label: '续期对账',
              mark: ['续期对账', '对账列表', '还款管理']
            }]
          }, {
            id: 25,
            label: '退款列表',
            mark: ['退款列表', '还款管理'],
            children: [{
              id: 47,
              label: '还款详情',
              mark: ['还款详情', '退款列表', '还款管理']
            }, {
              id: 48,
              label: '续期详情',
              mark: ['续期详情', '退款列表', '还款管理']
            }, {
              id: 49,
              label: '已退列表',
              mark: ['已退列表', '退款列表', '还款管理']
            }]
          }, {
            id: 26,
            label: '续期管理',
            mark: ['续期管理', '还款管理'],
            children: [{
              id: 50,
              label: '续期列表',
              mark: ['续期列表', '续期管理', '还款管理']
            }]
          }]
        }, {
          id: 5,
          label: '数据分析',
          children: [{
            id: 27,
            label: '财务数据',
            mark: ['财务数据', '数据分析'],
            children: [{
              id: 51,
              label: '每日放款数据',
              mark: ['每日放款数据', '财务数据', '数据分析']
            }, {
              id: 52,
              label: '21天分期统计',
              mark: ['21天分期统计', '财务数据', '数据分析']
            }, {
              id: 53,
              label: '21天分期提额统计',
              mark: ['21天分期提额统计', '财务数据', '数据分析']
            }, {
              id: 54,
              label: '90天分期统计',
              mark: ['90天分期统计', '财务数据', '数据分析']
            }, {
              id: 61,
              label: '每日还款单位数据',
              mark: ['每日还款单位数据', '财务数据', '数据分析']
            }, {
              id: 55,
              label: '每日还款金额(非分期)',
              mark: ['每日还款金额(非分期)', '财务数据', '数据分析']
            }, {
              id: 56,
              label: '还款逾期统计',
              mark: ['还款逾期统计', '财务数据', '数据分析']
            }, {
              id: 57,
              label: '资金分析',
              mark: ['资金分析', '财务数据', '数据分析']
            }, {
              id: 58,
              label: '资金分析(分产品)',
              mark: ['资金分析(分产品)', '财务数据', '数据分析']
            }, {
              id: 59,
              label: '催收管理',
              mark: ['催收管理', '财务数据', '数据分析']
            }, {
              id: 60,
              label: '在催金额',
              mark: ['在催金额', '财务数据', '数据分析']
            }, {
              label: '提前还款统计',
              mark: ['提前还款统计', '财务数据', '数据分析']
            }, {
              label: '自然渠道统计',
              mark: ['自然渠道统计', '财务数据', '数据分析']
            }, {
              label: '必过券统计',
              mark: ['必过券统计', '财务数据', '数据分析']
            }, {
              label: '还款抵扣券分析',
              mark: ['还款抵扣券分析', '财务数据', '数据分析']
            }, {
              label: '分时段还款率',
              mark: ['分时段还款率', '财务数据', '数据分析']
            }, {
              label: '关键数据',
              mark: ['关键数据', '财务数据', '数据分析']
            }]
          }, {
            id: 28,
            label: '数据报表',
            mark: ['数据报表', '数据分析'],
            children: [{
              id: 62,
              label: '平台数据',
              mark: ['平台数据', '数据报表', '数据分析']
            }]
          }, {
            label: '开心商城',
            mark: ['开心商城', '数据分析'],
            children: [{
              label: '每日支出数据',
              mark: ['每日支出数据', '开心商城', '数据分析']
            }]
          }, {
            label: '现金借呗',
            mark: ['现金借呗', '数据分析'],
            children: [{
              label: '每日放款数据-借呗',
              mark: ['每日放款数据-借呗', '现金借呗', '数据分析']
            }, {
              label: '每日还款数据-借呗',
              mark: ['每日还款数据-借呗', '现金借呗', '数据分析']
            }]
          }]
        }, {
          id: 6,
          label: '财务分析',
          children: [{
            id: 29,
            label: '还款明细',
            mark: ['还款明细', '财务分析']
          }, {
            id: 30,
            label: '对账分析',
            mark: ['对账分析', '财务分析']
          }, {
            id: 31,
            label: '还款日报',
            mark: ['还款日报', '财务分析']
          }, {
            label: '放款日报',
            mark: ['放款日报', '财务分析']
          }]
        }, {
          id: 7,
          label: '推广管理',
          children: [{
            id: 32,
            label: '推广渠道',
            mark: ['推广渠道', '推广管理']
          }, {
            id: 33,
            label: '推广员管理',
            mark: ['推广员管理', '推广管理']
          }, {
            id: 34,
            label: '推广统计(渠道)',
            mark: ['推广统计(渠道)', '推广管理']
          }, {
            label: '七日推广统计(渠道)',
            mark: ['七日推广统计(渠道)', '推广管理']
          }, {
            id: 35,
            label: '推广统计(地区)',
            mark: ['推广统计(地区)', '推广管理']
          }, {
            id: 36,
            label: '渠道统计汇总',
            mark: ['渠道统计汇总', '推广管理']
          }, {
            id: 37,
            label: '注册量统计报表',
            mark: ['注册量统计报表', '推广管理']
          }, {
            id: 63,
            label: '贷款超市-PVUV',
            mark: ['贷款超市-PVUV', '推广管理']
          }]
        }, {
          label: '绩效考评',
          children: [{
            label: '部门绩效考评',
            mark: ['部门绩效考评', '绩效考评']
          }]
        }, {
          id: 8,
          label: '权限管理',
          children: [{
            id: 38,
            label: '员工信息',
            mark: ['员工信息', '权限管理']
          }]
        }, {
          label: '实验室',
          children: [{
            label: '任意门',
            mark: ['任意门', '实验室']
          }]
        }],
        zwwTable: [{
          label: '企鹅抓娃娃',
          children: [{
            label: '市场分析',
            mark: ['市场分析', '企鹅抓娃娃'],
            children: [{
              label: '数据概览',
              mark: ['数据概览', '市场分析', '企鹅抓娃娃']
            }, {
              label: '企鹅推广统计(渠道)',
              mark: ['企鹅推广统计(渠道)', '市场分析', '企鹅抓娃娃']
            }, {
              label: '企鹅推广统计(OPPO)',
              mark: ['企鹅推广统计(OPPO)', '市场分析', '企鹅抓娃娃']
            }, {
              label: '企鹅在线人数统计',
              mark: ['企鹅在线人数统计', '市场分析', '企鹅抓娃娃']
            }, {
              label: '用户充值间隔分析',
              mark: ['用户充值间隔分析', '市场分析', '企鹅抓娃娃']
            }, {
              label: '用户充值间隔分析(周)',
              mark: ['用户充值间隔分析(周)', '市场分析', '企鹅抓娃娃']
            }, {
              label: '用户充值时段分析',
              mark: ['用户充值时段分析', '市场分析', '企鹅抓娃娃']
            }]
          }, {
            label: '埋点分析',
            mark: ['埋点分析', '企鹅抓娃娃'],
            children: [{
              label: '充值按钮点击量',
              mark: ['充值按钮点击量', '埋点分析', '企鹅抓娃娃']
            }, {
              label: '各房间点击量',
              mark: ['各房间点击量', '埋点分析', '企鹅抓娃娃']
            }, {
              label: '任意门点击量',
              mark: ['任意门点击量', '埋点分析', '企鹅抓娃娃']
            }, {
              label: 'banner点击量',
              mark: ['banner点击量', '埋点分析', '企鹅抓娃娃']
            }, {
              label: '兑换点击量',
              mark: ['兑换点击量', '埋点分析', '企鹅抓娃娃']
            }, {
              label: '一级游戏房',
              mark: ['一级游戏房', '埋点分析', '企鹅抓娃娃']
            }, {
              label: '充值活动',
              mark: ['充值活动', '埋点分析', '企鹅抓娃娃']
            }, {
              label: '运营弹窗',
              mark: ['运营弹窗', '埋点分析', '企鹅抓娃娃']
            }, {
              label: '宝箱',
              mark: ['宝箱', '埋点分析', '企鹅抓娃娃']
            }]
          }, {
            label: '财务统计',
            mark: ['财务统计', '企鹅抓娃娃'],
            children: [{
              label: '企鹅对账明细',
              mark: ['企鹅对账明细', '财务统计', '企鹅抓娃娃']
            }, {
              label: '企鹅收入结算表',
              mark: ['企鹅收入结算表', '财务统计', '企鹅抓娃娃']
            }, {
              label: '企鹅汇总明细表',
              mark: ['企鹅汇总明细表', '财务统计', '企鹅抓娃娃']
            }, {
              label: '企鹅进销存明细表',
              mark: ['企鹅进销存明细表', '财务统计', '企鹅抓娃娃']
            }]
          }]
        }],
        jpTable: [{
          label: '开心拍卖',
          children: [{
            label: '拍卖首页',
            mark: ['拍卖首页', '开心拍卖']
          }, {
            label: '市场详情',
            mark: ['市场详情', '开心拍卖'],
            children: [{
              label: '市场看板',
              mark: ['市场看板', '市场详情', '开心拍卖']
            }, {
              label: '渠道信息表',
              mark: ['渠道信息表', '市场详情', '开心拍卖']
            }, {
              label: '渠道推广效果统计',
              mark: ['渠道推广效果统计', '市场详情', '开心拍卖']
            }, {
              label: '渠道每日统计',
              mark: ['渠道每日统计', '市场详情', '开心拍卖']
            }, {
              label: '渠道每周统计',
              mark: ['渠道每周统计', '市场详情', '开心拍卖']
            }, {
              label: '渠道日环比数据',
              mark: ['渠道日环比数据', '市场详情', '开心拍卖']
            }, {
              label: '渠道周环比数据',
              mark: ['渠道周环比数据', '市场详情', '开心拍卖']
            }, {
              label: '渠道月环比数据',
              mark: ['渠道月环比数据', '市场详情', '开心拍卖']
            }, {
              label: '渠道季环比数据',
              mark: ['渠道季环比数据', '市场详情', '开心拍卖']
            }, {
              label: '渠道年环比数据',
              mark: ['渠道年环比数据', '市场详情', '开心拍卖']
            }, {
              label: '渠道用户活跃情况',
              mark: ['渠道用户活跃情况', '市场详情', '开心拍卖']
            }]
          }, {
            label: '运营分析',
            mark: ['运营分析', '开心拍卖'],
            children: [{
              label: '运营看板',
              mark: ['运营看板', '运营分析', '开心拍卖']
            }, {
              label: '订单信息表',
              mark: ['订单信息表', '运营分析', '开心拍卖']
            }, {
              label: '用户信息表',
              mark: ['用户信息表', '运营分析', '开心拍卖']
            }, {
              label: '流量统计表',
              mark: ['流量统计表', '运营分析', '开心拍卖']
            }, {
              label: '竞拍记录表',
              mark: ['竞拍记录表', '运营分析', '开心拍卖']
            }, {
              label: '积分记录表',
              mark: ['积分记录表', '运营分析', '开心拍卖']
            }, {
              label: '充值记录表',
              mark: ['充值记录表', '运营分析', '开心拍卖']
            }, {
              label: '流量路径统计表',
              mark: ['流量路径统计表', '运营分析', '开心拍卖']
            }, {
              label: '元素点击表',
              mark: ['元素点击表', '运营分析', '开心拍卖']
            }, {
              label: '用户浏览行为表',
              mark: ['用户浏览行为表', '运营分析', '开心拍卖']
            }]
          }]
        }],
        fqTable: [{
          label: '开心分期',
          children: [{
            label: '黑卡',
            mark: ['黑卡', '开心分期'],
            children: [{
              label: '每日放款记录',
              mark: ['每日放款记录', '黑卡', '开心分期']
            }, {
              label: '每日还款金额记录',
              mark: ['每日还款金额记录', '黑卡', '开心分期']
            }, {
              label: '每日还款明细记录',
              mark: ['每日还款明细记录', '黑卡', '开心分期']
            }, {
                label: '每日结算报表',
                mark: ['每日结算报表', '黑卡', '开心分期']
            }, {
                label: '每日债权报表',
                mark: ['每日债权报表', '黑卡', '开心分期']
            }, {
                label: '还款逾期记录',
                mark: ['还款逾期记录', '黑卡', '开心分期']
            }, {
                label: '在催金额记录',
                mark: ['在催金额记录', '黑卡', '开心分期']
            }, {
                label: '每月结算表',
                mark: ['每月结算表', '黑卡', '开心分期']
            }, {
                label: '每月债权报表',
                mark: ['每月债权报表', '黑卡', '开心分期']
            }, {
                label: 'ZCM还款数据核对',
                mark: ['ZCM还款数据核对', '黑卡', '开心分期']
            }, {
                label: 'ZB还款数据核对',
                mark: ['ZB还款数据核对', '黑卡', '开心分期']
            }, {
                label: 'XN还款数据核对',
                mark: ['XN还款数据核对', '黑卡', '开心分期']
            }, {
                label: '支付宝还款对账',
                mark: ['支付宝还款对账', '黑卡', '开心分期']
            }, {
                label: '三方对账分析',
                mark: ['三方对账分析', '黑卡', '开心分期']
            }]
          }, {
            label: '商城',
            mark: ['商城', '开心分期'],
            children: [{
              label: '财务对账',
              mark: ['财务对账', '商城', '开心分期'],
              children: [{
                label: '收入结算总表',
                mark: ['收入结算总表', '财务对账', '商城', '开心分期']
              }, {
                label: '收入结算明细表',
                mark: ['收入结算明细表', '财务对账', '商城', '开心分期']
              }, {
                label: '总销售额统计表',
                mark: ['总销售额统计表', '财务对账', '商城', '开心分期']
              }, {
                label: '商品销售记录',
                mark: ['商品销售记录', '财务对账', '商城', '开心分期']
              }, {
                label: '订单详情记录',
                mark: ['订单详情记录', '财务对账', '商城', '开心分期']
              }, {
                label: '每日零钱资金分析表',
                mark: ['每日零钱资金分析表', '财务对账', '商城', '开心分期']
              }, {
                label: '每日大礼包收入报表',
                mark: ['每日大礼包收入报表', '财务对账', '商城', '开心分期']
              }, {
                label: '每日商城订单报表',
                mark: ['每日商城订单报表', '财务对账', '商城', '开心分期']
              }, {
                label: '零钱充值对账分析',
                mark: ['零钱充值对账分析', '财务对账', '商城', '开心分期']
              }, {
                label: '商城月报表',
                mark: ['商城月报表', '财务对账', '商城', '开心分期']
              }, {
                label: '零钱资金账户明细表',
                mark: ['零钱资金账户明细表', '财务对账', '商城', '开心分期']
              }]
            }]
          }]
        }],
        availableTable: [{label: '首页', mark: ['首页']}, {
          id: 1,
          label: 'RMAB',
          children: [{
            id: 9,
            label: '市场',
            mark: ['市场', 'RMAB'],
            children: [{
              id: 39,
              label: '新用户借款通过率',
              mark: ['新用户借款通过率', '市场', 'RMAB']
            }]
          }, {
            id: 10,
            label: '运营',
            children: [{
              id: 40,
              label: '邀请活动',
              mark: ['邀请活动', '运营', 'RMAB']
            }]
          }, {
            label: '风控',
            children: [{
              label: '风控因素分析',
              mark: ['风控因素分析', '风控', 'RMAB']
            }]
          }, {
            id: 11,
            label: '催收',
            children: [{
              id: 41,
              label: '借款逾期催回率',
              mark: ['借款逾期催回率', '催收', 'RMAB']
            }]
          }, {
            id: 12,
            label: '用户画像',
            children: [{
              id: 42,
              label: '基础用户画像',
              mark: ['基础用户画像', '用户画像', 'RMAB']
            }, {
              label: '运营用户画像',
              mark: ['运营用户画像', '用户画像', 'RMAB']
            }]
          }]
        }, {
          id: 2,
          label: '用户信息管理',
          children: [{
            id: 13,
            label: '用户列表',
            mark: ['用户列表', '用户信息管理']
          }, {
            id: 14,
            label: '用户通讯录',
            mark: ['用户通讯录', '用户信息管理']
          }, {
            id: 15,
            label: '银行卡列表',
            mark: ['银行卡列表', '用户信息管理']
          }, {
            id: 16,
            label: '用户实名认证列表',
            mark: ['用户实名认证列表', '用户信息管理']
          }, {
            id: 17,
            label: '用户认证列表',
            mark: ['用户认证列表', '用户信息管理']
          }, {
            label: '优惠券信息列表',
            mark: ['优惠券信息列表', '用户信息管理']
          }, {
            label: '新用户用户标签列表',
            mark: ['新用户用户标签列表', '用户信息管理']
          }, {
            label: '老用户用户标签列表',
            mark: ['老用户用户标签列表', '用户信息管理']
          }]
        }, {
          id: 3,
          label: '借款管理',
          children: [{
            id: 18,
            label: '借款申请列表',
            mark: ['借款申请列表', '借款管理']
          }, {
            id: 19,
            label: '放款审核列表',
            mark: ['放款审核列表', '借款管理']
          }, {
            id: 20,
            label: '提额记录表',
            mark: ['提额记录表', '借款管理']
          }, {
            id: 21,
            label: '对账功能',
            mark: ['对账功能', '借款管理']
          }, {
            id: 22,
            label: '资产信息-招财猫',
            mark: ['资产信息-招财猫', '借款管理']
          }]
        }, {
          id: 4,
          label: '还款管理',
          children: [{
            id: 23,
            label: '还款列表',
            mark: ['还款列表', '还款管理'],
            children: [{
              id: 43,
              label: '待还列表',
              mark: ['待还列表', '还款列表', '还款管理']
            }, {
              id: 44,
              label: '已还列表',
              mark: ['已还列表', '还款列表', '还款管理']
            }]
          }, {
            id: 24,
            label: '对账列表',
            mark: ['对账列表', '还款管理'],
            children: [{
              id: 45,
              label: '还款对账',
              mark: ['还款对账', '对账列表', '还款管理']
            }, {
              id: 46,
              label: '续期对账',
              mark: ['续期对账', '对账列表', '还款管理']
            }]
          }, {
            id: 25,
            label: '退款列表',
            mark: ['退款列表', '还款管理'],
            children: [{
              id: 47,
              label: '还款详情',
              mark: ['还款详情', '退款列表', '还款管理']
            }, {
              id: 48,
              label: '续期详情',
              mark: ['续期详情', '退款列表', '还款管理']
            }, {
              id: 49,
              label: '已退列表',
              mark: ['已退列表', '退款列表', '还款管理']
            }]
          }, {
            id: 26,
            label: '续期管理',
            mark: ['续期管理', '还款管理'],
            children: [{
              id: 50,
              label: '续期列表',
              mark: ['续期列表', '续期管理', '还款管理']
            }]
          }]
        }, {
          id: 5,
          label: '数据分析',
          children: [{
            id: 27,
            label: '财务数据',
            mark: ['财务数据', '数据分析'],
            children: [{
              id: 51,
              label: '每日放款数据',
              mark: ['每日放款数据', '财务数据', '数据分析']
            }, {
              id: 52,
              label: '21天分期统计',
              mark: ['21天分期统计', '财务数据', '数据分析']
            }, {
              id: 53,
              label: '21天分期提额统计',
              mark: ['21天分期提额统计', '财务数据', '数据分析']
            }, {
              id: 54,
              label: '90天分期统计',
              mark: ['90天分期统计', '财务数据', '数据分析']
            }, {
              id: 61,
              label: '每日还款单位数据',
              mark: ['每日还款单位数据', '财务数据', '数据分析']
            }, {
              id: 55,
              label: '每日还款金额(非分期)',
              mark: ['每日还款金额(非分期)', '财务数据', '数据分析']
            }, {
              id: 56,
              label: '还款逾期统计',
              mark: ['还款逾期统计', '财务数据', '数据分析']
            }, {
              id: 57,
              label: '资金分析',
              mark: ['资金分析', '财务数据', '数据分析']
            }, {
              id: 58,
              label: '资金分析(分产品)',
              mark: ['资金分析(分产品)', '财务数据', '数据分析']
            }, {
              id: 59,
              label: '催收管理',
              mark: ['催收管理', '财务数据', '数据分析']
            }, {
              id: 60,
              label: '在催金额',
              mark: ['在催金额', '财务数据', '数据分析']
            }, {
              label: '提前还款统计',
              mark: ['提前还款统计', '财务数据', '数据分析']
            }, {
              label: '自然渠道统计',
              mark: ['自然渠道统计', '财务数据', '数据分析']
            }, {
              label: '必过券统计',
              mark: ['必过券统计', '财务数据', '数据分析']
            }, {
              label: '还款抵扣券分析',
              mark: ['还款抵扣券分析', '财务数据', '数据分析']
            }, {
              label: '分时段还款率',
              mark: ['分时段还款率', '财务数据', '数据分析']
            }, {
              label: '关键数据',
              mark: ['关键数据', '财务数据', '数据分析']
            }]
          }, {
            id: 28,
            label: '数据报表',
            mark: ['数据报表', '数据分析'],
            children: [{
              id: 62,
              label: '平台数据',
              mark: ['平台数据', '数据报表', '数据分析']
            }]
          }, {
            label: '开心商城',
            mark: ['开心商城', '数据分析'],
            children: [{
              label: '每日支出数据',
              mark: ['每日支出数据', '开心商城', '数据分析']
            }]
          }, {
            label: '现金借呗',
            mark: ['现金借呗', '数据分析'],
            children: [{
              label: '每日放款数据-借呗',
              mark: ['每日放款数据-借呗', '现金借呗', '数据分析']
            }, {
              label: '每日还款数据-借呗',
              mark: ['每日还款数据-借呗', '现金借呗', '数据分析']
            }]
          }]
        }, {
          id: 6,
          label: '财务分析',
          children: [{
            id: 29,
            label: '还款明细',
            mark: ['还款明细', '财务分析']
          }, {
            id: 30,
            label: '对账分析',
            mark: ['对账分析', '财务分析']
          }, {
            id: 31,
            label: '还款日报',
            mark: ['还款日报', '财务分析']
          }, {
            label: '放款日报',
            mark: ['放款日报', '财务分析']
          }, {
            label: '企鹅对账明细',
            mark: ['企鹅对账明细', '财务分析']
          }, {
            label: '企鹅收入结算表',
            mark: ['企鹅收入结算表', '财务分析']
          }, {
            label: '企鹅汇总明细表',
            mark: ['企鹅汇总明细表', '财务分析']
          }, {
            label: '企鹅进销存明细表',
            mark: ['企鹅进销存明细表', '财务分析']
          }]
        }, {
          id: 7,
          label: '推广管理',
          children: [{
            id: 32,
            label: '推广渠道',
            mark: ['推广渠道', '推广管理']
          }, {
            id: 33,
            label: '推广员管理',
            mark: ['推广员管理', '推广管理']
          }, {
            id: 34,
            label: '推广统计(渠道)',
            mark: ['推广统计(渠道)', '推广管理']
          }, {
            label: '七日推广统计(渠道)',
            mark: ['七日推广统计(渠道)', '推广管理']
          }, {
            id: 35,
            label: '推广统计(地区)',
            mark: ['推广统计(地区)', '推广管理']
          }, {
            id: 36,
            label: '渠道统计汇总',
            mark: ['渠道统计汇总', '推广管理']
          }, {
            id: 37,
            label: '注册量统计报表',
            mark: ['注册量统计报表', '推广管理']
          }, {
            id: 63,
            label: '贷款超市-PVUV',
            mark: ['贷款超市-PVUV', '推广管理']
          }]
        }, {
          label: '绩效考评',
          children: [{
            label: '部门绩效考评',
            mark: ['部门绩效考评', '绩效考评']
          }]
        }, {
          id: 8,
          label: '权限管理',
          children: [{
            id: 38,
            label: '员工信息',
            mark: ['员工信息', '权限管理']
          }]
        }, {
          label: '实验室',
          children: [{
            label: '任意门',
            mark: ['任意门', '实验室']
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        labelPosition: 'right',
        user_name: '',
        user_mobile: '',
        // user_email: '',
        fundData: [],
        loading: false,
        pageContent: 'sizes',
        currentRow: null,
        offset: 0,
        limit: 20,
        count: 0,
        currentPage: 1,
        height: 500,
        buttonLoading: false,
        ruleForm: {
          user_name: '',
          user_sex: '',
          department: '',
          user_email: '',
          user_mobile: '',
          user_permission: ''
        },
        isShowDetail: false,
        isShowAdd: false,
        newRuleForm: {
          user_name: '',
          user_sex: '',
          department: '',
          user_email: '',
          user_mobile: '',
          user_permission: ''
        },
        options: [{
          value: 'refreshed',
          label: '一键刷新'
        }, {
          value: 'excel',
          label: '导出Excel'
        }, {
          value: 'update',
          label: '修改数据'
        }],
        rules: {
          user_name: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          user_mobile: [
            {required: true, trigger: 'change', validator: validatePhone}
          ],
          user_email: [
            {required: true, trigger: 'change', validator: validateEmail}
          ]
        },
        dialogVisible: false,
        dRow: '',
        hUser_email: '',
        hUser_permission: [],
        xjkdTables: '',
        zwwTables: '',
        jpTables: '',
        fqTables: [],
        userNameDel: ''
      }
    },
    components: {
      banner
    },
    created() {
      this.loading = true
      this.getDataInit()
    },
    mounted() {
      this.resizeHeight()
    },
    methods: {
      addMultiple() {
        let phones = []
        let names = []
        for (let i of this.multipleSelection) {
          phones.push(i['user_mobile'])
          names.push(i['user_name'])
        }
        this.names = names
        this.phones = phones
        if (names.length === 0) {
          this.$message({
            message: '请先勾选用户',
            type: 'warning'
          })
        } else {
          this.isShowMultiple = true
        }
      },
      submitMultiple() {
        let selectInfo = this.$refs.multiple.getCheckedNodes()
        let selectInfo1 = this.$refs.multiple1.getCheckedNodes()
        let selectInfo2 = this.$refs.multiple2.getCheckedNodes()
        let selectInfo3 = this.$refs.multiple3.getCheckedNodes()
        if (selectInfo.length > 0 || selectInfo1.length > 0 || selectInfo2.length > 0 || selectInfo3.length > 0 && this.phones.length > 0) {
          let tables = this.filterArray(selectInfo, '|')
          let tables1 = this.filterArray(selectInfo1, '|')
          let tables2 = this.filterArray(selectInfo2, '|')
          let tables3 = this.filterArray(selectInfo3, '|')
          let phones = this.phones.join('|')
          return modifyMultiple({
            tables: tables,
            tables1: tables1,
            tables2: tables2,
            tables3: tables3,
            phones: phones
          }).then((response) => {
            if (response.data.code === '404') {
              this.$router.push('./404')
            } else if (response.data.code === '1024') {
              this.$message({
                message: '请求超时，请刷新页面重试',
                type: 'warning'
              })
            } else {
              if (response.data === 200) {
                this.$message({
                  message: '更新用户信息成功',
                  type: 'success'
                })
                this.isShowMultiple = false
                this.getDataInit()
              } else {
                this.$message({
                  message: '更新失败，请重试',
                  type: 'warning'
                })
              }
            }
          })
        } else {
          this.$message({
            message: '请至少授权一张表或选择一个用户',
            type: 'warning'
          })
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      //每页显示数据量变更
      handleSizeChange(val) {
        this.limit = val
        this.loading = true
        this.getDataInit()
      },
      //页码变更
      handleCurrentChange(val) {
        this.currentPage = val
        this.offset = (val - 1) * this.limit
        this.loading = true
        this.getDataInit()
      },
      getDataInit() {
        this.axios.all([this.getCount(), this.getData()])
          .then(this.axios.spread((acct, perms) => {
            if (perms.data.code === '404' || acct.data.code === '404') {
              this.$router.push('./404')
            } else if (perms.data.code === '1024' || acct.data.code === '1024') {
              this.fundData = []
              this.loading = false
              this.$message({
                message: '请求超时，请增加搜索条件以便搜索',
                type: 'warning'
              })
            } else {
              this.count = acct.data[0].count
              this.fundData = perms.data
              this.loading = false
              this.pageContent = 'total, sizes, prev, pager, next, jumper'
            }
          })).catch(() => {
          this.fundData = []
          this.loading = false
          this.$message({
            message: '数据正在更新，请稍候',
            type: 'warning'
          })
        })
      },
      getData() {
        return getEmployeeList({
          user_name: [this.user_name, 'INPUT'],
          user_mobile: [this.user_mobile, 'INPUT'],
          // user_email: [this.user_email, 'INPUT'],
          department: [this.department, 'SELECT'],
          limit: this.limit,
          offset: this.offset
        })
      },
      getCount() {
        return getEmployeeListCount({
          user_name: [this.user_name, 'INPUT'],
          user_mobile: [this.user_mobile, 'INPUT'],
          department: [this.department, 'SELECT']
          // user_email: [this.user_email, 'INPUT']
        })
      },
      search() {
        this.loading = true
        this.getDataInit()
      },
      //点击编辑按钮,给各个属性赋值
      handleEdit(index, row) {
        let xjkdTables = []
        let zwwTables = []
        let jpTables = []
        let fqTables = []
        if (row.available_table) {
          xjkdTables = this.selectBaseTable(row.available_table)
        }
        if (row.available_table_zww) {
          zwwTables = this.selectBaseTable(row.available_table_zww)
        }
        if (row.available_table_jp) {
          jpTables = this.selectBaseTable(row.available_table_jp)
        }
        if (row.available_table_fq) {
          fqTables = this.selectBaseTable(row.available_table_fq)
        }
        this.$refs.tree.setCheckedKeys(xjkdTables)
        this.$refs.tree1.setCheckedKeys(zwwTables)
        this.$refs.tree2.setCheckedKeys(jpTables)
        this.$refs.tree3.setCheckedKeys(fqTables)
        this.isShowDetail = !this.isShowDetail
        this.ruleForm = row
         if (typeof row.user_permission === 'object') {
           if (row.user_permission.length === 0) {
             row.user_permission = ''
             this.ruleForm.user_permission = []
           } else {
             this.ruleForm.user_permission = row.user_permission
           }
         } else if (row.user_permission.length === 0) {
           this.ruleForm.user_permission = []
         } else {
           let str = row.user_permission
           this.ruleForm.user_permission = str.split('|')
         }
        //hUser属性是打开面板的属性 row属性是数据库属性 ruleForm属性是提交后台属性
        if (!this.hUser_name || this.hUser_name !== row.user_name) {
          this.hUser_name = row.user_name
          this.hUser_sex = row.user_sex
          this.hUser_department = row.department
          this.hUser_phone = row.user_mobile
          this.hUser_permission = row.user_permission
          this.xjkdTables = row.available_table
          this.zwwTables = row.available_table_zww
          this.jpTables = row.available_table_jp
          this.fqTables = row.available_table_fq
        } else {
          this.ruleForm.user_name = this.hUser_name
          this.ruleForm.user_sex = this.hUser_sex
          this.ruleForm.department = this.hUser_department
          this.ruleForm.user_mobile = this.hUser_phone
          this.ruleForm.user_permission = this.hUser_permission
          row.available_table = this.xjkdTables
          row.available_table_zww = this.zwwTables
          row.available_table_jp = this.jpTables
          row.available_table_fq = this.fqTables
        }
      },
      handleDelete() {
        let row = this.dRow
        getEmployeeListDelete({
          email: row.user_email
        }).then((response) => {
          if (response.data.code === '404') {
            this.$router.push('./404')
          } else if (response.data.code === '1024') {
            this.$message({
              message: '删除用户请求超时，请刷新页面重试',
              type: 'warning'
            })
          } else {
            if (response.data === 200) {
              this.$message({
                message: '删除用户成功',
                type: 'success'
              })
              this.loading = true
              this.getDataInit()
            } else {
              this.$message({
                message: '删除用户失败，请重试',
                type: 'warning'
              })
            }
          }
        })
      },
      closeMulti() {
        this.isShowMultiple = false
      },
      closeDetail() {
        this.isShowDetail = !this.isShowDetail
        this.ruleForm.user_name = this.hUser_name
        this.ruleForm.user_sex = this.hUser_sex
        this.ruleForm.department = this.hUser_department
        this.ruleForm.user_mobile = this.hUser_phone
        this.ruleForm.user_permission = this.hUser_permission
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let selectInfo = this.$refs.tree.getCheckedNodes()
            let selectInfo1 = this.$refs.tree1.getCheckedNodes()
            let selectInfo2 = this.$refs.tree2.getCheckedNodes()
            let selectInfo3 = this.$refs.tree3.getCheckedNodes()
            let arrSet = this.filterArray(selectInfo)
            let arrSet1 = this.filterArray(selectInfo1)
            let arrSet2 = this.filterArray(selectInfo2)
            let arrSet3 = this.filterArray(selectInfo3)
            if (arrSet.length > -1 || arrSet1.length > -1 || arrSet2.length > -1 || arrSet3.length > -1) {
              let tableFlag = this.decideFlag(arrSet, this.xjkdTables)
              let tableFlag1 = this.decideFlag(arrSet1, this.zwwTables)
              let tableFlag2 = this.decideFlag(arrSet2, this.jpTables)
              let tableFlag3 = this.decideFlag(arrSet3, this.fqTables)
              let allFlag = false
              if (tableFlag & tableFlag1 & tableFlag2 & tableFlag3) {
                allFlag = true
              }
              if (this.hUser_name === this.ruleForm.user_name & this.hUser_sex === this.ruleForm.user_sex & this.hUser_department === this.ruleForm.department & this.hUser_phone === this.ruleForm.user_mobile & this.hUser_permission.toString() === this.ruleForm.user_permission.toString() & allFlag) {
                this.$message({
                  message: '请修改内容后再提交',
                  type: 'warning'
                })
              } else {
                getEmployeeListModify({
                  ruleForm: this.ruleForm,
                  tables: arrSet.join('|'),
                  tables1: arrSet1.join('|'),
                  tables2: arrSet2.join('|'),
                  tables3: arrSet3.join('|'),
                  permission: Array.from(this.ruleForm.user_permission).join('|')
                }).then((response) => {
                  if (response.data.code === '404') {
                    this.$router.push('./404')
                  } else if (response.data.code === '1024') {
                    this.$message({
                      message: '修改权限请求超时，请刷新页面重试',
                      type: 'warning'
                    })
                  } else {
                    if (response.data === 200) {
                      this.$message({
                        message: '权限修改成功',
                        type: 'success'
                      })
                      this.closeDetail()
                      this.loading = true
                      this.resetOld()
                      this.getDataInit()
                      this.resetChecked()
                    } else {
                      this.$message({
                        message: '修改权限失败，请重试',
                        type: 'warning'
                      })
                    }
                  }
                })
              }
            } else {
              this.$message({
                message: '请至少为该用户添加一张表',
                type: 'warning'
              })
            }
          } else {
            this.$message({
              message: '添加新用户失败，请重试',
              type: 'warning'
            })
          }
        })
      },
      resizeHeight() {
        this.setHeight()
        window.onresize = this.setHeight
      },
      setHeight() {
        let docH = document.documentElement.clientHeight
        let banner = document.getElementsByClassName('banner')[0]
        let bannerH = 0
        let filter = document.getElementsByClassName('date-filter')[0]
        let filterH = 0
        let page = document.getElementsByClassName('el-pagination')[0]
        let pageH = 0
        if (banner) {
          bannerH = banner.offsetHeight
        }
        if (filter) {
          filterH = filter.clientHeight
        }
        if (page) {
          if (page.offsetHeight !== 0) {
            pageH = page.offsetHeight
          } else {
            pageH = 32
          }
        } else {
          pageH = 60
        }
        this.height = docH - filterH - bannerH - pageH - 105
      },
      selectBaseTable(arrays) {
        let tables = arrays.split('|')
        temp = tables.filter(this.filterBaseTableleft)
        return tables.filter(this.filterBaseTableRight)
      },
      filterBaseTableleft(str) {
        return parentTable.indexOf(str) !== -1
      },
      filterBaseTableRight(str) {
        return temp.indexOf(str) === -1
      },
      handleAdd() {
        this.isShowAdd = !this.isShowAdd
        this.resetChecked()
      },
      insertForm(formName) {
        let selectInfo = this.$refs.treeAdd.getCheckedNodes()
        let selectInfo1 = this.$refs.treeAdd1.getCheckedNodes()
        let selectInfo2 = this.$refs.treeAdd2.getCheckedNodes()
        let selectInfo3 = this.$refs.treeAdd3.getCheckedNodes()
        let tables = this.filterArray(selectInfo, '|')
        let tables1 = this.filterArray(selectInfo1, '|')
        let tables2 = this.filterArray(selectInfo2, '|')
        let tables3 = this.filterArray(selectInfo3, '|')
        if (tables.length > 0 || tables1.length > 0 || tables2.length > 0 || tables3.length > 0) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              getEmployeeListAdd({
                tables: tables,
                tables1: tables1,
                tables2: tables2,
                tables3: tables3,
                department: this.newRuleForm.department,
                name: this.newRuleForm.user_name,
                sex: this.newRuleForm.user_sex,
                mobile: this.newRuleForm.user_mobile,
                email: this.newRuleForm.user_email + '@xianjinkd.com',
                permission: Array.from(this.newRuleForm.user_permission).join('|')
              }).then((response) => {
                if (response.data.code === '404') {
                  this.$router.push('./404')
                } else if (response.data.code === '1024') {
                  this.$message({
                    message: '添加新用户请求超时，请刷新页面重试',
                    type: 'warning'
                  })
                } else if (response.data.code === '120') {
                  this.$message({
                    message: '此号码已经注册，请更换手机号',
                    type: 'warning'
                  })
                } else {
                  if (response.data === 200) {
                    this.$message({
                      message: '添加新用户成功',
                      type: 'success'
                    })
                    this.handleAdd()
                    this.resetChecked()
                    this.loading = true
                    this.getDataInit()
                  } else {
                    this.$message({
                      message: '添加新用户失败，请重试',
                      type: 'warning'
                    })
                  }
                }
              })
            } else {
              this.$message({
                message: '添加新用户失败，请重试',
                type: 'warning'
              })
            }
          })
        } else {
          this.$message({
            message: '请至少为该用户添加一张表',
            type: 'warning'
          })
        }
      },
      resetChecked() {
        this.$refs.tree.setCheckedKeys([])
        this.$refs.tree1.setCheckedKeys([])
        this.$refs.tree2.setCheckedKeys([])
        this.$refs.tree3.setCheckedKeys([])
        this.newRuleForm.department = ''
        this.newRuleForm.user_name = ''
        this.newRuleForm.user_sex = ''
        this.newRuleForm.user_mobile = ''
        this.newRuleForm.user_email = ''
        this.newRuleForm.permission = ''
      },
      resetOld() {
        this.hUser_name = ''
        this.hUser_sex = ''
        this.hUser_department = ''
        this.hUser_phone = ''
        this.hUser_permission = ''
        this.xjkdTables = ''
        this.zwwTables = ''
        this.jpTables = ''
        this.fqTables = ''
      },
      isDialogVisible() {
        this.dialogVisible = !this.dialogVisible
      },
      showDialog(row) {
        this.isDialogVisible()
        this.dRow = row
        this.userNameDel = row.user_name
      },
      isDialog() {
        this.isDialogVisible()
        this.handleDelete(this.dRow)
      },
      filterArray(selectInfo, symbol) {
        let newArr = []
        if (selectInfo.length > 0) {
          let set = new Set()
          for (let i of selectInfo) {
            let array = i.mark
            if (array) {
              for (let j of array) {
                set.add(j)
              }
            }
          }
          newArr = Array.from(set)
        }
        if (symbol) {
          return newArr.join('|')
        } else {
          return newArr
        }
      },
      decideFlag (arrSet, xxTables) {
        let arrTables = []
        if (xxTables) {
          arrTables = xxTables.split('|')
        }
        if (arrTables.length === arrSet.length) {
          if (arrTables.length === 0) {
            return true
          }
          let sum = 0
          for (let item of arrSet) {
            if (xxTables.indexOf(item) === -1) {
              sum++
              break
            }
          }
          if (sum === 0) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .employeeList
    height: 100%
    .date-filter
      li
        .managerText
          width: 160px
        .employeeListSelectL
          width: 160px
    .multiple
      position: fixed
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: 99
      overflow: auto
      background: rgba(0, 0, 0, 0.5)
      backdrop-filter: blur(10px)
      &.fade-enter-active
        transition: all .4s linear
      &.fade-leave-active
        opacity: 0
        transition: all .4s linear
      &.fade-enter
        opacity: 0
      &.fade-leave
        opacity: 1
      .multiple-wrapper
        position: absolute
        top: 50%
        left: 50%
        transform: translate(-50%, -50%)
        width: 400px
        height: 630px
        border-radius: 5px
        text-align: center
        background-color: #fff
        .multiple-header
          magin-bottom: 10px
          padding-left: 20px
          line-height: 50px
          font-size: 14px
          text-align: left
          color: #666
        .multiple-name
          margin: 10px 5%
          height: 100px
          width: 90%
          border: 1px solid #ccc
          border-radius: 5px
        .multiple-tree
          display: inline-block
          padding-left: 6px
          height: 400px
          width: 90%
          /*overflow-y: scroll*/
          .multiple-carousel-item
            overflow: scroll
            .multiple-carousel-item-title
              display: inline-block
              font-size: 14px
              color: #999
              text-align: left
              margin: 10px 0 5px 0
              padding-bottom: 5px
              border-bottom: 2px solid #409eff
        .multiple-button
          margin-top: 10px
      .multiple-close
        position: absolute
        top: 50px
        right: 150px
        padding-top: 16px
        width: 32px
        height: 32px
        font-size: 32px
        color: rgba(255, 255, 255, 0.5)
    .detail
      position: fixed
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: 99
      overflow: auto
      background: rgba(0, 0, 0, 0.5)
      backdrop-filter: blur(10px)
      &.fade-enter-active
        transition: all .4s linear
      &.fade-leave-active
        opacity: 0
        transition: all .4s linear
      &.fade-enter
        opacity: 0
      &.fade-leave
        opacity: 1
      .detail-wrapper
        min-height: 100%
        width: 100%
        color: rgb(255, 255, 255)
        .detial-main
          position: absolute
          top: 50%
          left: 50%
          transform: translate(-50%, -50%)
          width: 500px
          height: 580px
          border-radius: 5px
          text-align: center
          background-color: #fff
          .main-header
            width: 100%
            height: 100px
            background-color: rgb(39, 124, 212)
            padding-top: 20px
            .avatar
              position: relative
              left: 20px
              display: inline-block
              float: left
              box-sizing: border-box
              width: 150px
              height: 100%
              .elextra-icon-avatar
                display: inline-block
                width: 70px
                height: 70px
                color: #1f2d3d
                font-size: 50px
                line-height: 70px
                border: 3px solid #bfcbd9
                border-radius: 50%
                background-color: #fff
            .company-name
              display: inline-block
              width: 300px
              height: 100%
              line-height: 70px
              margin-left: -70px
              font-size: 20px
              color: #ffffff
          .main-content
            padding: 35px 20px 0 20px
            .ruleForm
              display: inline-block
              margin-right: 60px
              width: 156px
              .form-input
                width: 150px
              .employeeList-button
                margin-left: -30px
              .input_email
                input
                  padding-left: 5px
            .employeeList-tree
              float: right
              width: 240px
              height: 308px
              border: 1px solid #ccc
              /*overflow: scroll*/
              .employeeList-carousel-item
                overflow: scroll
                .employeeList-carousel-item-title
                  display: inline-block
                  font-size: 14px
                  color: #999
                  text-align: left
                  margin: 10px 0 5px 0
                  padding-bottom: 5px
                  border-bottom: 2px solid #409eff
                .el-tree
                  width: 100%
                  border: none
                  text-align: left
                  color: #cccccc
      .detail-close
        position: absolute
        top: 50px
        right: 150px
        padding-top: 16px
        width: 32px
        height: 32px
        font-size: 32px
        color: rgba(255, 255, 255, 0.5)

    .el-form-item
      margin-bottom: 11px
      .permisssionSelect
        width: 150px

    .el-dialog
      box-shadow: none
      .el-dialog__header
        background-color: #1c8de0
        padding-bottom: 10px
        height: 45px
        .el-dialog__title
          color: #fff
          float: left
      .el-dialog__body
        font-size: 16px
        .userNameDel
          font-size: 18px
          font-weight: bold
      .el-dialog__footer
        text-align: center

    .email_suffix
      position: absolute
      top: 0
      right: -47px
      color: #999

    .el-radio
      margin-left: 10px

  @media (max-width: 642px)
    .employeeList
      .date-filter
        li
          display: block
          .managerFront
            width: 48px

</style>
