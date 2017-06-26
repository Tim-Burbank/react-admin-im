
import { injectReducer } from 'store/reducers'
import { rootPath,chilPath } from '../../config'


export default (store) => ({
  path : rootPath.recommend_position,
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const RecommendPosition = require('./containers/RecommendPosition').default;
      const reducer = require('./module/recommendPosition').default
      injectReducer(store, { key: 'recommendPosition', reducer })
      cb(null, RecommendPosition)
    }, 'RecommendPosition')
  },
})

