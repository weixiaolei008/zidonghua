import Vue from 'vue'
import Router from 'vue-router'
import api from './../common/js/index'

Vue.use(Router);
const login = r => require.ensure([], () => r(require('./../view/login/Login')), 'login');
const ResetPwd = r => require.ensure([], () => r(require('./../view/login/ResetPwd')), 'ResetPwd');
const home = r => require.ensure([], () => r(require('./../view/home/Home')), 'home');

const ProjectManage = r => require.ensure([], () => r(require('../view/list/ProjectManage/ProjectManage.vue')), 'ProjectManage');
const NewProject = r => require.ensure([], () => r(require('../view/list/ProjectManage/NewProject.vue')), 'NewProject');

const UserManage = r => require.ensure([], () => r(require('../view/list/UserManage/UserManage.vue')), 'UserManage');
const NewUser = r => require.ensure([], () => r(require('../view/list/UserManage/NewUser.vue')), 'NewUser');

const DataDictionary = r => require.ensure([], () => r(require('../view/list/DataDictionary/DataDictionary.vue')), 'DataDictionary');
const NewDataDictionary = r => require.ensure([], () => r(require('../view/list/DataDictionary/NewDataDictionary.vue')), 'NewDataDictionary');
// 功能测试
const Project = r => require.ensure([], () => r(require('../view/list/Project/Project.vue')), 'home');
const FunctionTest = r => require.ensure([], () => r(require('../view/list/Project/FunctionTest/FunctionTest.vue')), 'Project');
const NewFunctionTest = r => require.ensure([], () => r(require('../view/list/Project/FunctionTest/NewFunctionTest.vue')), 'FunctionTest');
const NewFunctionQuickTest = r => require.ensure([], () => r(require('../view/list/Project/FunctionTest/NewFunctionQuickTest.vue')), 'FunctionQuickTest');
const FunctionPlay = r => require.ensure([], () => r(require('../view/list/Project/FunctionTest/FunctionPlay.vue')), 'NewFunctionTest');
const FunctionResult = r => require.ensure([], () => r(require('../view/list/Project/FunctionTest/FunctionResult.vue')), 'FunctionResult');
const FunctionResDetail = r => require.ensure([], () => r(require('../view/list/Project/FunctionTest/FunctionResDetail.vue')), 'FunctionResDetail');
const FunctionDetailItem = r => require.ensure([], () => r(require('../view/list/Project/FunctionTest/FunctionDetailItem.vue')), 'FunctionDetailItem');

// 普通压测
const PressureTest = r => require.ensure([], () => r(require('../view/list/Project/PressureTest/PressureTest.vue')), 'PressureTest');
const NewPressureTest = r => require.ensure([], () => r(require('../view/list/Project/PressureTest/NewPressureTest.vue')), 'NewPressureTest');
const PressurePlay = r => require.ensure([], () => r(require('../view/list/Project/PressureTest/PressurePlay.vue')), 'PressurePlay');
const PressureResult = r => require.ensure([], () => r(require('../view/list/Project/PressureTest/PressureResult.vue')), 'PressureResult');
const PressureResDetail = r => require.ensure([], () => r(require('../view/list/Project/PressureTest/PressureResDetail.vue')), 'PressureResDetail');

const ScenePressureTest = r => require.ensure([], () => r(require('../view/list/Project/PressureTest/ScenePressureTest.vue')), 'ScenePressureTest');
const SceneNewPressureTest = r => require.ensure([], () => r(require('../view/list/Project/PressureTest/SceneNewPressureTest.vue')), 'SceneNewPressureTest');
const PressureResDetailView = r =>  require.ensure([], () => r(require('../view/list/Project/PressureTest/PressureResDetailView.vue')), 'PressureResDetailView');
const PressureResDetailViewItem = r =>  require.ensure([], () => r(require('../view/list/Project/PressureTest/PressureResDetailViewItem.vue')), 'PressureResDetailViewItem');

// 规则配置
const RuleConfig = r => require.ensure([], () => r(require('../view/list/Project/RuleConfig/RuleConfig.vue')), 'RuleConfig');
const NewRule = r => require.ensure([], () => r(require('../view/list/Project/RuleConfig/NewRule.vue')), 'NewRule');
// 数据库还原
const DataConfig = r => require.ensure([], () => r(require('../view/list/Project/DataConfig/DataConfig.vue')), 'DataConfig');
const NewData = r => require.ensure([], () => r(require('../view/list/Project/DataConfig/NewData.vue')), 'NewData');
// 环境配置
const EnvConfig = r => require.ensure([], () => r(require('../view/list/Project/EnvConfig/EnvConfig.vue')), 'EnvConfig');
const NewEnv = r => require.ensure([], () => r(require('../view/list/Project/EnvConfig/NewEnv.vue')), 'NewEnv');
// 环境配置
const Desensitization = r => require.ensure([], () => r(require('../view/list/Project/Desensitization/Desensitization.vue')), 'Desensitization');

const router = new Router({
	mode: 'history',
	routes: [{
			path: '/',
			component: (resolve) => {
				require(['./../view/login/Login'], resolve)
			},
			hidden: true
		},
		{
			path: '/login',
			component: login,
			hidden: true
		},
    {
      path: '/ResetPwd',
      component: ResetPwd,
      hidden: true
    },
		{
			path: '/home',
			meta: {
				requireAuth: true
			},
			component: home,
			children: [{
					path: '/ProjectManage',
					name: '项目管理',
					meta: {
						requireAuth: true
					},
					component: ProjectManage
				},
        {
          path: '/NewProject',
          name: '项目',
          meta: {
            requireAuth: true
          },
          component: NewProject
        },
        {
          path: '/UserManage',
          name: '用户管理',
          meta: {
            requireAuth: true
          },
          component: UserManage
        },
        {
          path: '/NewUser',
          name: '用户',
          meta: {
            requireAuth: true
          },
          component: NewUser
        },
        {
          path: '/DataDictionary',
          name: '数据字典',
          meta: {
            requireAuth: true
          },
          component: DataDictionary
        },
        {
          path: '/NewDataDictionary',
          name: '编辑数据字典',
          meta: {
            requireAuth: true
          },
          component: NewDataDictionary
        },
        {
          path: '/Project',
          name: '',
          meta: {
            requireAuth: true
          },
          component: Project
        },
        // 功能测试
        {
          path: '/FunctionTest',
          name: '功能测试',
          meta: {
            requireAuth: true
          },
          component: FunctionTest
        },
        {
          path: '/NewFunctionTest',
          name: '功能测试',
          meta: {
            requireAuth: true
          },
          component: NewFunctionTest
        },
        {
          path: '/NewFunctionQuickTest',
          name: '一键功能测试',
          meta: {
            requireAuth: true
          },
          component: NewFunctionQuickTest
        },
        {
          path: '/FunctionPlay',
          name: '执行功能测试',
          meta: {
            requireAuth: true
          },
          component: FunctionPlay
        },
        {
          path: '/FunctionResult',
          name: '',
          meta: {
            requireAuth: true
          },
          component: FunctionResult
        },
        {
          path: '/FunctionResDetail',
          name: '查看测试结果',
          meta: {
            requireAuth: true
          },
          component: FunctionResDetail
        },
        {
          path: '/FunctionDetailItem',
          name: '',
          meta: {
            requireAuth: true
          },
          component: FunctionDetailItem
        },
        // 普通压测
        {
          path: '/PressureTest',
          name: '普通压测',
          meta: {
            requireAuth: true
          },
          component: PressureTest
        },
        {
          path: '/NewPressureTest',
          name: '普通压测',
          meta: {
            requireAuth: true
          },
          component: NewPressureTest
        },
        {
          path: '/PressurePlay',
          name: '执行普通压测',
          meta: {
            requireAuth: true
          },
          component: PressurePlay
        },
        {
          path: '/PressureResult',
          name: '查看普通压测结果',
          meta: {
            requireAuth: true
          },
          component: PressureResult
        },
        {
          path: '/PressureResDetail',
          name: '',
          meta: {
            requireAuth: true
          },
          component: PressureResDetail
        },
        
        //混合压测
        {
          path: '/ScenePressureTest',
          name: '混合压测',
          meta: {
            requireAuth: true
          },
          component: ScenePressureTest
        },
        {
          path: '/SceneNewPressureTest',
          name: '混合压测',
          meta: {
            requireAuth: true
          },
          component: SceneNewPressureTest
        },
        {
          path: '/PressureResDetailView',
          name: '混合压测',
          meta: {
            requireAuth: true
          },
          component: PressureResDetailView
        },
        {
          path: '/PressureResDetailViewItem',
          name: '混合压测',
          meta: {
            requireAuth: true
          },
          component: PressureResDetailViewItem
        },

        // 规则配置
        {
          path: '/RuleConfig',
          name: '比对规则',
          meta: {
            requireAuth: true
          },
          component: RuleConfig
        },
        {
          path: '/NewRule',
          name: '比对规则',
          meta: {
            requireAuth: true
          },
          component: NewRule
        },
        // 数据库还原
        {
          path: '/DataConfig',
          name: '数据还原',
          meta: {
            requireAuth: true
          },
          component: DataConfig
        },
        {
          path: '/NewData',
          name: '还原点',
          meta: {
            requireAuth: true
          },
          component: NewData
        },
        // 环境配置
        {
          path: '/EnvConfig',
          name: '环境配置',
          meta: {
            requireAuth: true
          },
          component: EnvConfig
        },
        {
          path: '/NewEnv',
          name: '环境',
          meta: {
            requireAuth: true
          },
          component: NewEnv
        },
        // 脱敏配置
        {
          path: '/Desensitization',
          name: '数据脱敏',
          meta: {
            requireAuth: true
          },
          component: Desensitization
        }
			]
		},
		{
			path: '*', //*号表示匹配任意内容
			redirect: '/ProjectManage',
			extra: {
				inMenu: false
			}
		}
	]
})

//  判断是否需要登录权限 以及是否登录
router.beforeEach((to, from, next) => {
	if(to.matched.some(res => res.meta.requireAuth)) { // 判断是否需要登录权限
		var user = api.sGetObject("_user");
		// console.log(user);
		if(user == null) {
			user = {
				token: ''
			};
		}
		if(user.token) { // 判断是否登录
			next()
		} else { // 没登录则跳转到登录界面
			next({
				path: '/',
				// query: {redirect: to.fullPath}
			})
		}
	} else {
		next()
	}
})

export default router
