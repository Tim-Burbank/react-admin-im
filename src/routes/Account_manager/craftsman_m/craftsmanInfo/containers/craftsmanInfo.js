/**
 * Created by Yurek on 2017/5/17.
 */
import React from 'react'
import CraftsmanInfo from '../component/craftsmanInfo'
import { connect } from 'react-redux'
const mapStateToProps = (state,props) => ({
  craftsmanInfo:state.getIn(['craftsmanInfo','craftsmanInfo']),
});



export default connect(mapStateToProps)(CraftsmanInfo)
