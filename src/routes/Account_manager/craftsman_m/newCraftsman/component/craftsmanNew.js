/**
 * Created by Yurek on 2017/5/17.
 */
/**
 * Created by Yurek on 2017/5/11.
 */
import React from 'react'
import { injectIntl } from 'react-intl'
import { Menu,Checkbox ,Row , message , Spin ,Button ,Pagination,Form,Input,Col ,Radio,Upload,Icon,Modal,Select,Card } from  'antd'
import { connect } from 'react-redux'
import {ImmutableTable} from '../../../../../components/antd/Table'
import SimpleForm from '../../../../../components/antd/SimpleForm'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {Link} from 'react-router'
import Title from '../../../../../components/title/title'
import {titles as _tit,supplierType,supplierStatus,orderDetails as _ordD,product_category,product_subcategory,property,proStatus,supplierTableFields as _sup,product_type,product_style,supplierShowType,supplierDetails as _supd,gender,orderDetailTitle,orderStatus_type,customerDetails as _cusD,payment,productDetails as _proD,rlsStatus,host,userRls,craftsmanDetails as _craD} from '../../../../../config'
import Immutable from 'immutable'
import {formatDate,formatMoney,configDirectory,configDirectoryObject,formatAddress,configCate} from '../../../../../utils/formatData'
import { newCraftsman } from '../module/craftsmanNew'
import {fetchSupplier,updateSupplier} from '../../../../Account_manager/Supplier_m/module/supplierManagement'
import {getFormRequired} from '../../../../../utils/common'
import { pathJump } from '../../../../../utils/'
import { fetchCraftsmanInfo,changePassword } from '../../craftsmanInfo/modules/craftsmanInfo'
import './craftsmanNew.css'

const RadioGroup = Radio.Group;
const Option = Select.Option;
const Search = Input.Search;
const CheckboxGroup = Checkbox.Group;



class CraftsmanNewPage extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      previewImage:'',
      newPage:false,
      visible:false,
      formStep:[],
      loading : false,
      selectedNum:[],
      currentPage:1,
      load:false,
      craftsInfo:null,
      slideList:[],
      subcategory:null
    }
  }
  componentWillMount(){


  }

  searchSupplier=(v)=>{
    let _step = ['searchReady'];
    if(this.state.formStep.length == 0){
      this.setState({formStep:_step})
    }
    this.setState({load:true});
    const {dispatch,supplierAccount}=this.props;
    let json={
      'account.username':v
    };
    dispatch(fetchSupplier(json)).then((e)=>{
      if(e.error){
        message.error(e.error.message);
        this.setState({load:false})
      }else{
        this.setState({load:false})
      }
    });
  };

  getBase64=(img, callback)=> {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

  beforeUpload=(file)=> {
    const isJPG = file.type === 'image/jpeg'||file.type ==='image/png';
    if (!isJPG) {
      message.error('You can only upload JPG or PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  changeTable=(pagination, filters, sorter) => {
    console.log(pagination, filters, sorter)
    this.setState({currentPage:pagination.current})
  }



  getRequiredMessage=(e,type)=>{
    return getFormRequired(this.props.intl.formatMessage({id:'input_require'},{name:e}),type)
  }

  findName = (value,config) => {
    for(let v in config){
      if(value == config[v]['name_en']){
        return config[v]['id']
      }
    }
  }
  handleSlideChange = (file) =>{
    console.log(file)
    let fileArr = [];
    file.fileList.map(v=>{
      if(v.status=='done'){
        if(v.response){
          fileArr.push(v.response.Location)
        }else{
          fileArr.push(v.url)
        }
      }
    });
    this.setState({slideListArr:fileArr,slideList:file.fileList})
  };

  pickPhotoUrl = (arr) => {
    let _arr=[];
    arr.map(v=>{
      _arr.push(v.url)
    })
    return _arr
  }
  findProperty=(v)=>{
    let _prop = []
    for(let p in v){
      if(p.substring(0,6) == 'steps-'){
        let _a={}
        _a['propertyId'] = 4;
        _a['order'] = p.substring(6,7)
        _a['content_en'] = v[p];
        _prop.push(_a)
      }
      for(let z in property){
        if(p == property[z]){
          let _a={}
          _a['propertyId'] = z;
          _a['content_en'] = v[p];
          _prop.push(_a)
        }
      }
    }
    return _prop
  }
  handleNew=()=>{
    const {dispatch,params,intl:{formatMessage}} = this.props;
    this.form.validateFields((err, values) => {
      if (!err) {
        //if(!this.form.isFieldsTouched()){return this.setState({visible:false})}//没有任何改动
        console.log('receive form value',values)
        this.setState({load:true})
        let _lifePhoto = [];
        values['craftsman_photos'].fileList.map(v=>{
          _lifePhoto.push(v.response.Location)
        })
        values = {
          ...values,
          name_en:values['name'],
          supplierId:this.state.craftsInfo.id,
          rlsStatus:configDirectory(values['rlsStatus'],rlsStatus),
          type:3,
          portrait:values['portrait'].file.response.Location,
          workDays:values['workDays'].join(','),
          email:values['username'],
          craftsman_photos:_lifePhoto
        }
        console.log('value',values)
        dispatch(fetchCraftsmanInfo('','post',values)).then(e=>{
          console.log(e)
          if(e.error){
            message.error(e.error.message)
            this.setState({load:false})
          }else{
            this.setState({load:false})
            message.success(formatMessage({id:'save_ok'}))
            dispatch(pathJump({pathname:'/craftsman_management',query:{'craftsmanUsername':values.username}}))
          }
        })

      }
    });
  }

  findId=(value,config)=>{
    for(let v in config){
      if(value == config[v]['categoryId']){
        return config[v]['id']
      }
    }
  };
  handlePortraitChange= (info) => {
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl => this.setState({ imageUrl }));
    }
  }

  render(){
    const {intl:{formatMessage},orderInfo,location:{pathname},params,supplierAccount} = this.props;
    const {previewVisible ,previewImage,newPage,visible,formStep ,loading,selectedNum,currentPage,craftsInfo,slideList,subcategory} = this.state

    const formColumns = [
      {dataIndex:_proD.supplier,FormTag:
        <Search
          placeholder="search supplier"
          style={{ width: 200 }}
          onSearch={this.searchSupplier}
        />},
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`productDetail_${item.dataIndex}`})
      })
    );
    const workDays = [
      { label: 'Monday', value: '1' },
      { label: 'Tuesday', value: '2' },
      { label: 'Wednesday', value: '3' },
      { label: 'Thursday', value: '4' },
      { label: 'Friday', value: '5' },
      { label: 'Saturday', value: '6' },
      { label: 'Sunday', value: '0' },
    ];


    const renderCategory=(cate)=>{
      let _arr = []
      for(let v in cate){
        _arr.push(cate[v])
      }
      return _arr.map((v,i)=>(
        <Option key={i} value={v.id}>{v.name_en}</Option>
      ))
    }



    const detailFormColumns = [
      {dataIndex:_craD.portrait,
        FormTag:
          <Upload
            className="avatar-uploader"
            showUploadList={false}
            action={`${host}/upload`}
            beforeUpload={this.beforeUpload}
            onChange={this.handlePortraitChange}
            name='fileUpload'
          >
            {
              this.state.imageUrl ?
                <img src={this.state.imageUrl} alt="" className="avatar" /> :
                <Icon type="plus" className="avatar-uploader-trigger" />
            }
          </Upload>},
      {dataIndex:_craD.rlsStatus,
        option:this.getRequiredMessage(formatMessage({id:'rlsStatus'})),
        FormTag:<RadioGroup>
          {Object.keys(rlsStatus).map(type=><Radio  key={type} value={type}>{formatMessage({id:type})}</Radio>)}
        </RadioGroup>},
      {dataIndex:_craD.name,option:this.getRequiredMessage(formatMessage({id:'name'})),placeholder:"Product description"},
      {dataIndex:_craD.categoryId,FormTag:
        <Select   placeholder="Please select">
          {renderCategory(product_category)}
        </Select>
      },
      {dataIndex:_craD.username,option:this.getRequiredMessage(formatMessage({id:'username'}))},
      {dataIndex:_craD.mobile,option:this.getRequiredMessage(formatMessage({id:'mobile'}))},
      {dataIndex:_craD.password,option:this.getRequiredMessage(formatMessage({id:'password'}))

      },
      {dataIndex:_craD.hometown_en,option:this.getRequiredMessage(formatMessage({id:'hometown'}))},
      {dataIndex:_craD.workDays,
        FormTag:<CheckboxGroup options={workDays}  />},
      {dataIndex:_craD.introduction_en,option:this.getRequiredMessage(formatMessage({id:'introduction'})),
        FormTag:
        <Input type="textarea" placeholder="Product description" autosize={{ minRows: 2}} />
      },
      {dataIndex:_craD.cashCommission,option:this.getRequiredMessage(formatMessage({id:'cashCommission'}))},
      {dataIndex:_craD.olCommission,option:this.getRequiredMessage(formatMessage({id:'olCommission'}))},
      {dataIndex:_craD.craftsman_photos,
        FormTag:
          <Upload
            listType="picture-card"
            action={`${host}/upload`}
            beforeUpload={this.beforeUpload}
            onPreview={this.handlePreview}
            onChange={this.handleSlideChange}
            name='fileUpload'
          >
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">Upload</div>
            </div>
          </Upload>},
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:item.dataIndex}),
        props:{placeholder:formatMessage({id:item.dataIndex})}
      })
    );





    const Selection = {
      type:'radio',
      selectedRowKeys:this.state.selectedNum,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        let _form;

        if (this.state.formStep.length > 1) {

        } else {
          _form = this.state.formStep.concat(selectedRowKeys)
          this.setState({formStep: _form})
        }
        let craftsInfo = []
        let _Data = supplierAccount.toJS()
        let _selectedNum = selectedRowKeys
        let _page = currentPage;
        if (_page == 1) {
          _selectedNum.map(z=> {
            craftsInfo.push(_Data[z])
          })
        } else {
          _selectedNum.map(z=> {
            console.log('page', z + (_page - 1) * 13)
            craftsInfo.push(_Data[z + (_page - 1) * 13])
          })
        }
        let _crafts =craftsInfo[0];
        if(_crafts.categoryId !=="BEAUTY"){
          _crafts.subcategoryId = _crafts.categoryId
        }else{
          _crafts.subcategoryId = ""
        }

        this.setState({selectedRows: selectedRows, selectedNum: selectedRowKeys,});
        this.setState({craftsInfo: _crafts,subcategory:this.findId(_crafts.subcategoryId,product_subcategory)})
      }
    };

    const columns = [
      {dataIndex:_sup.cra_username,render:(text,record)=>{
        return record.getIn(['account','username'])
      }},

      {dataIndex:_sup.phoneNumber,render:(text,record)=>{
        return record.getIn(['account','mobile'])
      }},
      {dataIndex:_sup.supplierUsername},
      {dataIndex:_sup.createdAt,render:date=>formatDate(date)},
      {dataIndex:_sup.rlsStatus,render:(text,record)=>{
        return configDirectoryObject(text,rlsStatus)
      }}
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`supplier_${item.dataIndex}`}),
      })
    )

    //const renderColumns=()=>{
    //  if(craftsInfo!=null&&craftsInfo.categoryId == 'beauty'){
    //    return beautyFormColumns
    //  }else if(craftsInfo!=null&&craftsInfo.categoryId == 'spa'){
    //    return spaFormColumns
    //  }else{
    //    return detailFormColumns
    //  }
    //};

    //const counterStep=()=>{
    //  if(craftsInfo!=null){
    //    let _p=supplierAccount.toJS();
    //    let conter=[]
    //    _p.product_properties.map((v,i)=>{
    //      if(v.property.name == 'step'){
    //        conter.push(v)
    //      }
    //    })
    //    return conter
    //  }
    //}

    return (
      <Row>
        <Title title={formatMessage({id:`${_tit.new_craftsman}`})} />
        <Row style={{marginTop:"30px"}}>
          <SimpleForm columns={formColumns} colSpan={24} labelCol={{span:2}} ref={f=>this.searchform=f} />
        </Row>
        <Spin spinning={this.state.load} tip="Searching...">
          {this.state.formStep.length!==0?<Row>
            {/*<Row style={{marginLeft:'10%'}}>{formatMessage({id:'selectCrafs'})}</Row>*/}
            <ImmutableTable
              loading={loading}
              rowSelection={Selection}
              style={{marginTop:20}}
              columns={columns}
              dataSource={supplierAccount}
              pagination={{ pageSize: 6,total:supplierAccount&&supplierAccount.size }}
              onChange={this.changeTable}
            />
          </Row>:null}
          <Row>
            {this.state.formStep.length==2?<SimpleForm columns={detailFormColumns}   colSpan={24} labelCol={{span:5}} ref={f=>this.form=f} />:null}
          </Row>
          {this.state.formStep.length==2?<Row type="flex" justify="center" style={{marginTop:"20px"}}>
            <Button onClick={this.handleNew}  type="primary" size="large">{formatMessage({id:'create_craftsman'})}</Button>
          </Row>:null}
        </Spin>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Row>
    )
  }
}





CraftsmanNewPage.propTypes = {
  pathJump : React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  craftsmanNew : state.getIn(['craftsmanNew','craftsmanNew']),
  supplierAccount : state.getIn(['supplierManagement','supplierAccount']),
});

export default injectIntl(connect(mapStateToProps)(CraftsmanNewPage))


