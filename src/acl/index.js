import Vue from 'vue'
import { AclInstaller, AclCreate, AclRule } from 'vue-acl'
import router from '@/router'

Vue.use(AclInstaller)

export const AppRoles = {
  operator: 'operator',
  manager: 'manager',
  owner: 'owner',
  admin: 'admin'
};

let initialRole = 'isPublic';

const userInfo = JSON.parse(localStorage.getItem('userInfo'))
if (userInfo && userInfo.role) initialRole = userInfo.role;

export default new AclCreate({
  initial: initialRole,
  notfound: '/pages/error-404',
  router,
  acceptLocalRules : true,
  globalRules: {
    admin  : new AclRule('admin').generate(),
    operator : new AclRule('operator').or('admin').generate()
    isAdmin: new AclRule(AppRoles.admin).generate(),
    isOwner: new AclRule(AppRoles.owner).or(AppRoles.admin).generate(),
    isManager: new AclRule(AppRoles.manager).or(AppRoles.admin).or(AppRoles.owner).generate(),
    isOperator: new AclRule(AppRoles.operator).or(AppRoles.admin).or(AppRoles.owner).or(AppRoles.manager).generate(),
    isPublic: new AclRule('public').or(AppRoles.admin).or(AppRoles.owner).or(AppRoles.manager).or(AppRoles.operator).generate(),
  }
})
