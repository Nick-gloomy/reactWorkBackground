/*
  测试使用mongoose操作MongoDB数据库
  1.连接数据库
    引入mongoose
    连接指定数据库（url只有数据库是变化的）
    获取连接对象
    绑定连接完成的监听（用来提示连接成功）
   2.得到对应特定集合的Model
    字义Schema（描述文档结构）
    定义Model（与集合对应，可以操作集合）
   3.动过Model或其他实例堆积和数据进行CRUD操作
     通过Model实例的save（）添加数据
     通过Model的find（）/findOne()查询多个或一个数据
     通过Model的findByIdAndUpdate（）更新某个数据
     通过Model的remove（）删除匹配的数据
 */

const md5 = require('blueimp-md5');//引入md5加密的函数

/*
   1.连接数据库
 */
// 引入mongoose
const mongoose =require('mongoose');
// 连接指定数据库（url只有数据库是变化的）
mongoose.connect('mongodb://localhost:27017/reactWork');
// 获取连接对象
const con = mongoose.connection;
// 绑定连接完成的监听（用来提示连接成功）
con.on ('connected',function () {
   //连接成功调用
   console.log('数据库连接成功')
});


/*
   2.得到对应特定集合的Model
 */
// 字义Schema（描述文档结构）
const  userSchema = mongoose.Schema({
    //指定文档的结构
    //属性名  属性值得类型   是否是必须的   默认值
    username:{type:String,required:true},//用户名
    password:{type:String,required:true},//密码
    type:{type:String,required:true},//用户类型 ’dashen‘/’laoban‘
    header:{type:String} //头像
});
// 定义Model（与集合对应，可以操作集合）
const UserModel = mongoose.model('user',userSchema);//第一个参数 集合名称 会自动加上s  users

/*
3.动过Model或其他实例堆积和数据进行CRUD操作
 */
// 通过Model实例的save（）添加数据
    function testSave() {
        //创建users的实例
     const userModel =  new UserModel(
            { username:'Bob',//用户名
                password:md5('87654321'),//密码
                    type:'laoban',//用户类型
            }
        );
        //调用save（）保存
        userModel.save(function (error,userDoc) {
            console.log(userDoc)
        })
    }
    //testSave();
// 通过Model的find（）/findOne()查询多个或一个数据
 function testFind() {
        //查询多个   得到的是数组
     UserModel.find(function (err,users) {
          console.log('多个'+users);
     });
     //查询一个     得到的是对象
     UserModel.findOne({_id:'5d5260ab703bed13dc54125f'},function (err,user) {
         console.log('一个'+user);
     });
 }
 testFind();
// 通过Model的findByIdAndUpdate（）更新某个数据
function testUpdate() {
    UserModel.findByIdAndUpdate({_id:'5d5263517ea1c611f879cd63'},
    {username:'Jake'},
    function (error,oldUser) {
        console.log( error,oldUser)
    })
}
//testUpdate();
// 通过Model的remove（）删除匹配的数据
function testRemove() {
     UserModel.remove({username:'Bob'},function (error,user) {
         console.log(error,user);
     })
}
//testRemove();
