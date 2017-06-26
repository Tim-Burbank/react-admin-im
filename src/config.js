//bankend config

exports.rlsStatus = {
  'Active': 1,
  'Not approved': 0,
  'Waiting for review': 2,
  'Stop': 10,
  'Pending':3
};


exports.adminStatus = {
  'Stop':2,
  'Active':1,

}

exports.rec_position = {
  'Top Banner':'a1',
  'Second Top Banner':'a2',
  'Beauty Styles':'a3',
  'Spa':'a4',
  'Barber':'a5',
  'Best Sellers':'a6',
  'Recommend Craftsmans':'a7'
}

exports.transactionStatus = {
  'Refused': 0,
  'Complete transfer': 1,
  'Waiting for review': 2,
  others: 3,
  closed: 4,
  freezed: 5
};


exports.financeStatus = {
  Active:1,
  Stop:2
}

exports.transaction = {
  flag: {
    increase: 1,
    decrease: 2
  },
  type: {
    cash: 1,
    balance: 2,
    midtrans: 3,
    bank: 4,
    others: 5
  },
  status: {
    fail: 0,
    success: 1,
    handling: 2,
    others: 3,
    closed: 4,
    freezed: 5
  },
  name: {
    others: 0,
    topup: 1,
    withdraw: 2,
    purchase: 3,
    income: 4,
    commission: 5,
    refund: 6,
    cancel: 7,
    voucherSubsidy: 8
  }
};

exports.pushType = {
  admin: 0,
  customer: 1,
  supplier: 2,
  craftsman: 3,
};

exports.operation = {
  getlist: 1,
  get: 2,
  "new": 3,
  update: 4,
  "delete": 5
};

exports.voucherStatus = {
  '0':{
    id: 0,
    name_en: 'Not release'
  },
  '1':{
    id: 1,
    name_en: 'Released'
  },
  '2':{
    id: 2,
    name_en: 'Expired'
  },
  '3':{
    id: 3,
    name_en: 'Failure'
  },
}

exports.couponPayType = {
  '0':{
    id: '0',
    name_en: 'Online or Cash'
  },
  '1':{
    id: '1',
    name_en: 'Online Payment'
  },
  '2':{
    id: '2',
    name_en: 'Use Cash'
  },
}
exports.product_category = {
  beauty: {
    id: 'BEAUTY',
    name_en: 'BEAUTY'
  },
  spa: {
    id: 'SPA',
    name_en: 'SPA'
  },
  barber: {
    id: 'BARBER',
    name_en: 'BARBER'
  }
};

exports.product_subcategory = {
  1: {
    id: 1,
    name_en: 'NAIL',
    categoryId: 'BEAUTY'
  },
  2: {
    id: 2,
    name_en: 'HAIR',
    categoryId: 'BEAUTY'
  },
  3: {
    id: 3,
    name_en: 'FACE',
    categoryId: 'BEAUTY'
  },
  4: {
    id: 4,
    name_en: 'MAKE UP',
    categoryId: 'BEAUTY'
  },
  5: {
    id: 5,
    name_en: 'WAXING',
    categoryId: 'BEAUTY'
  },
  6: {
    id: 6,
    name_en: 'SPA',
    categoryId: 'SPA'
  },
  7: {
    id: 7,
    name_en: 'BARBER',
    categoryId: 'BARBER'
  }
};

exports.product_type = {
  1: {
    id: 1,
    name_en: 'Manicure',
    subcategoryId: 1
  },
  2: {
    id: 2,
    name_en: 'Pedicure',
    subcategoryId: 1
  },
  3: {
    id: 3,
    name_en: 'Nail Art',
    subcategoryId: 1
  },
  4: {
    id: 4,
    name_en: 'Meni+Pedi',
    subcategoryId: 1
  },
  5: {
    id: 5,
    name_en: 'TreatMent',
    subcategoryId: 1
  },
  6: {
    id: 6,
    name_en: 'Treatment',
    subcategoryId: 2
  },
  7: {
    id: 7,
    name_en: 'Syling',
    subcategoryId: 2
  },
  8: {
    id: 8,
    name_en: 'Color',
    subcategoryId: 2
  },
  9: {
    id: 9,
    name_en: 'Hijab',
    subcategoryId: 2
  },
  10: {
    id: 10,
    name_en: 'Cut',
    subcategoryId: 2
  },
  11: {
    id: 11,
    name_en: 'Up-do',
    subcategoryId: 2
  },
  12: {
    id: 12,
    name_en: 'Facial',
    subcategoryId: 3
  },
  13: {
    id: 13,
    name_en: 'Treatment',
    subcategoryId: 3
  },
  14: {
    id: 14,
    name_en: 'Eyebrow',
    subcategoryId: 3
  },
  15: {
    id: 15,
    name_en: 'Eyelash',
    subcategoryId: 3
  },
  16: {
    id: 16,
    name_en: 'Lips',
    subcategoryId: 3
  },
  17: {
    id: 17,
    name_en: 'Casual',
    subcategoryId: 4
  },
  18: {
    id: 18,
    name_en: 'Party',
    subcategoryId: 4
  },
  19: {
    id: 19,
    name_en: 'Bridal',
    subcategoryId: 4
  },
  20: {
    id: 20,
    name_en: 'Photoshoot',
    subcategoryId: 4
  },
  21: {
    id: 21,
    name_en: 'Hijabers',
    subcategoryId: 4
  },
  22: {
    id: 22,
    name_en: 'Haloween',
    subcategoryId: 4
  },
  23: {
    id: 23,
    name_en: 'Leg',
    subcategoryId: 5
  },
  24: {
    id: 24,
    name_en: 'Arm',
    subcategoryId: 5
  },
  25: {
    id: 25,
    name_en: 'Underarm',
    subcategoryId: 5
  },
  26: {
    id: 26,
    name_en: 'Bikini',
    subcategoryId: 5
  },
  27: {
    id: 27,
    name_en: 'Brazillian',
    subcategoryId: 5
  },
  28: {
    id: 28,
    name_en: 'Full-body massage',
    subcategoryId: 6
  },
  29: {
    id: 29,
    name_en: 'Light massage',
    subcategoryId: 6
  },
  30: {
    id: 30,
    name_en: 'Reflexiology',
    subcategoryId: 6
  },
  31: {
    id: 31,
    name_en: 'Sport Massage',
    subcategoryId: 6
  },
  32: {
    id: 32,
    name_en: 'Scrub Massage',
    subcategoryId: 6
  },
  33: {
    id: 33,
    name_en: 'Face Accupressure',
    subcategoryId: 6
  },
  34: {
    id: 34,
    name_en: 'Kerokan',
    subcategoryId: 6
  },
  35: {
    id: 35,
    name_en: 'Haircut',
    subcategoryId: 7
  },
  36: {
    id: 36,
    name_en: 'Shave',
    subcategoryId: 7
  },
  37: {
    id: 37,
    name_en: 'Hairstyle',
    subcategoryId: 7
  },
  38: {
    id: 38,
    name_en: 'Hair color',
    subcategoryId: 7
  },
  39: {
    id: 39,
    name_en: 'Boys cut',
    subcategoryId: 7
  },
  40: {
    id: 40,
    name_en: 'Hair styling',
    subcategoryId: 7
  }
};

exports.product_style = {
  1: {
    id: 1,
    name_en: 'Glamours',
    categoryId: 'BEAUTY'
  },
  2: {
    id: 2,
    name_en: 'Funky',
    categoryId: 'BEAUTY'
  },
  3: {
    id: 3,
    name_en: 'Party',
    categoryId: 'BEAUTY'
  },
  4: {
    id: 4,
    name_en: 'Nude',
    categoryId: 'BEAUTY'
  },
  5: {
    id: 5,
    name_en: 'Grunge',
    categoryId: 'BEAUTY'
  },
  6: {
    id: 6,
    name_en: 'Bridal',
    categoryId: 'BEAUTY'
  },
  7: {
    id: 7,
    name_en: 'Festival',
    categoryId: 'BEAUTY'
  },
  8: {
    id: 8,
    name_en: 'Summer',
    categoryId: 'BEAUTY'
  },
  9: {
    id: 9,
    name_en: 'Glowing',
    categoryId: 'BEAUTY'
  },
  10: {
    id: 10,
    name_en: 'Christmas',
    categoryId: 'BEAUTY'
  },
  11: {
    id: 11,
    name_en: 'Vintage',
    categoryId: 'BEAUTY'
  },
  12:{
    id:12,
    name_en:".Go's",
    categoryId:'BEAUTY'},
  13: {
    id: 13,
    name_en: 'Korean',
    categoryId: 'BEAUTY'
  },
  14: {
    id: 14,
    name_en: 'Natural',
    categoryId: 'BEAUTY'
  },
  15: {
    id: 15,
    name_en: 'Undercut',
    categoryId: 'BARBER'
  },
  16: {
    id: 16,
    name_en: 'Mowhawk',
    categoryId: 'BARBER'
  },
  17: {
    id: 17,
    name_en: 'Punk',
    categoryId: 'BARBER'
  },
  18: {
    id: 18,
    name_en: 'Shaved lines',
    categoryId: 'BARBER'
  },
  19: {
    id: 19,
    name_en: 'Edgy',
    categoryId: 'BARBER'
  }
};

exports.property = {
  1: 'COLOR',
  2: 'SUITABLE',
  3: 'BRAND',
  4: 'STEP',
  5: 'SECTION',
  6: 'POSITION',
  7: 'EFFECT',
  8: 'NOTE'
};

exports.orderStatus_type = {
  pending: 0 ,// 未开始
  service: 10, // 在服务
  completed: 20, // 已完成
  refunding: 30, // 已退款
  canceled: 40, // 已取消
  'wait to pay': 50,
};

exports.proStatus = {
  Unpublic: 0,
  Public: 1,
};

exports.payment = {
  cash: 1,
  balance: 2,
  midtrans: 3
};

exports.freezed ={
  Stop:2,
  Active:1
};

exports.feedbackReplyStatus = {
  'To be processed':0,
  complete:1
}

exports.host='/api';
exports.serverurl='/api';
exports.fetchState={
  success:'success'
};

exports.locale = {
  cn:'zh',
  en:'en'
};

exports.rootPath={
  supplier_management:'supplier_management',
  customer_management:'customer_management',
  craftsman_management:'craftsman_management',
  order_management:'order_management',
  product_management:'product_management',
  information_push:'information_push',
  feedback:'feedback',
  admin_setting:'admin_setting',
  coupons_management:'coupons_management',
  role:'role',
  withdraw:'withdraw',
  customer_finance:'customer_finance',
  supplier_finance:'supplier_finance',
  recommend_position:'recommend_position'

};

exports.childPath = {
  supplier_management:{
    supplierIndex:'index',
    supplierInfo:'supplierInfo'
  }
}

export const titles = {
  supplier_management:'supplier_management',
  customer_management:'customer_management',
  craftsman_management:'craftsman_management',
  order_management:'order_management',
  product_management:'product_management',
  information_push:'information_push',
  feedback:'feedback',
  adminstrator_management:'adminstrator_management',
  coupons:'coupons',
  recommend_position:'recommend_position',
  withdrawal:'withdrawal',
  customer_detail:'customer_detail',
  supplier_detail:'supplier_detail',
  new_supplier:'new_supplier',
  new_customer:'new_customer',
  craftsman_detail:'craftsman_detail',
  order_detail:'order_detail',
  product_detail:'product_detail',
  new_product:'new_product',
  new_craftsman:'new_craftsman',
  admin_setting:'admin_setting',
  coupons_management:'coupons_management',
  coupon_detail:'coupon_detail',
  role:'role',
  new_role:'new_role',
  role_detail:'role_detail',
  admin_detail:'admin_detail',
  withdraw:'withdraw',
  withdraw_detail:'withdraw_detail',
  customerFinance:'customerFinance',
  supplierFinance:'supplierFinance',
  financeDetail:'financeDetail',


};

export const searchFields = {
  createdAt_between:'createdAt_between',
  type:'type',
  keywords:'keywords',
  user_name:'user_name',
  account_status:'account_status',
  option:'option',
  freezed:'freezed',
  orderStatus_in:'orderStatus_in',
  startDt_gte:'startDt_gte',
  endDt_lte:'endDt_lte',
};

export const supplierType = [
  'All',
  'Business supplier',
  'Person supplier',

];

export const withdrawStatus = [
  'All',
  'Waiting for review',
  'Complete transfer',
  'Refused'
]



export const supplierStatus = [
  'All',
  'Active',
  'Stop',
  'Waiting for review',
  'Not approved'
];

export const orderStatus = [
  'pending',
  'service',
  'completed',
  'refunding',
  'canceled',
  'waitToPay'
];

export const productCate = [
  'All',
  'Barber',
  'Beauty',
  'Spa'
]


export const customerStatus = [
  'All',
  'Stop',
  'Active'
];


export const financeStatusArr = [
  'All',
  'Stop',
  'Active'
]

export const productStatus = [
  'All',
  'Unpublic',
  'Public'
];

export const productAdminStatus = [
  'All',
  'Stop',
  'Active'
];

export const couponsStatus = [
  'All',
  'Not release',
  'Released',
  'Expired',
  'Failure'
];

export const craftsmanStatus = [
  'All',
  'Stop',
  'Active',
  'Not through the audit',
  'To audit'
];

export const feedbackStatus = [
  'ALL',
  'To be processed',
  'complete'
]

export const  supplierTableFields = {
  sequence:'sequence',
  username:'username',
  phoneNumber:'phoneNumber',
  type:'type',
  createdAt:'createdAt',
  status:'status',
  operation:'operation',
  freezed:'freezed',
  supplierUsername:'supplierUsername',
  cra_username:'cra_username',
  rlsStatus:'rlsStatus',
  pushinfo:'pushinfo',
  categoryId:'categoryId'
}


export const orderTableFielsd = {
  craftsman:'craftsman',
  supplier:'supplier',
  customer:'customer',
  createdAt:'createdAt',
  startDt:'startDt',
  endDt:'endDt',
  orderStatus:'orderStatus',
  operation:'operation'
};

export const productTableFielsd = {
  name:'name',
  craftsman:'craftsman',
  supplier:'supplier',
  createdAt:'createdAt',
  updatedAt:'updatedAt',
  adminRls:'adminRls',
  operation:'operation',
  categoryId:'categoryId',
  category:'category',
  userRls:'userRls',
};

exports.supplierShowType = {
  0:'person',
  1:'business'
}

exports.customerFreezed ={
  2:'Stop',
  1:'Active'
}

exports.pro_status = {
  0:'Stop',
  1:'Active'
}

export const supplierDetails = {
  username:'username',
  password:'password',
  type:'type',
  createdAt:'createdAt',
  status:'status',
  name:'name',
  mobile:'mobile',
  identityCard:'identityCard',
  email:'email',
  skills:'skills',
  birthplace:'birthplace',
  gender:'gender',
  birthday:'birthday',
  address:'address',
  cardId:'cardId',
  education:'education',
  rlsStatus:'rlsStatus',
  shopName:'shopName'
}

export const customerDetails = {
  username: 'username',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  freezed: 'freezed',
  balance: 'balance',
  name: 'name',
  mobile: 'mobile',
  email: 'email',
  customer_addresses: 'customer_addresses',
  payment: 'payment',
  pressEnd: 'pressEnd',
  password: 'password',
  birthday: 'birthday',
  cardId: 'cardId',
  vaNumber: 'vaNumber',
  gender:'gender',
  status:'status',
  contact:'contact',
};

export const jpushTableFields = {
  username:'username',
  type:'type',
  createdAt:'createdAt',
  content:'content'
}




exports.gender_type = ['male','female']

exports.gender = {
  male:'male',
  female:'female'
}

exports.userRls = {
  Public:'Public',
  Unpublic:'Unpublic'
}

exports.freezed_type ={
  Stop:'Stop',
  Active:'Active'
}

exports.orderDetailTitle = {
  product_cra:'product_cra',
  cust_info:'cust_info'
}

export const orderDetails = {
  productName:'productName',
  orderStatus:'orderStatus',
  supplier:'supplier',
  craftsman:'craftsman',
  startDt:'startDt',
  endDt:'endDt',
  pressStart:'pressStart',
  originPrice:'originPrice',
  currentPrice:'currentPrice',
  craftsPhone:'craftsPhone',
};

export const productDetails = {
  id:'id',
  status:'status',
  name:'name',
  paymentMethod:'paymentMethod',
  originPrice:'originPrice',
  currentPrice:'currentPrice',
  url:'url',
  timeCost:'timeCost',
  duration:'duration',
  product_properties:'product_properties',
  description:'description',
  product_slide_pics:'product_slide_pics',
  categoryId:'categoryId',
  subcategoryId:'subcategoryId',
  typeId:'typeId',
  styleId:'styleId',
  color:'COLOR',
  suitable:'SUITABLE',
  brand:'BRAND',
  step:'STEP',
  section:'SECTION',
  position:'POSITION',
  effect:'EFFECT',
  note:'NOTE',
  product_styles:'product_styles',
  userRls:'userRls',
  adminRls:'adminRls',
  supplier:'supplier',
  craftsman:'craftsman'
}

export const craftsmanDetails = {
  totalFavorites:'totalFavorites',
  username:'username',
  supplierName:'supplierName',
  level:'level',
  name:'name',
  mobile:'mobile',
  cashCommission:'cashCommission',
  olCommission:'olCommission',
  rlsStatus:'rlsStatus',
  categoryId:'categoryId',
  createdAt:'createdAt',
  hometown:'hometown',
  craftsman_addresses:'craftsman_addresses',
  introduction:'introduction',
  craftsman_photos:'craftsman_photos',
  products:'products',
  portrait:'portrait',
  password:'password',
  workDays:'workDays',
  subcategoryId:'subcategoryId',
  hometown_en:'hometown_en',
  introduction_en:'introduction_en',

};
export const feedbackTableField = {
  username:'username',
  accountType:'accountType',
  createdAt:'createdAt',
  type:'type',
  status:'status',
  content:'content',
  title:'title',
  replied:'replied',
  mobile:'mobile',
  email:'email',
}


export const adminSettingTableField = {
  departmentId:'departmentId',
  username:'username',
  titleId:'titleId',
  roles:'roles',
  createdAt:'createdAt',
  operation:'operation',
  target:'target',
  status:'status'
}

export const couponsTableField = {
  name_en:'name_en',
  categoryIds:'categoryIds',
  expire:'expire',
  startDt:'startDt',
  endDt:'endDt',
  quantity:'quantity',
  operation:'operation',
  wblists:'wblists'
};

export const couponDetail = {
  name_en:'name_en',
  categoryIds:'categoryIds',
  expire:'expire',
  startDt:'startDt',
  endDt:'endDt',
  quantity:'quantity',
  description:'description',
  gtLimitation:'gtLimitation',
  ltLimitation:'ltLimitation',
  value:'value',
  subcategoryIds:'subcategoryIds',
  paymentType:'paymentType',
  supplierusername:'supplierusername',
  code:'code',
  used:'used',
  wblists:'wblists',
}

export const roleTableField = {
  name:'name',
  operation:'operation'
};

export const adminDetail = {
  username:'username',
  password:'password',
  mobile:'mobile',
  email:'email',
  name:'admin_name',
  department:'admin_department',
  roleIds:'roleIds',
  createdAt:'Create day',
  operation:'operation',
  roles:'roles',
};

export const withdrawTableField = {
  username:'username',
  createdAt:'createdAt',
  updatedAt:'updatedAt',
  transactionStatus:'transactionStatus',
  operation:'operation',
}

export const withdrawDetail = {
  id:'id',
  createdAt:'createdAt',
  username:'username',
  name:'name',
  cardId:'cardId',
  identityCard:'identityCard',
  withdrawBalance:'withdrawBalance',
  balance:'balance',
  wallerId:'wallerId',
  supplierInfo:'supplierInfo',
  withdrawInfo:'withdrawInfo',
  transactionStatus:'transactionStatus'
}

export const financeTableField = {
  username:'username',
  mobile:'mobile',
  createdAt:'createdAt',
  balance:'balance',
  status:'status',
  operation:'operation',
  capitalBalance:'capitalBalance',
  freezedBalance:'freezedBalance',
  wallet:'wallet'

}

export const financeInfoTableField = {
  createdAt:'createdAt',
  name:'name',
  amount:'amount',
  order:'order'
}

