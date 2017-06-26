import React from 'react';
import {connect} from 'react-redux';
import {fetchState} from '../../config';
import {pathJump} from '../../utils'
import {getUserInfo} from '../../store/user'

//判断用户是否登录的组件

export function requireAuth(Component) {
  class AuthenticatedComponent extends React.PureComponent{
    componentWillMount(){
      this.check(this.props)
    }
    componentWillReceiveProps(props){
      this.check(props)
    }
    check=props=>{
      if(!!props.user && props.user.get('status')===fetchState.success){
        this.hasAuth=true;
      }else{

        //获取用户信息
        //  props.dispatch(getUserInfo()).then(e=>{
        //  if(e.error){
        //    this.hasAuth=false;
        //    props.dispatch(pathJump(`/login?next=${props.location.pathname}`))
        //  }
        //})
      }
    };
    render(){
        return this.hasAuth?<Component {...this.props} />:null
    }
  }
  const mapStateToProps = (state) => ({
    user: state.get('user')
  });
  return connect(mapStateToProps)(AuthenticatedComponent);
}
