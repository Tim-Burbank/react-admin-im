/**
 * Created by Yurek on 2017/5/11.
 */
import React from 'react'
import { injectIntl } from 'react-intl'
import { Row , message , Spin ,Button ,Pagination,Modal,Col,Input,Select  } from  'antd'
import { connect } from 'react-redux'
import {ImmutableTable} from '../../../../components/antd/Table'
import ImmutablePropTypes from 'react-immutable-proptypes'
import SimpleForm from '../../../../components/antd/SimpleForm'
import {Link} from 'react-router'
import { pathJump } from '../../../../utils/'
import TopSearch from '../../../../components/search/topSearch'
import Title from '../../../../components/title/title'
import {adminStatus,adminDetail as _admD , adminSettingTableField as _adminT ,pushType,jpushTableFields as pushT,titles as _tit,feedbackTableField as _feeT,feedbackReplyStatus,feedbackStatus,supplierType,supplierStatus,supplierTableFields as _sup,supplierShowType,customerStatus,customerFreezed} from '../../../../config'
import Immutable from 'immutable'
import {fetchAdmin,updateAdmin,newAdmin,updateAdminStatus} from '../module/adminSetting'
import {fetchRole,updateRole,deleteRole,} from '../../role/module/role'
import {getFormRequired} from '../../../../utils/common'
import {formatDate,formatMoney,configDirectory,configDirectoryObject} from '../../../../utils/formatData'
const Option = Select.Option;

class AdminSettingPage extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      loading : false,
      selectedNum:[],
      searchOption:null,
      currentPage:1,
      role:[],
      adminLoad:false
    }
  }


  componentWillMount(){
    const {dispatch,params,location} = this.props;
    console.log('this.props',this.props)
    if(location && location.query){
      this.setState({loading:true});
      dispatch(fetchAdmin(location.query)).then((e)=>{
        if(e.error){
          message.error(e.error.message);
        }else{
          this.setState({loading:false})
        }
      });
      dispatch(fetchRole()).then((e)=>{
        console.log('roleeee',e)
        if(e.error){
          message.error(e.error.message);
        }else{
          this.setState({role:e.payload})
        }
      })
    }
  }

  onFetch = (values) =>{
    const {dispatch,customerAccount}=this.props;
    this.setState({loading:true});
    this.setState({searchOption:values})
    //获取数据
    dispatch(fetchAdmin(values)).then((e)=>{
      if(e.error){
        message.error(e.error.message);
        this.setState({loading:false})
      }else{
        this.setState({loading:false})
      }
    });
  };

  create=e=>{
    const {dispatch} = this.props
    dispatch(pathJump('feedback/customerInfo/new'))
  };

  getcontent=()=>{
    const {intl:{formatMessage}} = this.props
    return <Button onClick={()=>{this.setState({adminModal:true})}} type='primary'>{formatMessage({id:"newAdmin"})}</Button>
  };

  changeTable=(pagination, filters, sorter) => {
    console.log(pagination, filters, sorter)
    this.setState({currentPage:pagination.current})
  }


  getRequiredMessage=(e,type)=>{
    return getFormRequired(this.props.intl.formatMessage({id:'input_require'},{name:e}),type)
  };

  handleAccount=(action,rls,tips)=>{

    const {dispatch,adminSetting,intl:{formatMessage}} = this.props

    let _supData= adminSetting.toJS()
    let idArr = [];
    let _selectedNum = this.state.selectedNum
    let page = this.state.currentPage
    if(_selectedNum.length>0) {
      if (page == 1) {
        _selectedNum.map(z=> {
          idArr.push(_supData[z]['id'])
        })
      } else {
        _selectedNum.map(z=> {
          console.log('page', z + (page - 1) * 13)
          idArr.push(_supData[z + (page - 1) * 13]['id'])
        })
      }
      console.log(idArr)
      let json = {
        ids: idArr,
        status: rls
      }
      this.setState({loading:true});
      dispatch(action(json, this.state.searchOption)).then(e=> {
        if (e.payload) {
          message.success(tips + this.state.selectedNum.length + " account success")
          this.setState({loading: false, selectedNum: []});
        } else {
          message.error(e.error.message)
        }
      })
    }else{
      message.error(formatMessage({id:"selectOne"}))
    }
  }


  handleAdminModal=()=>{
    const {dispatch,params,intl:{formatMessage}} = this.props;
    this.form.validateFields((err, values) => {
      if (!err) {
        //if(!this.form.isFieldsTouched()){return this.setState({visible:false})}//没有任何改动
        console.log('receive form value',values)
        this.setState({load:true})
        let arr = []
        arr.push(values['roleIds'])
        values = {
          ...values,
          type:0,
          roleIds:arr,
          name:values['admin_name'],
          department:values['admin_department'],
        }
        console.log('value',values)
        this.setState({adminLoad:true})
        dispatch(newAdmin(values)).then(e=>{
          if(e.error){
            message.error(e.error.message)
            this.setState({adminLoad:false})
          }else{
            this.setState({adminLoad:false,adminModal:false})
            message.success(formatMessage({id:'save_ok'}))
          }
        })

      }
    });
  }


  onPageChange=(pageNumber)=>{
    console.log('Page: ', pageNumber);
  }

  render(){
    const {intl:{formatMessage},adminSetting,location:{pathname}} = this.props;
    const {adminModal} = this.state
    console.log('pathname',pathname)
    console.log('this.state',this.state)

    const { loading } = this.state
    const columns = [
      {dataIndex:_adminT.departmentId,render:(text,record)=>{
        return record.getIn(['admin','department'])
      }},
      {dataIndex:_adminT.username},
      {dataIndex:_adminT.status,render:(text,record)=>{
        return configDirectoryObject(text,adminStatus)
      }},
      {dataIndex:_adminT.roles,render:(text,record)=>{
        return record.getIn(['roles','0','name'])
      }},
      {dataIndex:_adminT.createdAt,render:date=>formatDate(date)},
      {dataIndex:_adminT.operation,render:(text,$record)=>{
        return (
          <Link to={`${pathname}/adminInfo/${$record.get('id')}`}>
            {formatMessage({id:"view"})}
          </Link>)
      }}
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`adminSetting_${item.dataIndex}`}),
      })
    );

    this.formColumns=[
      {dataIndex:'createdAt_between',type:'date'},
      {dataIndex:'option',placeholder:'option',type:'select',selectOption:['All','Admin Username','Position']},
      {dataIndex:'keywords',formTag:'input'},
      {dataIndex:'role',placeholder:'role',type:'select',selectOption:feedbackStatus},
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`search_${item.dataIndex}`}),
      })
    );


    const renderOption=(x)=>{
      if(x){
        return x.map((v,i)=>(
          <Option key={i} value={v.id}>{v.name}</Option>
        ))
      }
    };



    let searchProps={
      formColumns:this.formColumns,
      onSave:this.onFetch,
      rightContent:this.getcontent()
    };

    const Selection = {
      selectedRowKeys:this.state.selectedNum,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({selectedNum:selectedRowKeys});
        this.setState({selectedRows:selectedRows})
      }
    };


    const newAdminFormColumns = [
      {dataIndex:_admD.name,option:this.getRequiredMessage(formatMessage({id:`admin_${_admD.name}`}))},
      {dataIndex:_admD.username,option:this.getRequiredMessage(formatMessage({id:`admin_${_admD.username}`}))},
      {dataIndex:_admD.password,option:this.getRequiredMessage(formatMessage({id:`admin_${_admD.password}`}))},
      {dataIndex:_admD.mobile,option:this.getRequiredMessage(formatMessage({id:`admin_${_admD.mobile}`}))},
      {dataIndex:_admD.email,option:this.getRequiredMessage(formatMessage({id:`admin_${_admD.email}`}))},
      {dataIndex:_admD.department,option:this.getRequiredMessage(formatMessage({id:`admin_${_admD.department}`}))},
      {dataIndex:_admD.roleIds,FormTag:
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
        <Title title={formatMessage({id:`${_tit.admin_setting}`})} />
        <TopSearch  {...searchProps} />
        <div style={{display:'flex',justifyContent:'flex-start',marginTop:'20px'}}>
          <Button onClick={this.handleAccount.bind(this,updateAdminStatus.stop,2,'Stop ')} style={{marginRight:'10px'}}>{formatMessage({id:'stopAdmin'})}</Button>
          <Button onClick={this.handleAccount.bind(this,updateAdminStatus.active,1,'Active ')} style={{marginRight:'10px'}}>{formatMessage({id:'active'})}</Button>
          <Button onClick={this.handleAccount.bind(this,updateAdminStatus.stop,0,'Delete ')} style={{marginRight:'10px'}}>{formatMessage({id:'delete'})}</Button>
          {this.state.selectedNum.length>0 &&
          <p style={{fontSize:16,lineHeight:'31px'}}>{formatMessage({id:"selected"})} <span style={{color:"#108ee9"}}>{this.state.selectedNum.length}</span> {formatMessage({id:"item"})}</p>}
        </div>
        <ImmutableTable
          loading={loading}
          rowSelection={Selection}
          style={{marginTop:20}}
          columns={columns}
          dataSource={adminSetting}
          pagination={{ pageSize: 13,total:adminSetting&&adminSetting.size}}
          onChange={this.changeTable}
        />
        <Modal
          visible={adminModal}
          onCancel={()=>this.setState({adminModal:false})}
          title={formatMessage({id:'newAdmin'})}
          onOk={this.handleAdminModal}
          maskClosable={false}
          width={700}
          okText="Save"
          cancelText="Cancel"
        >
          <Spin  spinning={this.state.adminLoad} tip="creating..." >
            <Row>
              <SimpleForm columns={newAdminFormColumns}  colSpan={24} labelCol={{span:5}} ref={f=>this.form=f} />
            </Row>
          </Spin>
        </Modal>
      </Row>
    )
  }
}

AdminSettingPage.propTypes = {
  pathJump : React.PropTypes.func,
};


const mapStateToProps = (state) => ({
  adminSetting : state.getIn(['adminSetting','adminSetting']),
});

export default injectIntl(connect(mapStateToProps)(AdminSettingPage))


//const WrappedSystemUser = Form.create()();


