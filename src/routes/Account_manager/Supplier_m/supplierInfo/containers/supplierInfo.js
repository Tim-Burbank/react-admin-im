/**
 * Created by Yurek on 2017/5/17.
 */
import React from 'react'
import SupplierInfo from '../component/supplierInfo'
import { connect } from 'react-redux'
const mapStateToProps = (state,props) => ({
  supplierInfo:state.getIn(['supplierInfo','supplierInfo']),
})
export default connect(mapStateToProps)(SupplierInfo)
