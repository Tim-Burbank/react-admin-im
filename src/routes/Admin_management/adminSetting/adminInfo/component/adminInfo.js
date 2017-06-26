
import React from 'react'
import { injectIntl } from 'react-intl'
import { Row , message , Spin ,Button ,Pagination,Form,Input,Col ,Radio,Upload,Icon,Modal,Select } from  'antd'
import { connect } from 'react-redux'
import {ImmutableTable} from '../../../../../components/antd/Table'
import SimpleForm from '../../../../../components/antd/SimpleForm'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {Link} from 'react-router'
import Title from '../../../../../components/title/title'
import {adminSettingTableField as _admT  ,operation,adminDetail as _admD , voucherStatus,titles as _tit,supplierType,supplierStatus,supplierTableFields as _sup,product_category,couponPayType,product_subcategory,couponDetail as _coupD ,customerFreezed,customerDetails as _cusd,gender,freezed_type} from '../../../../../config'
import Immutable from 'immutable'
import {formatDate,formatMoney,configDirectory,formatAddress,configCate,configDirectoryObject} from '../../../../../utils/formatData'
import { fetchAdminInfo, updateAdminInfo,fetchAdminOptInfo,changePassword} from '../module/adminInfo'
import {updateAdminStatus} from '../../../adminSetting/module/adminSetting'
import {fetchRole,updateRole,deleteRole} from '../../../role/module/role'
import {getFormRequired} from '../../../../../utils/common'
import { pathJump } from '../../../../../utils/'
const RadioGroup   = Radio.Group;
const Option = Select.Option;





class AdminInfoPage extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      previewImage:'',
      newPage:false,
      visible:false,
      addressModal:false,
      category:null,
      adminLoad:false,
      passLoad:false
    }
  }

  componentWillMount(){
    this.setState({load:true,loading:true});
    const {dispatch,params} = this.props;

      dispatch(fetchAdminInfo(params.id,'get')).then((e)=>{
        console.log('willmount',e)
        if(e.error){
          this.setState({load:false})
          message.error(e.error.message);
        }else{
          this.setState({load:false})
        }
      });

    dispatch(fetchAdminOptInfo(params.id,'get')).then((e)=>{
      console.log('roleeee',e)
      if(e.error){
        this.setState({loading:false})
        message.error(e.error.message);
      }else{
        this.setState({loading:false})
      }
    })
    dispatch(fetchRole()).then((e)=>{
      console.log('roleeee',e)
      if(e.error){
        message.error(e.error.message);
      }else{
        this.setState({role:e.payload})
      }
    })

  }


  changePassword=()=>{
    this.setState({passModal:'true'})
  }


  handleSave=()=>{

    const {dispatch,params,intl:{formatMessage},couponInfo} = this.props;
    this.form.validateFields((err, values) => {
      if (!err) {
        //if(!this.form.isFieldsTouched()){return this.setState({visible:false})}//没有任何改动
        console.log('receive form value',values)
        //if(this.state.newPage){
        //  dispatch(fetchSupplierInfo('','post',values)).then(e=>{
        //    console.log(e)
        //    if(e.error){
        //      message.error(e.error.message)
        //    }else{
        //      message.success(formatMessage({id:'save_ok'}))
        //    }
        //  })
        //}else{
        let arr = []
        arr.push(values['roles'])
        values = {
          ...values,
          type:0,
          roleIds:arr,
          name:values['admin_name'],
          department:values['admin_department'],
        }


        this.setState({adminLoad:true})
        dispatch(fetchAdminInfo(params.id,'put',values)).then(e=>{
          console.log(e)
          if(e.error){
            message.error(e.error.message)
            this.setState({adminLoad:false});
          }else{
            message.success(formatMessage({id:'modify_ok'}))
            this.setState({adminLoad:false,load:true,visible:false});
            dispatch(fetchAdminInfo(params.id,'get')).then(e=>{
              console.log(e)
              if(e.error){
                message.error(e.error.message)
                this.setState({load:false});
              }else{
                this.setState({load:false})
              }
            });

          }
        });
      }
    });
  }
  modify=()=>{
    this.setState({visible:true})
  };

  handleAccount=(action,rls,tips,type)=>{
    const {dispatch,adminInfo,params} = this.props

    let json = {
      ids:adminInfo.get('id'),
      status:rls
    }
    this.setState({load:true})
    dispatch(action(json,params.id,type))
      .then(e=>{
        console.log('eee',e)
        if(e.error){
          message.error(e.error.message)
          this.setState({load:false})
        }else{
          this.setState({load:false})
          message.success(tips+" admin account success")
        }
      })

  }
  getRequiredMessage=(e,type)=>{
    return getFormRequired(this.props.intl.formatMessage({id:'input_require'},{name:e}),type)
  };

  changePass=(e)=>{
    console.log('password',e.target.value)
    this.setState({fpassword:e.target.value})
  }

  changePassAgain=(e)=>{
    console.log('lpassword',e.target.value)
    this.setState({lpassword:e.target.value})
  }

  handlePassModal = () => {
    const {fpassword,lpassword} = this.state
    const {dispatch,adminInfo,intl:{formatMessage}} = this.props

    let json = {
      id:adminInfo.get('id'),
      password:lpassword
    }
    if(fpassword === lpassword&&fpassword ){
      this.setState({passLoad:true})
      dispatch(changePassword(json)).then(e=>{
        if(e.error){
          this.setState({passLoad:false,fpassword:null,lpassword:null})
          message.error(e.error.message)
        }else{
          this.setState({passLoad:false})
          message.success(formatMessage({id:'changePasswordSuccess'}));
          this.setState({ passModal: false,fpassword:null,lpassword:null })
        }
      })
    }else{
      message.error(formatMessage({id:'passwordFailed'}));
    }

  };

  onOk=()=>{
    this.setState({visible:false})
  }

  modifyAddress=()=>{
    this.setState({addressModal:true})
  };

  addressSave=()=>{
    this.setState({addressModal:false})
  }



  render(){
    const {intl:{formatMessage},location:{pathname},params,adminOptInfo,adminInfo} = this.props;
    const {visible,newPage ,addressModal,passModal,loading,fpassword,lpassword} = this.state;

    const renderOption=(x)=>{
      if(x){
        return x.map((v,i)=>(
          <Option key={v.id} value={v.id}>{v.name}</Option>
        ))
      }
    };




    const column = [
      {dataIndex:_admD.username},
      {dataIndex:_admD.mobile},
      {dataIndex:_admD.email},
      {dataIndex:_admD.name,deep:['admin','name']},
      {dataIndex:_admD.department,deep:['admin','department']},
      {dataIndex:_admD.roleIds,deep:['roles','0','name']},
    ];



    const optColumns = [
      {dataIndex:_admT.createdAt,render:date=>formatDate(date)},

      {dataIndex:_admT.operation,render:(text,record)=>{
        return configDirectoryObject(text,operation)
      }},
      {dataIndex:_admT.target},
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`adminSetting_${item.dataIndex}`}),
      })
    );

    const renderForm=(v,column)=>{
      console.log('column',v);
      if(v == undefined || v=='') return
      if(v == 0){
        if(column.trans){
          return column.trans(v,column.config)
        }else{
          return 0
        }
      }

      if(column.trans){
        return column.trans(v,column.config)
      }else if(column.format){
        return column.format(v).map((t,i)=>(
          <Row key={i} >
            {t}
          </Row>
        ))
      }else{
        return v
      }
    }



    const columnMap=column=>{
      let text
      if(adminInfo){
        text=column.deep?adminInfo.getIn(column.deep):adminInfo.get(column.dataIndex)
      }else{
        text= ''
      }
      let bold = column.bold
      return (
        <Col key={column.dataIndex} span={column.span ||24} className='payment-item' style={{paddingLeft:'20%'}} >
          <span className="payment-label" style={{fontWeight:'bold'}}>{formatMessage({id:`admin_${column.dataIndex}`})}</span>
          <span className="payment-value" style={bold&&{fontWeight:"bold"}} >{
            renderForm(text,column)
          }</span>
        </Col>
      )};



    const formColumns = [

      {dataIndex:_admD.name,option:this.getRequiredMessage(formatMessage({id:`admin_${_admD.name}`}))},
      {dataIndex:_admD.mobile},
      {dataIndex:_admD.email},
      {dataIndex:_admD.department},
      {dataIndex:_admD.roles,FormTag:
        <Select  placeholder="Please select">
          {renderOption(this.state.role)}
        </Select>},
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`admin_${item.dataIndex}`})
      })
    );
    return (
      <Row>
        <Title title={formatMessage({id:`${_tit.admin_detail}`})} />
        <Row type="flex" justify="end" style={{marginTop:"20px",marginBottom:'20px'}}>
          <Button  onClick={this.changePassword} style={{marginRight:"10px"}} >{formatMessage({id:'changePassword'})}</Button>
          <Button onClick={this.handleAccount.bind(this,updateAdminStatus.stop,2,'Stop ',2)} type="danger" style={{marginRight:'10px'}}>{formatMessage({id:'stop'})}</Button>
          <Button onClick={this.handleAccount.bind(this,updateAdminStatus.active,1,'Stop ',2)} style={{marginRight:'10px'}}>{formatMessage({id:'active'})}</Button>
          <Button onClick={this.handleAccount.bind(this,updateAdminStatus.stop,0,'Delete ',2)} style={{marginRight:'10px'}}>{formatMessage({id:'delete'})}</Button>
        </Row>
        <Spin spinning={this.state.load} tip="Loading...">
          <Row className="payment-read" style={{marginBottom:30}}>
            {column.map(columnMap)}
          </Row>
          <Row type="flex" justify="center" style={{marginTop:"20px"}}>
            <Button onClick={()=>{this.setState({visible:true})}}  type="primary" size="large">{formatMessage({id:'modify'})}</Button>
          </Row>
        </Spin>
        <ImmutableTable
          loading={loading}
          style={{marginTop:20}}
          columns={optColumns}
          dataSource={adminOptInfo}
          title={()=>formatMessage({id:"admin_opt_record"})}
          pagination={{ pageSize: 13,total:adminOptInfo&&adminOptInfo.size }}
        />

        <Modal
          title={formatMessage({id:'admin_edit'})}
          visible={visible}
          onCancel={()=>this.setState({visible:false})}
          maskClosable={false}
          onOk={this.handleSave}
          width={700}
          okText="Save"
          cancelText="Cancel"
        >
          {<Spin  spinning={this.state.adminLoad} tip="saving..." >
              <Row>
                <SimpleForm columns={formColumns} initial={adminInfo} colSpan={24} labelCol={{span:5}} ref={f=>this.form=f} />
              </Row>
            </Spin>}
        </Modal>
        <Modal
          visible={passModal}
          onCancel={()=>this.setState({passModal:false,fpassword:null,lpassword:null})}
          title={formatMessage({id:'changePassword'})}
          onOk={this.handlePassModal}
          maskClosable={false}
          okText="Save"
          cancelText="Cancel"
        >
          <Spin  spinning={this.state.passLoad} tip="Saving..." >
            <Row>
              <Col span="6">
                <span>{formatMessage({id:'newPassword'})}</span>
              </Col>
              <Col span="18">
                <Input placeholder={formatMessage({id:'inputNewPassword'})}  value={fpassword}onChange={this.changePass} type="password" />
              </Col>
            </Row>
            <Row style={{marginTop:'7px'}}>
              <Col span="6">
                <span>{formatMessage({id:'inputAgain'})}</span>
              </Col>
              <Col span="18">
                <Input placeholder={formatMessage({id:'inputNewPasswordAgain'})} value={lpassword} onChange={this.changePassAgain} type="password" />
              </Col>
            </Row>
          </Spin>
        </Modal>
      </Row>
    )
  }
}





AdminInfoPage.propTypes = {
  pathJump : React.PropTypes.func,
};

const mapStateToProps = (state,props) => ({
  adminInfo:state.getIn(['adminInfo','adminInfo']),
  adminOptInfo:state.getIn(['adminInfo','adminOptInfo']),

})
export default injectIntl(connect(mapStateToProps)(AdminInfoPage))




