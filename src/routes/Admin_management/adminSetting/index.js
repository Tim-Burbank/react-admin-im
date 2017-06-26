
import { injectReducer } from 'store/reducers'
import { rootPath,chilPath } from '../../../config'
import {AdminSettingPage} from './component/AdminSetting_page'


export default (store) => ({
  path : rootPath.admin_setting,
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const AdminSettingPage = require('./component/AdminSetting_page').default;
      const reducer = require('./module/adminSetting').default
      injectReducer(store, { key: 'adminSetting', reducer })
      cb(null, AdminSettingPage)
    }, 'AdminSettingPage')
  },
})

