import React from 'react'
import { injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { IndexLink, Link } from 'react-router'
import { Menu, Icon ,message ,Badge } from 'antd'
import { pathJump } from '../../utils/'
import { logout ,getLogNum } from '../../store/user'
import './Nav.scss'
const SubMenu = Menu.SubMenu;

class Side extends React.PureComponent {
  componentDidMount(){
  }
  componentWillUnmount(){
  }
  render() {
    const props=this.props;
    const {intl:{formatMessage},location:{pathname},user}=props;
    console.log('user',user)
    const nav = [
      {
        key: 'Account_management',
        name: formatMessage({id: 'Account_management'}),
        icon: 'database',
        show:true,
        type:'sub',
        child:[{
          key: 'supplier_management',
          name: formatMessage({id: 'supplier_management'}),
          show:true,
        },
          {
            key: 'customer_management',
            name: formatMessage({id: 'customer_management'}),
            show:true,
          },
          {
            key: 'craftsman_management',
            name: formatMessage({id: 'craftsman_management'}),
            show:true,
          }]
      },{
        key:'order_management',
        name:formatMessage({id: 'order_management'}),
        icon: 'copy',
        show:true,
      },{
        key:'product_management',
        name:formatMessage({id: 'product_management'}),
        icon: 'gift',
        show:true,
      },{
        key:'message_management',
        name:formatMessage({id: 'message_management'}),
        icon: 'message',
        show:true,
        type:'sub',
        child:[{
          key: 'information_push',
          name: formatMessage({id: 'information_push'}),
          show:true,
        },{
          key: 'feedback',
          name: formatMessage({id: 'feedback'}),
          show:true,
        }]
      },{
        key: 'adminstrator_management',
        name: formatMessage({id: 'adminstrator_management'}),
        icon: 'safety',
        type:'sub',
        show:true,
        child:[{
          key: 'admin_setting',
          name: formatMessage({id: 'admin_setting'}),
          show:true,
        },{
          key: 'role',
          name: formatMessage({id: 'role'}),
          show:true,
        }]
      },{
        key: 'promotion_center',
        name: formatMessage({id: 'promotion_center'}),
        icon: 'heart-o',
        show:true,
        type:'sub',
        child:[{
          key: 'coupons_management',
          name: formatMessage({id: 'coupons_management'}),
          show:true,
        },{
          key: 'recommend_position',
          name: formatMessage({id: 'recommend_position'}),
          show:true,
        }]
      },{
        key: 'financial_management',
        name: formatMessage({id: 'financial_management'}),
        icon: 'bank',
        show:true,
        type:'sub',
        child:[{
          key: 'withdraw',
          name: formatMessage({id: 'withdraw'}),
          show:true,
        },{
          key: 'customer_finance',
          name: formatMessage({id: 'customer_finance'}),
          show:true,
        },{
          key: 'supplier_finance',
          name: formatMessage({id: 'supplier_finance'}),
          show:true,
        }]
      }
    ];

    //let _user = user.toJS()
    //let checkNavDisplay=navList=>{
    //  return navList.map(nav=>{
    //
    //    let hasScope=false;
    //    let _userRole = [];
    //    if(_user.roles){
    //      _user.roles.map(v=>{
    //        _userRole.push(v.id)
    //      })
    //    }
    //    console.log(_userRole)
    //    //查看权限
    //    if(nav.role && Array.isArray(nav.role)){
    //      for(let k of _userRole){
    //        hasScope= nav.role.indexOf(k)>-1
    //        if(hasScope) break
    //      }
    //    }
    //
    //
    //    console.log(hasScope)
    //    //设置show
    //    nav.show!==false?nav.show=true:nav.show=false;
    //    if(!hasScope) {
    //      nav.show = false;
    //    }
    //
    //    return nav;
    //  });
    //
    //};
    //let nav = _nav.slice(0)
    //if(_user.roles){
    //  nav = checkNavDisplay(_nav)
    //}
    return (
      <Menu
        theme='dark'
        mode={props.mode}
        selectedKeys={[pathname.replace(/(^\/)+|\/.*/g,'')]}
        defaultSelectedKeys={['sup_manage']}
        defaultOpenKeys={['Account_management']}
        style={{marginTop:32}}

        onClick={e=>{
          if(e.key==='login'){
            props.dispatch(logout()).then(result=>{
              if(result.error){
                message.error(result.error.message)
              }else{
                props.pathJump('/'+e.key)
              }
            })
          }else if(e.key==='username'){
          if(user){
             props.pathJump('/admin_setting/adminInfo/'+user.getIn(['account','id']))
          }
          }else{
            props.pathJump('/'+e.key)
          }
        }}
      >




        {
          nav.map(item => {
            return item.type=='sub'?<SubMenu
              key={item.key}
              title={<span><Icon type={item.icon} /><span className="nav-text">{item.name}</span></span>}
              style={{display:item.show?'block':'none'}}>
              {item.child&&item.child.map(v =>(
                  <Menu.Item
                  key={v.key}
                  style={{display:v.show?'block':'none'}}
                >{v.name}
                </Menu.Item>))
              }
            </SubMenu>: <Menu.Item
                key={item.key}
                style={{display:item.show?'block':'none'}}
              >
              <Icon type={item.icon} />
              <span className='nav-text'>{item.name}</span>
              </Menu.Item>

          })
        }

        <Menu className="divider" />
        <Menu.Item key='username'>
          <div >
                <span>
                  <Icon type="user" />
                  {user&&<span  className="nav-text">{user.getIn(['account','username'])}</span>}
                </span>
          </div>
          </Menu.Item>
        <Menu.Item key='login'>
            <span>
              <Icon type='poweroff' />
              <span className='logout'>Log out</span>
            </span>
        </Menu.Item>
      </Menu>
    )
  }
}


const mapStateToProps = (state) => ({
  location:state.get('routing').locationBeforeTransitions,
  user : state.get('user')
})

const mapDispatchToProps =dispatch=>({
  dispatch,
  pathJump:(path)=>dispatch(pathJump(path))
});
export default connect(mapStateToProps,mapDispatchToProps)(injectIntl(Side))

