
import { injectReducer } from 'store/reducers'
import { rootPath,childPath } from '../../../../config'

export default (store) => ({
  path : 'admin_setting/adminInfo/:id',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const AdminInfo = require('./component/adminInfo').default
      const reducer = require('./module/adminInfo').default
      injectReducer(store, { key: 'adminInfo', reducer });
      cb(null, AdminInfo)
    }, 'AdminInfo')
  }
})
