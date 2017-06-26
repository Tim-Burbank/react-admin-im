
import { injectReducer } from 'store/reducers'
import { rootPath,childPath } from '../../../../config'

export default (store) => ({
  path : 'role/roleInfo/:id',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const RoleInfo = require('./container/roleInfo').default
      const reducer = require('./module/roleInfo').default
      injectReducer(store, { key: 'roleInfo', reducer });
      cb(null, RoleInfo)
    }, 'roleInfo')
  }
})
