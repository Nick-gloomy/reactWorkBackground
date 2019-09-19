/*'
      包含n个操作集合数据的model的模块
 */
//引入mongoose
const mongoose =require('mongoose');
//连接指定数据库
mongoose.connect('mongodb//localhost:27017/reactWork',function (err,db) {
    if (err){
        console.log('完成mongodb失败'+err);
    }else {
        console.log('完成mongodb连接');
    }
});


//定义对应的定集合的Model并向外暴露

// 字义Schema（描述文档结构）
const userSchema = mongoose.Schema({
    username:{type:String,required:true},//用户名
    password:{type:String,required:true},//密码
    type:{type:String,required:true},//用户类型 ’dashen‘/’laoban‘
    header:{type:String},//头像
    post:{type:String},//职位
    info:{type:String},//个人或职位介绍
    company:{type:String},//公司名称
    salary:{type:String},//工资
});
//定义Model（与集合对应，可以操作集合）
const UserModel = mongoose.model('user',userSchema);



// 字义Schema（描述文档结构）
const chatSchema = mongoose.Schema({
    from:{type:String,required:true},//发送用户id
    to:{type:String,required:true},//接收用户id
    chat_id:{type:String,required:true},//from与to组成
    content:{type:String,required:true},//聊天内容
    read:{type:Boolean,default:false},//标记是否阅读 默认未读
    creat_time:{type:Number,required:true},//创建时间
});

//定义Model（与集合对应，可以操作集合）
const chatModel = mongoose.model('chat',chatSchema);





//暴露Model
//module.exports=xxx
//exports.xxx=value
exports.UserModel=UserModel;

exports.ChatModel=chatModel;
