/**
 * Created by Yurek on 2017/5/17.
 */
/**
 * Created by Yurek on 2017/5/11.
 */
import React from 'react'
import { injectIntl } from 'react-intl'
import { Row , message , Spin ,Button ,Pagination,Form,Input,Col ,Radio,Upload,Icon,Modal,Select,Card } from  'antd'
import { connect } from 'react-redux'
import {ImmutableTable} from '../../../../components/antd/Table'
import SimpleForm from '../../../../components/antd/SimpleForm'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {Link} from 'react-router'
import Title from '../../../../components/title/title'
import {titles as _tit,supplierType,supplierStatus,orderDetails as _ordD,product_subcategory,property,proStatus,supplierTableFields as _sup,product_type,product_style,supplierShowType,supplierDetails as _supd,gender,orderDetailTitle,orderStatus_type,customerDetails as _cusD,payment,productDetails as _proD,rlsStatus,host,userRls} from '../../../../config'
import Immutable from 'immutable'
import {formatDate,formatMoney,configDirectory,configDirectoryObject,formatAddress,configCate} from '../../../../utils/formatData'
import { newProduct } from '../module/productNew'
import { fetchProductInfo, } from '../../productInfo/module/productInfo'
import {fetchCraftsman,updateCraftsman} from '../../../Account_manager/craftsman_m/module/craftsmanManagement'
import {getFormRequired} from '../../../../utils/common'
import { pathJump } from '../../../../utils/'

const RadioGroup = Radio.Group;
const Option = Select.Option;
const Search = Input.Search;



class ProductNewPage extends React.Component{
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
    const {dispatch,craftsmanAccount}=this.props;

    let json={
      supplierUsername:v
    };
    dispatch(fetchCraftsman(json)).then((e)=>{
      if(e.error){
        message.error(e.error.message);
        this.setState({load:false})
      }else{
        this.setState({load:false})
      }
    });
  };

  beforeUpload=(file)=> {
    const isJPG = file.type === 'image/jpeg'||file.type ==='image/png';
    if (!isJPG) {
      message.error('You can only upload JPG or PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error('Image must smaller than 5MB!');
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
          values = {
            product:{
              ...values,
              product_slide_pics:this.state.slideListArr&&this.state.slideListArr.join(',')||this.pickPhotoUrl(this.state.slideList).join(','),
              name_en:values['name'],
              subcategoryId:configCate(values['subcategoryId'],product_subcategory),
              typeId:this.findName(values['typeId'],product_type),
              styleId:this.findName(values['styleId'],product_style),
              product_properties:this.findProperty(values),
              craftsmanId:this.state.craftsInfo.id,
              supplierId:this.state.craftsInfo.supplierId,
              userRls:configDirectory(values['userRls'],proStatus),
            }
          }
        console.log('value',values)
          dispatch(fetchProductInfo('','post',values)).then(e=>{
            console.log(e)
            if(e.error){
              message.error(e.error.message)
              this.setState({load:false})
            }else{
              this.setState({load:false})
              message.success(formatMessage({id:'save_ok'}))
              dispatch(pathJump({pathname:'/product_management',query:{'craftsmanUsername':values.username}}))
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
  }

  render(){
    const {intl:{formatMessage},orderInfo,location:{pathname},params,craftsmanAccount} = this.props;
    const {previewVisible ,previewImage,newPage,visible,formStep ,loading,selectedNum,currentPage,craftsInfo,slideList,subcategory} = this.state
    console.log('craftsInfo',craftsInfo)

    const renderOption = (cate,config,key) =>{
      let _opt=[]
      for(let v in config){
        if(cate == config[v][key]){
          _opt.push(config[v])
        }
      }
      return _opt.map((v,i)=>(
        <Option key={i} value={v.id}>{v.name_en}</Option>
      ))
    };

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


    const detailFormColumns = [
      {dataIndex:_proD.product_slide_pics,
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
      {dataIndex:_proD.userRls,
        option:this.getRequiredMessage(formatMessage({id:`productDetail_${_proD.userRls}`})),
        FormTag:<RadioGroup>
        {Object.keys(userRls).map(type=><Radio  key={type} value={type}>{formatMessage({id:`product_${type}`})}</Radio>)}
      </RadioGroup>},
      {dataIndex:_proD.name,option:this.getRequiredMessage(formatMessage({id:`productDetail_${_proD.option}`}))},
      {dataIndex:_proD.categoryId,props:{disabled:true}},
      {dataIndex:_proD.typeId,FormTag:
        <Select  disabled={craftsInfo!=null&&craftsInfo.categoryId == 'SPA'} placeholder="Please select">
          {renderOption(subcategory!=null&&subcategory,product_type,'subcategoryId')}
        </Select>},
      {dataIndex:_proD.styleId,FormTag:
        <Select mode="multiple" placeholder="Please select" >
          {renderOption(craftsInfo!=null&&craftsInfo.categoryId,product_style,'categoryId')}
        </Select>},
      {dataIndex:_proD.originPrice,option:this.getRequiredMessage(formatMessage({id:`productDetail_${_proD.originPrice}`}))},
      {dataIndex:_proD.currentPrice,option:this.getRequiredMessage(formatMessage({id:`productDetail_${_proD.currentPrice}`}))},
      {dataIndex:_proD.description,option:this.getRequiredMessage(formatMessage({id:`productDetail_${_proD.description}`}))
        ,FormTag:
          <Input type="textarea" placeholder="Product description" autosize={{ minRows: 2}} />
      },
      {dataIndex:_proD.timeCost,option:this.getRequiredMessage(formatMessage({id:`productDetail_${_proD.timeCost}`}))},
      {dataIndex:_proD.duration,option:this.getRequiredMessage(formatMessage({id:`productDetail_${_proD.duration}`}))},
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`productDetail_${item.dataIndex}`})
      })
    );

    const beautyFormColumns = [
      {dataIndex:_proD.product_slide_pics,
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
      {dataIndex:_proD.userRls,
        option:this.getRequiredMessage(formatMessage({id:`productDetail_${_proD.userRls}`})),
        FormTag:<RadioGroup>
          {Object.keys(userRls).map(type=><Radio  key={type} value={type}>{formatMessage({id:`product_${type}`})}</Radio>)}
        </RadioGroup>},
      {dataIndex:_proD.name,option:this.getRequiredMessage(formatMessage({id:`productDetail_${_proD.option}`}))},
      {dataIndex:_proD.categoryId,props:{disabled:true}},
      {dataIndex:_proD.subcategoryId,FormTag:
        <Select onChange={(v)=>{this.setState({subcategory:v})}} disabled={craftsInfo!=null&&craftsInfo.categoryId!== 'BEAUTY'} placeholder="Please select">
          {renderOption(craftsInfo!=null&&craftsInfo.categoryId,product_subcategory,'categoryId')}
        </Select>
      },
      {dataIndex:_proD.typeId,FormTag:
        <Select  disabled={craftsInfo!=null&&craftsInfo.categoryId == 'SPA'} placeholder="Please select">
          {renderOption(subcategory!=null&&subcategory,product_type,'subcategoryId')}
        </Select>},
      {dataIndex:_proD.styleId,FormTag:
        <Select  placeholder="Please select" >
          {renderOption(craftsInfo!=null&&craftsInfo.categoryId,product_style,'categoryId')}
        </Select>},
      {dataIndex:_proD.originPrice,option:this.getRequiredMessage(formatMessage({id:`productDetail_${_proD.originPrice}`}))},
      {dataIndex:_proD.currentPrice,option:this.getRequiredMessage(formatMessage({id:`productDetail_${_proD.currentPrice}`}))},
      {dataIndex:_proD.description,option:this.getRequiredMessage(formatMessage({id:`productDetail_${_proD.description}`}))
        ,FormTag:
        <Input type="textarea" placeholder="Product description" autosize={{ minRows: 2}} />
      },
      {dataIndex:_proD.timeCost,option:this.getRequiredMessage(formatMessage({id:`productDetail_${_proD.timeCost}`}))},
      {dataIndex:_proD.duration,option:this.getRequiredMessage(formatMessage({id:`productDetail_${_proD.duration}`}))},
      {dataIndex:_proD.color},
      {dataIndex:_proD.brand},
      {dataIndex:_proD.section},
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`productDetail_${item.dataIndex}`})
      })
    );



    const spaFormColumns = [
      {dataIndex:_proD.product_slide_pics,
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
      {dataIndex:_proD.userRls,
        option:this.getRequiredMessage(formatMessage({id:`productDetail_${_proD.userRls}`})),
        FormTag:<RadioGroup>
          {Object.keys(userRls).map(type=><Radio  key={type} value={type}>{formatMessage({id:`product_${type}`})}</Radio>)}
        </RadioGroup>},
      {dataIndex:_proD.name,option:this.getRequiredMessage(formatMessage({id:`productDetail_${_proD.option}`}))},
      {dataIndex:_proD.categoryId,props:{disabled:true}},
      {dataIndex:_proD.typeId,FormTag:
        <Select  placeholder="Please select">
          {renderOption(subcategory!=null&&subcategory,product_type,'subcategoryId')}
        </Select>},
      {dataIndex:_proD.originPrice,option:this.getRequiredMessage(formatMessage({id:`productDetail_${_proD.originPrice}`}))},
      {dataIndex:_proD.currentPrice,option:this.getRequiredMessage(formatMessage({id:`productDetail_${_proD.currentPrice}`}))},
      {dataIndex:_proD.description,option:this.getRequiredMessage(formatMessage({id:`productDetail_${_proD.description}`}))
        ,FormTag:
        <Input type="textarea" placeholder="Product description" autosize={{ minRows: 2}} />
      },
      {dataIndex:_proD.timeCost,option:this.getRequiredMessage(formatMessage({id:`productDetail_${_proD.timeCost}`}))},
      {dataIndex:_proD.duration,option:this.getRequiredMessage(formatMessage({id:`productDetail_${_proD.duration}`}))},
      {dataIndex:_proD.suitable},
      {dataIndex:_proD.position},
      {dataIndex:_proD.effect},
      {dataIndex:_proD.note},
      {dataIndex:_proD.step,show:'step'},
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`productDetail_${item.dataIndex}`})
      })
    );

    const controlForm = () => {
      let _form
      _form={
        ...detailFormColumns
        }

      return _form
    }


    const Selection = {
      type:'radio',
      selectedRowKeys:this.state.selectedNum,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);

        let _form;

        if (this.state.formStep.length > 1) {
          this.form.resetFields()
        } else {
          _form = this.state.formStep.concat(selectedRowKeys)
          this.setState({formStep: _form})
        }
        let craftsInfo = []
        let _Data = craftsmanAccount.toJS()
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

    const renderColumns=()=>{
      if(craftsInfo!=null&&craftsInfo.categoryId == 'BEAUTY'){
        return beautyFormColumns
      }else if(craftsInfo!=null&&craftsInfo.categoryId == 'SPA'){
        return spaFormColumns
      }else{
        return detailFormColumns
      }
    };

    //const counterStep=()=>{
    //  if(craftsInfo!=null){
    //    let _p=craftsmanAccount.toJS();
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
        <Title title={formatMessage({id:`${_tit.new_product}`})} />
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
              dataSource={craftsmanAccount}
              pagination={{ pageSize: 6,total:craftsmanAccount&&craftsmanAccount.size }}
              onChange={this.changeTable}
            />
          </Row>:null}
          <Row>
            {this.state.formStep.length==2?<SimpleForm columns={renderColumns()} initial={Immutable.fromJS(this.state.craftsInfo)} stepArr={[]} colSpan={24} labelCol={{span:5}} ref={f=>this.form=f} />:null}
          </Row>
          {this.state.formStep.length==2?<Row type="flex" justify="center" style={{marginTop:"20px"}}>
            <Button onClick={this.handleNew}  type="primary" size="large">{formatMessage({id:'create_product'})}</Button>
          </Row>:null}
        </Spin>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Row>
    )
  }
}





ProductNewPage.propTypes = {
  pathJump : React.PropTypes.func,
};

const mapStateToProps = (state) => ({
  productNew : state.getIn(['productNew','productNew']),
  craftsmanAccount : state.getIn(['craftsmanManagement','craftsmanAccount']),
});

export default injectIntl(connect(mapStateToProps)(ProductNewPage))


