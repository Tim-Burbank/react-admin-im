import React from 'react'
import { injectIntl, intlShape } from 'react-intl'
// import ImmutablePropTypes from 'react-immutable-proptypes'
import { Form, Input, Button, Row, Col, Alert,message} from 'antd'
import LocaleBtn from '../../../containers/global/LocaleBtn'
const FormItem = Form.Item
import './login.scss'

export const Login = (props) => {

  console.log('page',props)
  console.log('usersss',props.user.toJS())
  const { getFieldDecorator } = props.form
  const { formatMessage } = props.intl
  const baseLeft = 6
  const baseRight = 17
  const formItemLayout = {
    labelCol: { span: baseLeft },
    wrapperCol: { span: baseRight }
  }
  const username = formatMessage({ id: 'login_username' })
  const password = formatMessage({ id: 'login_password' });

  return (
    <div className="login_page">
      <header className='header'>
        <div className="container">
          <div className="nav_header">
            <p className="logo">Yself Group</p>
            <div className="nav_right">
              <LocaleBtn />
            </div>
          </div>
        </div>
      </header>
      <div className="content">
        <img className="img" src="http://wx1.sinaimg.cn/mw690/877c281bgy1fgq963l2mzj20xc0ir42v.jpg" />
        <Row type='flex' justify='center' align='middle' className='login'>
          <Col className='login-wrap'>
            <Form
              layout="vertical"
              hideRequiredMark={true}
              onSubmit={e => {
            let page
            e.preventDefault()
            props.form.validateFields((err, values) => {
            console.log(values)
              if (!err) {
                console.log('Received values of form: ', values)
                values.type = 0
                props.set({loading:true})
                props.login(values).then(e=>{
                  console.log('login=',e)
                  if(e.payload){
                  //  if(e.payload.roles instanceof Array){
                  //    e.payload.roles.map(v=>{
                  //      console.log('role',v.id)
                  //      switch (v.id){
                  //        case 'applicant':page = '/my-list/waiting';
                  //          break;
                  //        case 'manager':page = '/supervisor/approving';
                  //          break;
                  //        case 'admin':page = '/my-list/waiting';
                  //              break;
                  //        case 'cashier':page = '/cashier/approving';
                  //              break;
                  //        case 'finance':page = '/finance/approving';
                  //              break;
                  //        case 'chief':page = '/finance_approval/approving';
                  //              break;
                  //        case 'mantainer':page = '/permissions/systemUser';
                  //              break;
                  //        case 'hr':page = '/setting/company';
                  //              break;
                  //        default:page = page;
                  //      }
                  //    })
                  //    console.log(page)
                  //    props.pathJump(page)
                  //}else{
                  //
                  //
                  //  }
                  props.set({loading:false})
                  props.pathJump('/supplier_management')
                  }else{
                  props.set({loading:false})
                    message.error(e.error.message)
                  }
                });
              }
              console.log(values)
            })

          }}>

              <FormItem

                label={username}
              >
                { getFieldDecorator('username', {
                  initialValue:'1@test.com',//
                  rules: [{ required: true, message: formatMessage({ id: 'ac_input_require' }) }]
                })(
                  <Input placeholder={formatMessage({ id: 'input_placeholder' }, { name: username })} />
                ) }
              </FormItem>
              <FormItem

                label={password}
              >
                { getFieldDecorator('password', {
                  initialValue:'111111',
                  rules: [{ required: true, message: formatMessage({ id: 'ps_input_require' }, { name: password }) }]
                })(
                  <Input placeholder={formatMessage({ id: 'input_placeholder' }, { name: password })}
                         type='password' />
                ) }
              </FormItem>
              <Row>
                <Col span={baseRight}>
                  <Button type='primary' className="logInBtn" htmlType='submit' loading={props.loading}
                  >{ formatMessage({ id: 'login_login' }) }</Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
      <div className="footer">
        <div className="container">
          <div className="menu"></div>
          <div className="text">
            © 2016-2017 Copyright by Yself Group All rights reserved
          </div>
        </div>
      </div>
  </div>

  )
}

Login.propTypes = {
  form: React.PropTypes.object.isRequired,
  intl: intlShape.isRequired
}

class CheckLogin extends React.Component{
  state = {
    loading: false,
  }

  // componentWillMount(){
  //   let page = '';
  //   console.log('CheckLogin',this.props)
  //   if(this.props.user && this.props.user.get('status')===fetchState.success){
  //     let _user = this.props.user.toJS();
  //
  //     // _user.roles.map(v=>{
  //     //   switch (v.id){
  //     //     case 'applicant':page = '/my-list/waiting';
  //     //           break;
  //     //     case 'manager':page = '/supervisor/approving';
  //     //           break;
  //     //     default:page = null;
  //     //   }
  //     // })
  //     //
  //     // this.setState({page})
  //     this.props.pathJump(this.props.location.query.next || '/my-list/waiting')
  //   }
  // }
  render(){

    //return <Login {...this.props} page={this.props.user.toJS().roles} />
    return <Login {...this.props} loading={this.state.loading} set={(v)=>{this.setState(v)}} page={this.props.user.toJS().roles} />
  }
}

export default Form.create()(injectIntl(CheckLogin))
