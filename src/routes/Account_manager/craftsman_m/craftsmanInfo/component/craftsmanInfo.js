
import React from 'react'
import { injectIntl } from 'react-intl'
import { Row , message , Spin ,Button ,Pagination,Form,Input,Col ,Radio,Upload,Icon,Modal,Select,Tooltip,Popconfirm } from  'antd'
import { connect } from 'react-redux'
import {ImmutableTable} from '../../../../../components/antd/Table'
import SimpleForm from '../../../../../components/antd/SimpleForm'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {Link} from 'react-router'
import Title from '../../../../../components/title/title'
import {province,regencies,districts} from '../../../../../address_config'
import {titles as _tit,supplierType,supplierStatus,supplierTableFields as _sup,customerFreezed,customerDetails as _cusd,gender,freezed_type,craftsmanDetails as _craD,rlsStatus,host} from '../../../../../config'
import Immutable from 'immutable'
import {formatDate,formatMoney,configDirectory,configDirectoryObject,formatAddress,renderPic,renderPicAndTitle} from '../../../../../utils/formatData'
import { fetchCraftsmanInfo,changePassword,newCraAddress,modifyCraAddress,delCraAddress } from '../modules/craftsmanInfo'
import {fetchCraftsman,updateCraftsman} from '../../module/craftsmanManagement'
import {getFormRequired,} from '../../../../../utils/common'
import { pathJump } from '../../../../../utils/'
const RadioGroup = Radio.Group;
const Option = Select.Option;



class CraftsmanInfoPage extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      previewImage:'',
      newPage:false,
      visible:false,
      portraitList:[],
      addressModal:false,
      modalLoad:false,
      passModal:false,
      passLoad:null,
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
    this.setState({load:true});
    const {dispatch,params} = this.props;
    if(params.id =='new'){
      this.setState({newPage:true})
    }else{
      dispatch(fetchCraftsmanInfo(params.id,'get')).then((e)=>{
        if(e.error){
          this.setState({load:false})
          message.error(e.error.message);
        }else{
          let _Arr=[];
          _Arr.push({
            uid: e.payload.portrait,
            status: 'done',
            percent: 100,
            url: e.payload.portrait,
          });
          this.setState({load:false,portraitList:_Arr})
        }
      });
    }

  }

  handlePassModal = () => {
    const {fpassword,lpassword} = this.state
    const {dispatch,craftsmanInfo,intl:{formatMessage}} = this.props

    let json = {
      id:craftsmanInfo.get('id'),
      password:lpassword
    }
    if(fpassword === lpassword&&fpassword ){
      this.setState({passLoad:true})
      dispatch(changePassword(json)).then(e=>{
        if(e.payload){
          this.setState({passLoad:false})
          message.success(formatMessage({id:'changePasswordSuccess'}));
          this.setState({ passModal: false,fpassword:null,lpassword:null })
        }else{
          this.setState({passLoad:false,fpassword:null,lpassword:null})
          message.error(e.error.message)
        }
      })
    }else{
      message.error(formatMessage({id:'passwordFailed'}));
    }

  };

  changePassword=()=>{
    this.setState({passModal:'true'})
  }


  handleSave=()=>{
    this.setState({modalLoad:true});
    const {dispatch,params,intl:{formatMessage},craftsmanInfo} = this.props;
    this.form.validateFields((err, values) => {
      if (!err) {
        values = {
          ...values,
          type:1,
          freezed:values.freezed=='Stop'?0:1,
          gender:values.gender=='male'?0:1,
        }
        if(this.state.newPage){
          dispatch(fetchCraftsmanInfo('','post',values)).then(e=>{
            console.log(e)
            if(e.error){
              message.error(e.error.message)
              this.setState({modalLoad:false});
            }else{
              this.setState({modalLoad:false});
              message.success(formatMessage({id:'save_ok'}))
              dispatch(pathJump({pathname:'/craftsman_management',query:{'account.username':values.username}}))
            }
          })
        }else{
          values = {
            ...values,
            portrait:this.state.portrait
          }
          dispatch(fetchCraftsmanInfo(params.id,'put',values)).then(e=>{
            console.log(e)
            if(e.error){
              message.error(e.error.message)
              this.setState({modalLoad:false});
            }else{
              this.setState({modalLoad:false});
              this.setState({load:true});
              dispatch(fetchCraftsmanInfo(params.id,'get')).then(e=>{
                if(e.error){
                  message.error(e.error.message)
                }else{
                  this.setState({load:false});
                }
              })
              this.setState({visible:false})
              message.success(formatMessage({id:'modify_ok'}))
            }
          })
        }
      }
    });
  }
  modify=()=>{
    this.setState({visible:true})
  };

  getRequiredMessage=(e,type)=>{
    return getFormRequired(this.props.intl.formatMessage({id:'input_require'},{name:e}),type)
  }

  onOk=()=>{
    this.setState({visible:false})
  }

  newAddress=()=>{
    this.setState({addressModal:true,newAddress:true})
  };


  modifyAddress=()=>{
    this.setState({addressModal:true,newAddress:false})
  };

  changePass=(e)=>{
    console.log('password',e.target.value)
    this.setState({fpassword:e.target.value})
  }

  changePassAgain=(e)=>{
    console.log('lpassword',e.target.value)
    this.setState({lpassword:e.target.value})
  }


  addressSave=()=>{
    const { dispatch,craftsmanInfo,params } = this.props;
    const { province,regencies,districts } = this.state

    if(this.state.newAddress){
      let json = {
        province_en:province,
        city_en:regencies,
        region_en:districts,
        craftsmanId:craftsmanInfo.get('id'),
      }
      this.setState({addressLoad:true})
      dispatch(newCraAddress(json)).then(e=>{
        console.log('eee',e)
        if(e.error){
          message.error(e.error.message)
          this.setState({addressLoad:false});
          this.setState({addressModal:false,province:null,regencies:null,districts:null})
        }else{
          message.success("Add address success")
          this.setState({addressLoad:false});
          this.setState({addressModal:false,province:null,regencies:null,districts:null})
          this.setState({load:true})
          dispatch(fetchCraftsmanInfo(params.id,'get')).then((e)=>{
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
        province_en:province,
        city_en:regencies,
        region_en:districts,
      }
      this.setState({addressLoad:true})
      dispatch(modifyCraAddress(this.state.addressId,json)).then(e=>{
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
          dispatch(fetchCraftsmanInfo(params.id,'get')).then((e)=>{
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
    const {dispatch,craftsmanInfo,params} = this.props

    let json = {
      ids:craftsmanInfo.get('id'),
      rlsStatus:rls
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

  hangePassword=()=>{
    this.setState({passModal:'true'})
  }
  beforeUpload=(file)=> {
    const isJPG = file.type === 'image/jpeg'||file.type ==='image/png';
    if (!isJPG) {
      message.error('You can only upload JPG or PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024/1024 < 5;
    if (!isLt2M) {
      message.error('Image must smaller than 500k!');
    }
    return isJPG && isLt2M;
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  handlePortraitChange = (file) =>{
    console.log(file)
    file.fileList.map(v=>{
      if(v.status=='done'){
        if(v.response){
          this.setState({portrait:v.response.Location})
        }
      }
    });
    this.setState({portraitList:file.fileList})
  };

  delAdd=(v)=>{
    const {dispatch,params} = this.props;
    this.setState({load:true})
    dispatch(delCraAddress(v)).then(e=>{
      console.log('eee',e)
      if(e.error){
        message.error(e.error.message)
        this.setState({load:false});
      }else{
        dispatch(fetchCraftsmanInfo(params.id,'get')).then((e)=>{
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
    console.log('state111',this.state)
    const {intl:{formatMessage},craftsmanInfo,location:{pathname},params} = this.props;
    const {visible,newPage ,addressModal,portraitList,passModal,fpassword,lpassword} = this.state;
    const column = [
      {dataIndex:_craD.portrait,render:renderPic},
      {dataIndex:_craD.username,deep:['account','username']},
      {dataIndex:_craD.categoryId},
      {dataIndex:_craD.totalFavorites},
      {dataIndex:_craD.olCommission},
      {dataIndex:_craD.cashCommission},
      {dataIndex:_craD.createdAt},
      {dataIndex:_craD.rlsStatus,trans:configDirectoryObject,config:rlsStatus,infoStyle:{fontWeight:"bold"}},
      {dataIndex:_craD.supplierName,deep:['supplier','name']},
      {dataIndex:_craD.level},
      {dataIndex:_craD.name},
      {dataIndex:_craD.hometown,infoStyle:{display:'block',marginLeft:0}},
      {dataIndex:_craD.mobile,deep:['account','mobile']},
      {dataIndex:_craD.introduction,col:'24',style:{height:'200px'},infoStyle:{display:'block',border:'1px solid #ddd',height:'140px',paddingTop:5,paddingLeft:10,paddingRight:10,paddingBottom:5,marginTop:7,marginLeft:0}},
      {dataIndex:_craD.craftsman_photos,col:'24',render:renderPic},
      {dataIndex:_craD.products,col:'24',render:renderPicAndTitle},
    ];





    const formColumns = [
      {dataIndex:_craD.portrait,FormTag:
        <Upload
          listType="picture-card"
          action={`${host}/upload`}
          beforeUpload={this.beforeUpload}
          onPreview={this.handlePreview}
          onChange={this.handlePortraitChange}
          fileList={portraitList}
          name='fileUpload'
        >
          {portraitList.length >= 1 ? null:<div>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
          </div>}
        </Upload>},
      {dataIndex:_craD.name,option:this.getRequiredMessage(formatMessage({id:'name'}))},
      {dataIndex:_craD.olCommission,label:<span>OL Commission&nbsp;<Tooltip title="Online Commission">
          <Icon type="question-circle-o" />
        </Tooltip></span>},
      {dataIndex:_craD.cashCommission},
      {dataIndex:_craD.mobile},
      {dataIndex:_craD.hometown},
      {dataIndex:_craD.introduction},
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
      {dataIndex:_cusd.birthday,option:this.getRequiredMessage(formatMessage({id:'birthday'}))},
      {dataIndex:_cusd.cardId,option:this.getRequiredMessage(formatMessage({id:'cardId'}))},
      {dataIndex:_cusd.vaNumber},
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:item.dataIndex})
      })
    );


    const renderForm=(v,column)=>{
      console.log('column',v)
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
      }else if(column.render){
        return column.render(v,craftsmanInfo.getIn(['account','username']))
      }else{
        return v
      }

    }



    const columnMap=column=>{
      let text
      if(craftsmanInfo){
        if(craftsmanInfo.get(column.dataIndex) == 0){
          text = craftsmanInfo.get(column.dataIndex)
        }else{
          text=column.deep?craftsmanInfo.getIn(column.deep):craftsmanInfo.get(column.dataIndex)
        }
      }else{
        text= ''
      }

      return (
        <Col key={column.dataIndex} span={column.col ||24} className='payment-item' style={{marginBottom:10,paddingLeft:'5%',...column.style}} >
          <span className="payment-label" style={{fontWeight:'bold'}}>{formatMessage({id:column.dataIndex})}</span>
          <span className="payment-value" style={{marginLeft:14,...column.infoStyle}}>{
            renderForm(text,column)
          }</span>
        </Col>
      )};

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

    const addressColumns = [
      {dataIndex:'province'},
      {dataIndex:'city'},
      {dataIndex:'region'},
      {dataIndex:'operation',render:(text,$record)=>{
        return (
          <div>
            <a onClick={()=>{this.setState({
            province:$record.get('province'),
            regencies:$record.get('city'),
            districts:$record.get('region'),
            addressId:$record.get('id'),
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

    const renderModifyAddress = () => {
      const _province = this.state.province
      const _regencies = this.state.regencies
      const _districts = this.state.districts
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
            </Row>
          )
    }

    return (

      <Row>


        <Title title={formatMessage({id:`${_tit.craftsman_detail}`})} />
        <Row type="flex" justify="end" style={{marginTop:"20px",marginBottom:'20px'}}>
          <Button  onClick={this.changePassword} style={{marginRight:"10px"}} >{formatMessage({id:'changePassword'})}</Button>
          <Button onClick={this.handleAccount.bind(this,updateCraftsman.stop,10,'Stop ',2)} type="danger" style={{marginRight:'10px'}}>{formatMessage({id:'supplier_stopAc'})}</Button>
          <Button onClick={this.handleAccount.bind(this,updateCraftsman.active,1,'Active ',2)} style={{marginRight:'10px'}}>{formatMessage({id:'supplier_actAc'})}</Button>
          <Button onClick={this.handleAccount.bind(this,updateCraftsman.check,3,'Peeding ',2)} style={{marginRight:'10px'}}>{formatMessage({id:'supplier_peedAc'})}</Button>
          <Button onClick={this.handleAccount.bind(this,updateCraftsman.disapprove,0,'Disapprove ',2)} style={{marginRight:'10px'}}>{formatMessage({id:'supplier_notApp'})}</Button>
        </Row>
        <Spin spinning={this.state.load} tip="Loading...">
          {!newPage&&<Row className="payment-read">
            <Row>
              {column.map(columnMap)}
            </Row>
            <Row type="flex" justify="center" style={{marginTop:"50px",marginBottom:'30px'}} >
              <Button onClick={this.modify} style={{marginRight:'10px'}} type="primary" size="large">{formatMessage({id:'modify'})}</Button>
            </Row>
            <p style={{paddingLeft:'5%',fontWeight:'bold'}}>{formatMessage({id:'craftsman_addresses'})} :</p>
            <ImmutableTable
              style={{marginTop:20,paddingLeft:'5%'}}
              columns={addressColumns}
              dataSource={craftsmanInfo&&craftsmanInfo.get('craftsman_addresses')}
            />
          </Row>}
          {newPage&&<Row>
            <SimpleForm columns={newFormColumns} colSpan={12} labelCol={{span:5}} ref={f=>this.form=f} />
          </Row>}
          {!newPage &&<Row type="flex" justify="center">
            <Row style={{width:'80%',marginTop:'30px'}}>
              <Row gutter={120} >
                <Col span='24' style={{textAlign:'center'}}>
                  <span style={{fontWeight:'bold'}}>{formatMessage({id:'order_tab'})}</span><span style={{display:'inline-block',marginLeft:'5px',marginRight:'5px'}}>{craftsmanInfo&&craftsmanInfo.get('totalOrders')}</span>
                  {craftsmanInfo&&craftsmanInfo.get('totalOrders') !== 0?<Link to={{pathname:'/order_management',query:{'customer.account.username':craftsmanInfo&&craftsmanInfo.getIn(['account','username'])}}}>
                    {formatMessage({id:"view"})}
                  </Link>:<span>view</span>}
                </Col>
              </Row>
            </Row>
          </Row>}


          {!newPage &&<Row type="flex" justify="center" style={{marginTop:"50px"}} >

            <Button onClick={this.newAddress} style={{marginRight:'10px'}} type="primary" size="large">{formatMessage({id:'newAddress'})}</Button>
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
          width={750}
          okText="Save"
          cancelText="Cancel"
        >
          <Spin spinning={this.state.modalLoad} tip="Saving...">
            <Row>
              <SimpleForm columns={formColumns} initial={craftsmanInfo} colSpan={24} labelCol={{span:5}} ref={f=>this.form=f} />
            </Row>
          </Spin>
        </Modal>
        <Modal
          title={formatMessage({id:'customer_edit_address'})}
          visible={addressModal}
          onCancel={()=>this.setState({addressModal:false,province:null,regencies:null,districts:null,addressId:null})}
          maskClosable={false}
          onOk={this.addressSave}
          width={450}
          okText="Save"
          cancelText="Cancel"
        >


          <Spin spinning={this.state.addressLoad} tip="Saving...">
            <div >
              {this.state.newAddress&&<Row style={{paddingLeft:59,paddingTop:12,paddingBottom:24}}>
                <Row>
                <p>{formatMessage({id:"province"})}</p>
              <Select
                showSearch
                style={{ width: 300 ,marginRight:15,marginBottom:20}}
                placeholder="Select province"
                optionFilterProp="children"
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
                </Row>}
              {!this.state.newAddress&&renderModifyAddress()}
            </div>
          </Spin>
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





CraftsmanInfoPage.propTypes = {
  pathJump : React.PropTypes.func,
};

export default injectIntl(CraftsmanInfoPage)


