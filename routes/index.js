var express = require('express');
var router = express.Router();

const {UserModel,ChatModel} =require('../db/models');
const md5 = require('blueimp-md5');//引入md5加密的函数
const cookie =require('js-cookie')

const mongoose =require('mongoose')


const filter ={password:0};//过滤的指定属性



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//注册路由：用户注册
/*
  path为：/register
  请求方式为post
  接收username和password
  admin是已注册用户
  注册成功返回{code：0，data：{_id：'abc',username:'xxx',password:'123'}
  注册失败返回{code:1,msg:'用户已存在'}
 */
/*
  1.获取请求参数
  2.处理
  3.返回响应数据
 */
// router.post('/register',function (req,res) {
//     console.log('register()');
//     //1.获取请求参数
//      const {username,password}=req.body;
//    //2.处理
//       if(username==='admin'){
//         //注册失败
//         //返回失败数据
//         res.send({code:1,msg:'此用户存在'})
//       }else {
//         //注册会成功
//         //返回成功数据
//         res.send({code:0,data:{id:'abc',username:'xxx',password:'123'}})
//       }
// });

/*
   注册路由
 */
router.post('/register',function (req,res) {
  //读取请求参数
    const {username,password,type} = req.body;

    //处理
        //判断用户是否已经存在，   如果存在，返回错误信息  如果不存在，存入信息
           //查询（根据username）
                UserModel.findOne({username},function (error,user) {
                    if (user){ //存在用户，返回错误信息
                        res.send({code:1,msg:'存在此用户'})
                    } else {
                      const userModel= new UserModel({username,password:md5(password),type});
                        userModel.save(function (err,user) {
                            const data ={id:user._id,username,type};
                            res.send({code: 0,data});
                            //生成cookie（'userid',user._id）数据返回浏览器保存
                          //  res.cookie('userid',user._id,{maxAge:1000*60*60*24}) //maxAge cookie 数据存储时间  以毫秒为单位
                        })
                }
                })
    //返回响应数据
});


/*
   登录路由
 */

router.post('/login',function (req,res) {
     const {username,password}=req.body;
    //根据 username 和password 查询数据库users，如果没有返回提示错误信息，如果有返登录成功（user信息）
      UserModel.findOne({username,password:md5(password)},filter,function (err,user) {
          if(user){//登录成功
               res.cookie('userid',user._id,{maxAge:100*60*60*24});
               res.send({code:0,data:user})
          }else {
              res.send({code:1,msg:'用户名或密码不正确'})
          }
      })
});

router.post('/update',function (req,res) {
      const user= req.body;
      const _id =res.cookies.userid;

      if (!_id){
          res.send({code:1,msg:'请登录'})
      } else {
          UserModel.findByIdAndUpdate({_id:_id},user,function (err,oldUser) {
              if (!oldUser){
                  //清除cookie的id
                  res.clearCookie('userid');
                  //返回消息
                  res.send({code:1,msg:'请登录'})

              }else {
                  const {type,username,_id}= oldUser;
                 const data =Object.assign(user, {type,username,_id});
                  res.send({code:0,data})
              }
          })
      }
});

router.get('/user' ,function (req,res) {

    const userid=res.cookies.userid;
    if (!userid){
        return res.send('请登录')
    }
    UserModel.find({_id:userid},filter,function (err,user) {
        if (user){
            req.send({code:0,data:user});
        } else {
            req.send({code:1,msg:'请登录'})
        }
    })

});

router.get('/getList',function (req,res) {
    const {type} =req.query;

    UserModel.find({type},function (err,users) {
            res.send({code:0,users})
    })
});



//获取当前用户所有相关聊天信息列表
router.get('/messageList',function (req,res) {
     //由cookie获取
          //先获取cookie中的userid
     const userid = req.cookies.userid;
        //查询 所有user的相关信息
     UserModel.find({},function (err,user) {

         if (err){
             res.send({code:1,err})
         } else {
             // 用对象储存所有user 的name ，chooseLogo
             const userDocs ={};
               user.map(doc=>{
                   userDocs[doc._id]={username:doc.username,chooseLogo:doc.chooseLogo}
               });
               ChatModel.find({'$or':[{from:userid},{to:userid}]},filter,function (err,chatMessage) {
                    res.send({code:0,data:{userDocs,chatMessage}})
               })
         }
     })

});

//更改是否读取数目
router.post('/isRead',function (req,res) {
    const {from} = req.body;
    const to = req.cookies.userid;

    //更新表Chat中数据
    //每次默认只更新一次，需要multi才能更改多条

    ChatModel.update({from,to,read:false},{read:true},{multi:true},function (err,chatMessage) {
               res.send({code:0,data:chatMessage.nModified})//返回更新的数量 nModified
    })

});



router.get("/AA",function(req,res){

    mongoose.connect('mongodb://localhost:27017/reactWork',function (err,db) {

        if (err){
            res.send('错误')
        } else {
            res.send('数据库连接成功');}});


            const  userSchema = mongoose.Schema({
                username:{type:String,required:true},//用户名
                password:{type:String,required:true},//密码
                type:{type:String,required:true},//用户类型 ’dashen‘/’laoban‘
                header:{type:String},//头像
                post:{type:String},//职位
                info:{type:String},//个人或职位介绍
                company:{type:String},//公司名称
                salary:{type:String},//工资
            });
// 定义Model（与集合对应，可以操作集合）
    const UserModel = mongoose.model('user',userSchema);//第一个参数 集合名称 会自动加上s  users

    UserModel.find({},function (err,user) {
                if (err){
                    res.send(err)
                } else {
                    res.send( user);
                }
            }

    );







});


module.exports = router;
