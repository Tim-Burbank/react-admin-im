
import { injectReducer } from 'store/reducers'
import { rootPath,childPath } from '../../../../config'

export default (store) => ({
  path : 'craftsman_management/new_craftsman',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const CraftsmanNew = require('./component/craftsmanNew').default
      const reducer = require('./module/craftsmanNew').default
      injectReducer(store, { key: 'craftsmanNew', reducer });
      cb(null, CraftsmanNew)
    }, 'CraftsmanNew')
  }
})
