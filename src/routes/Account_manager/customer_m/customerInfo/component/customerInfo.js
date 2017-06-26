
import React from 'react'
import { injectIntl } from 'react-intl'
import { Row , message , Spin ,Button ,Pagination,Form,Input,Col ,Radio,Upload,Icon,Modal,Select,Popconfirm,DatePicker } from  'antd'
import QueueAnim from 'rc-queue-anim'
import {TweenOneGroup} from 'rc-tween-one'
import { connect } from 'react-redux'
import {ImmutableTable} from '../../../../../components/antd/Table'
import SimpleForm from '../../../../../components/antd/SimpleForm'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {Link} from 'react-router'
import Title from '../../../../../components/title/title'
import {province,regencies,districts} from '../../../../../address_config'
import {titles as _tit,supplierType,supplierStatus,supplierTableFields as _sup,customerFreezed,customerDetails as _cusd,gender,freezed_type} from '../../../../../config'
import Immutable from 'immutable'
import {formatDate,formatMoney,configDirectory,formatAddress} from '../../../../../utils/formatData'
import { fetchCustomerInfo,newCustAddress,modifyCustAddress,delCustAddress } from '../modules/customerInfo'
import {fetchCustomer,updateCustomer} from '../../module/customerManagement'
import {getFormRequired} from '../../../../../utils/common'
import { pathJump } from '../../../../../utils/'
const RadioGroup = Radio.Group;
const Option = Select.Option;



class CustomerInfoPage extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      previewImage:'',
      newPage:false,
      visible:false,
      addressModal:false,
      load:false,
      modalLoad:false,
      detail:null,
      province:null,
      regencies:null,
      districts:null,
      addressLoad:false,
      newAddress:false,
      addressArr:[],
      addressId:null,
      delModal:false
    }
  }
  componentWillMount(){
    const {dispatch,params} = this.props;
    if(params.id =='new'){
      this.setState({newPage:true})
    }else{
      this.setState({load:true});
      dispatch(fetchCustomerInfo(params.id,'get')).then((e)=>{
        console.log('willmount',e)
        if(e.error){
          this.setState({load:false})
          message.error(e.error.message);
        }else{
          this.setState({load:false})
        }
      });
    }

  }




  handleSave=()=>{

    const {dispatch,params,intl:{formatMessage},customerInfo} = this.props;
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
          values = {
            ...values,
            type:1,
            freezed:values.freezed=='Stop'?0:1,
            gender:values.gender=='male'?0:1,
          }
        this.setState({modalLoad:true})
        if(this.state.newPage){
          this.setState({load:true});
          dispatch(fetchCustomerInfo('','post',values)).then(e=>{
            console.log(e)
            if(e.error){
              message.error(e.error.message)
              this.setState({load:false});
            }else{
              this.setState({load:false});

              message.success(formatMessage({id:'save_ok'}))
              dispatch(pathJump({pathname:'/customer_management',query:{'account.username':values.username}}))

            }

          })
        }else{
          this.setState({modalLoad:true})
          dispatch(fetchCustomerInfo(params.id,'put',values)).then(e=>{
            console.log(e)
            if(e.error){
              message.error(e.error.message)
              this.setState({modalLoad:false})

            }else{
              this.setState({modalLoad:false})
              this.setState({visible:false})
              this.setState({load:true});
              dispatch(fetchCustomerInfo(params.id,'get')).then(e=>{
                console.log(e)
                if(e.error){
                  message.error(e.error.message)
                  this.setState({load:false})

                }else{
                  this.setState({load:false})
                  message.success(formatMessage({id:'modify_ok'}))
                }
              })

            }
          })
        }
      }
    });
  }
  modify=()=>{
    this.setState({visible:true})
  };

  newAddress=()=>{
    this.setState({addressModal:true,newAddress:true})
  };

  addressSave=()=>{
    const { dispatch,craftsmanInfo,params } = this.props;
    const { province,regencies,districts ,detail} = this.state

    if(this.state.newAddress){
      let json = {
        province:province,
        city:regencies,
        region:districts,
        detail:detail,
        dftFlag:0,
        customerId:params.id,
      }
      this.setState({addressLoad:true})
      dispatch(newCustAddress(json)).then(e=>{
        console.log('eee',e)
        if(e.error){
          message.error(e.error.message)
          this.setState({addressLoad:false});
        }else{
          message.success("Add address success")
          this.setState({addressLoad:false});
          this.setState({addressModal:false,province:null,regencies:null,districts:null,detail:null})
          this.setState({load:true})
          dispatch(fetchCustomerInfo(params.id,'get')).then((e)=>{
            if(e.error){
              this.setState({load:false})
              message.error(e.error.message);
            }else{
              this.setState({load:false})
            }
          });
        }
      })
    }else{
      console.log(this.state)
      let json = {
        province:province,
        city:regencies,
        region:districts,
        detail:detail,
        dftFlag:0
      }
      this.setState({addressLoad:true})
      dispatch(modifyCustAddress(this.state.addressId,json)).then(e=>{
        console.log('eee',e)
        if(e.error){
          message.error(e.error.message)
          this.setState({addressLoad:false});
          this.setState({addressModal:false,province:null,regencies:null,districts:null,addressId:null})
        }else{
          message.success("Modify address success")
          this.setState({addressLoad:false});
          this.setState({addressModal:false,province:null,regencies:null,districts:null,addressId:null})
          this.setState({load:true})
          dispatch(fetchCustomerInfo(params.id,'get')).then((e)=>{
            if(e.error){
              this.setState({load:false})
              message.error(e.error.message);
            }else{
              this.setState({load:false})
            }
          });
        }
      })
    }
  }
  handleAccount=(action,rls,tips,type)=>{
    this.setState({loading:true});
    const {dispatch,customerInfo,params} = this.props

    let json = {
      ids:customerInfo.get('id'),
      status:rls
    }
    this.setState({load:true})
    dispatch(action(json,params.id,type))
      .then(e=>{
      console.log('eee',e)
        if(e.error){
          message.error(e.error.message)
          this.setState({load:false});
        }else{
          message.success(tips+" account success")
          this.setState({load:false});
        }
    })

  }
  getRequiredMessage=(e,type)=>{
    return getFormRequired(this.props.intl.formatMessage({id:'input_require'},{name:e}),type)
  }

  onOk=()=>{
    this.setState({visible:false})
  }

  modifyAddress=()=>{
    this.setState({addressModal:true,newAddress:false})
  };

  delAdd=(v)=>{
    const {dispatch,params} = this.props;
    this.setState({load:true})
    dispatch(delCustAddress(v)).then(e=>{
      console.log('eee',e)
      if(e.error){
        message.error(e.error.message)
        this.setState({load:false});
      }else{
        dispatch(fetchCustomerInfo(params.id,'get')).then((e)=>{
          if(e.error){
            this.setState({load:false})
            message.error(e.error.message);
          }else{
            message.success("Delete address success")
            this.setState({load:false});
          }
        });
      }
    })
  }


  render(){
    const {intl:{formatMessage},customerInfo,location:{pathname},params} = this.props;
    const {visible,newPage ,addressModal} = this.state;
    console.log('stateee',this.state)
    const column = [
      {dataIndex:_cusd.username},
      {dataIndex:_cusd.createdAt},
      {dataIndex:_cusd.updatedAt},
      {dataIndex:_cusd.status,trans:configDirectory,config:customerFreezed,bold:true},
      {dataIndex:_cusd.balance},
      {dataIndex:_cusd.name},
      {dataIndex:_cusd.email},
      {dataIndex:_cusd.birthday},
      {dataIndex:_cusd.mobile},
    ];

    const formColumns = [
      {dataIndex:_cusd.name,option:this.getRequiredMessage(formatMessage({id:'name'}))},
      {dataIndex:_cusd.email,option:this.getRequiredMessage(formatMessage({id:'email'}))},
      {dataIndex:_cusd.mobile,option:this.getRequiredMessage(formatMessage({id:'mobile'}))},

    ].map(
      item=>({
        ...item,
        title:formatMessage({id:item.dataIndex})
      })
    );

    const newFormColumns = [
      {dataIndex:_cusd.username,option:this.getRequiredMessage(formatMessage({id:'username'}))},
      {dataIndex:_cusd.password,option:this.getRequiredMessage(formatMessage({id:'password'}))},
      {dataIndex:_cusd.name,option:this.getRequiredMessage(formatMessage({id:'name'}))},
      {dataIndex:_cusd.email,option:this.getRequiredMessage(formatMessage({id:'email'}))},
      {dataIndex:_cusd.mobile,option:this.getRequiredMessage(formatMessage({id:'mobile'}))},
      {dataIndex:_cusd.gender,option:this.getRequiredMessage(formatMessage({id:'gender'})),
        FormTag:<RadioGroup>
          {Object.keys(gender).map(type=><Radio  key={type} value={type}>{formatMessage({id:type})}</Radio>)}
        </RadioGroup>},
      {dataIndex:_cusd.birthday,FormTag:<DatePicker placeholder="Select month" format="YYYY-MM-DD"/>},
      {dataIndex:_cusd.cardId,option:this.getRequiredMessage(formatMessage({id:'cardId'}))},
      {dataIndex:_cusd.vaNumber},
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:item.dataIndex})
      })
    );


    const renderForm=(v,column)=>{
      console.log('column',v);
      if(v == 0){
        if(column.trans){
          return column.trans(v,column.config)
        }else{
          return 0
        }
      }
      if(v == undefined || v=='') return
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

    const renderAddress=(text,config,base)=>{
      let _code
      let _arr=[]
      base.map(z=>{
        if(text == z.Province_Name){
          _code = z.Province_Code
        }
      })
      console.log('_code',_code)
      config.map(v=>{
        if(_code == v.Province_Code){
          _arr.push(v.City_Name)
        }
      })
      console.log('_arr',_arr)
      return _arr.map((v,i)=>(
        <Option key={i} value={v}>{v}</Option>
      ))
    }

    const renderAddressB=(text,config,base)=>{
      let _code
      let _arr=[]
      base.map(z=>{
        if(text == z.City_Name){
          _code = z.City_Code
        }
      })
      console.log('_code',_code)
      config.map(v=>{
        if(_code == v.City_Code){
          _arr.push(v.District_Name)
        }
      })
      console.log('_arr',_arr)
      return _arr.map((v,i)=>(
        <Option key={i} value={v}>{v}</Option>
      ))
    }

    const addressColumns = [
      {dataIndex:'province'},
      {dataIndex:'city'},
      {dataIndex:'region'},
      {dataIndex:'detail'},
      {dataIndex:'operation',render:(text,$record)=>{
        return (
          <div>
            <a onClick={()=>{this.setState({
            province:$record.get('province'),
            regencies:$record.get('city'),
            districts:$record.get('region'),
            addressId:$record.get('id'),
            detail:$record.get('detail'),
            newAddress:false,
            addressModal:true})}}>{formatMessage({id:"edit"})}</a>
            <span> | </span>
            <Popconfirm title="Are you sure delete this address？" onConfirm={this.delAdd.bind(this,$record.get('id'))} okText="Yes" cancelText="No">
              <a href="#">{formatMessage({id:"delete"})}</a>
            </Popconfirm>
          </div>

        )
      }}
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`address_${item.dataIndex}`}),
      })
    );


    const columnMap=column=>{
      let text
      if(customerInfo){
        if(customerInfo.get(column.dataIndex) == 0){
          text = customerInfo.get(column.dataIndex)
        }else{
          text=customerInfo.get(column.dataIndex)||customerInfo.getIn(['account',column.dataIndex])||customerInfo.getIn(['account','wallet',column.dataIndex])
        }
      }else{
        text= ''
      }
      let bold = column.bold
      return (
        <Col key={column.dataIndex} span={column.span ||12} className='payment-item' style={{paddingLeft:'20%'}} >
          <span className="payment-label" style={{fontWeight:'bold'}}>{formatMessage({id:column.dataIndex})}</span>
          <span className="payment-value" style={bold&&{fontWeight:"bold"}}>{
            renderForm(text,column)
          }</span>
        </Col>
      )};



    const renderModifyAddress = () => {
      const _province = this.state.province
      const _regencies = this.state.regencies
      const _districts = this.state.districts
      const _detail = this.state.detail
      return (
        <Row style={{paddingLeft:59,paddingTop:12,paddingBottom:24}}>
          <Row>
            <p>{formatMessage({id:"province"})}</p>
          <Select
            showSearch
            style={{ width: 300 ,marginRight:15,marginBottom:20}}
            placeholder="Select province"
            optionFilterProp="children"
            defaultValue={_province}
            onChange={(value)=>{
                this.setState({province:value})
                }}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {province.map((v,i)=>(
              <Option key={v.Province_Name} value={v.Province_Name}>{v.Province_Name}</Option>
            ))}
          </Select>
            </Row>
          <Row>
            <p>{formatMessage({id:"city"})}</p>
          <Select
            showSearch
            style={{ width: 300 ,marginRight:15,marginBottom:20}}
            placeholder="Select regencies"
            optionFilterProp="children"
            defaultValue={_regencies}
            onChange={(value)=>{
                this.setState({regencies:value})
                }}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {renderAddress(_province,regencies,province)}
          </Select>
            </Row>
          <Row>
            <p>{formatMessage({id:"districts"})}</p>
          <Select
            showSearch
            style={{ width: 300 ,marginRight:15,marginBottom:20}}
            placeholder="Select districts"
            optionFilterProp="children"
            defaultValue={_districts}
            onChange={(value)=>{
                this.setState({districts:value})
                }}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {renderAddressB(_regencies,districts,regencies)}
          </Select>
            </Row>
          <Row>
            <p>{formatMessage({id:"street"})}</p>
          <Input  style={{width:300,}} value={_detail} onChange={(e)=>{
                this.setState({detail:e.target.value})
                }}/>
            </Row>
        </Row>
      )

    }
    return (
      <Row>
        <Title title={newPage?formatMessage({id:`${_tit.new_customer}`}):formatMessage({id:`${_tit.customer_detail}`})} />
        {!newPage&&<Row type="flex" justify="end" style={{marginTop:"20px",marginBottom:'20px'}}>
          <Button onClick={this.handleAccount.bind(this,updateCustomer.stop,2,'Stop ',2)}  style={{marginRight:'10px'}} type="danger" >{formatMessage({id:'stop'})}</Button>
          <Button onClick={this.handleAccount.bind(this,updateCustomer.active,1,'Active ',2)} style={{marginRight:'10px'}} >{formatMessage({id:'active'})}</Button>
        </Row>}
        <Spin spinning={this.state.load} tip="Loading...">
        {!newPage&&<Row className="payment-read">
          <Row>
            {column.map(columnMap)}
          </Row>
          <Row type="flex" justify="center" style={{marginTop:"50px",marginBottom:30}} >
            <Button onClick={this.modify} style={{marginRight:'10px'}} type="primary" size="large">{formatMessage({id:'modify'})}</Button>
          </Row>
          <p style={{paddingLeft:'5%',fontWeight:'bold'}}>{formatMessage({id:'customer_addresses'})} :</p>
          <ImmutableTable
            style={{marginTop:20,paddingLeft:'5%'}}
            columns={addressColumns}
            dataSource={customerInfo&&customerInfo.get('customer_addresses')}
          />
        </Row>}
        {newPage&&<Row style={{marginTop:25}} >
          <SimpleForm columns={newFormColumns} colSpan={12} labelCol={{span:5}} ref={f=>this.form=f} />
        </Row>}
        {!newPage &&<Row type="flex" justify="center">
          <Row style={{width:'80%',marginTop:'30px'}}>
            <Row gutter={120} >
              <Col span='8' style={{textAlign:'end'}}>
                <span style={{fontWeight:'bold'}}>{formatMessage({id:'order_tab'})}</span><span style={{display:'inline-block',marginLeft:'5px',marginRight:'5px'}}>{customerInfo&&customerInfo.get('totalOrders')}</span>
                {customerInfo&&customerInfo.get('totalOrders') !== 0?<Link to={{pathname:'/order_management',query:{'customer.account.username':customerInfo&&customerInfo.getIn(['account','username'])}}}>
                  {formatMessage({id:"view"})}
                </Link>:null}
              </Col>

              <Col span='8'>
                <span style={{fontWeight:'bold'}}>{formatMessage({id:'record_tab'})}</span><span style={{display:'inline-block',marginLeft:'5px',marginRight:'5px'}} />
                {customerInfo&&<Link to={{pathname:'/customer_finance/customerFinanceInfo/'+customerInfo.getIn(['account','id'])}}>
                  {formatMessage({id:"view"})}
                </Link>}
              </Col>
              <Col span='8' >
                <span style={{fontWeight:'bold'}}>{formatMessage({id:'coupons_tab'})}</span><span style={{display:'inline-block',marginLeft:'5px',marginRight:'5px'}}>{customerInfo&&customerInfo.get('totalCoupons')}</span>
                {customerInfo&&customerInfo.get('totalCoupons') !== 0?<Link to={{pathname:'/coupons_management',query:{'customer.account.username':customerInfo&&customerInfo.getIn(['account','username'])}}}>
                  {formatMessage({id:"view"})}
                </Link>:null}
              </Col>
            </Row>
          </Row>
        </Row>}
        {!newPage &&<Row type="flex" justify="center" style={{marginTop:"50px"}} >
          <Button onClick={this.newAddress}  type="primary" size="large">{formatMessage({id:'newAddress'})}</Button>
        </Row>}
        {newPage &&<Row type="flex" justify="center" style={{marginTop:"50px"}} >
          <Button onClick={this.handleSave} style={{marginRight:'10px'}} type="primary" size="large">{formatMessage({id:'save'})}</Button>
        </Row>}
          </Spin>
        <Modal
          title={formatMessage({id:'customer_edit'})}
          visible={visible}
          onCancel={()=>this.setState({visible:false})}
          maskClosable={false}
          onOk={this.handleSave}
          width={700}
          okText="Save"
          cancelText="Cancel"
        >
          {
            <Spin spinning={this.state.modalLoad} tip="Loading...">
              <Row>
                <SimpleForm columns={formColumns} initial={customerInfo} colSpan={24} labelCol={{span:5}} ref={f=>this.form=f} />
              </Row>
            </Spin>
              }
        </Modal>
        <Modal
          title={formatMessage({id:'customer_edit_address'})}
          visible={addressModal}
          onCancel={()=>this.setState({addressModal:false,province:null,regencies:null,districts:null,addressId:null,detail:null})}
          maskClosable={false}
          onOk={this.addressSave}
          width={450}
          okText="Save"
          cancelText="Cancel"
        >
          <Spin spinning={this.state.addressLoad} tip="Saving...">
            <div>

              {this.state.newAddress&&<Row style={{paddingLeft:59,paddingTop:12,paddingBottom:24}}>
                <Row>
                  <p>{formatMessage({id:"province"})}</p>
                <Select
                  showSearch
                  style={{ width: 300 ,marginRight:15,marginBottom:20}}
                  placeholder="Select province"
                  optionFilterProp="children"
                  value={this.state.province}
                  onChange={(value)=>{
                this.setState({province:value})
                }}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {province.map((v,i)=>(
                    <Option key={v.Province_Name} value={v.Province_Name}>{v.Province_Name}</Option>
                  ))}
                </Select>
                  </Row>
                {this.state.province!==null&&
                <Row>
                  <p>{formatMessage({id:"city"})}</p>
                  <Select
                  showSearch
                  style={{ width: 300 ,marginRight:15,marginBottom:20}}
                  placeholder="Select regencies"
                  optionFilterProp="children"
                  onChange={(value)=>{
                this.setState({regencies:value})
                }}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {renderAddress(this.state.province,regencies,province)}
                </Select>
                  </Row>}
                {this.state.province!==null&&this.state.regencies!==null&&
                <Row>
                  <p>{formatMessage({id:"districts"})}</p>
                  <Select
                  showSearch
                  style={{ width: 300 ,marginRight:15,marginBottom:20}}
                  placeholder="Select districts"
                  optionFilterProp="children"
                  onChange={(value)=>{
                this.setState({districts:value})
                }}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {renderAddressB(this.state.regencies,districts,regencies)}
                </Select>
                  </Row>}
                {this.state.province!==null&&this.state.regencies!==null&&this.state.districts!==null&&
                <Row>
                  <p>{formatMessage({id:"street"})}</p>
                  <Input  style={{width:300,marginTop:15}} onChange={(e)=>{
                  this.setState({detail:e.target.value})
                  }}/>
                </Row>}
              </Row>}
              {!this.state.newAddress&&renderModifyAddress()}
            </div>
          </Spin>
        </Modal>
      </Row>
    )
  }
}





CustomerInfoPage.propTypes = {
  pathJump : React.PropTypes.func,
};

export default injectIntl(CustomerInfoPage)


