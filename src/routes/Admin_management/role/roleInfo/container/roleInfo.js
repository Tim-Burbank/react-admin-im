/**
 * Created by Yurek on 2017/5/17.
 */
import React from 'react'
import RoleInfoPage from '../component/roleInfo'
import { connect } from 'react-redux'
const mapStateToProps = (state,props) => ({
  roleInfo:state.getIn(['roleInfo','roleInfo']),
})
export default connect(mapStateToProps)(RoleInfoPage)
