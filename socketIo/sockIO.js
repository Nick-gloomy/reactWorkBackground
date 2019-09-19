
module.exports =function (server) {
    const io =require('socket.io')(server);

    //监视客户端与服务器的连接
    io.on('connection',function (socket) {
        console.log('连接成功');
      //绑定监听，接收前端消息
        socket.on('reactSend',function (data) {
            console.log('接收到：'+data.title);
            socket.emit('backgroundSend',{title:'abc'})
        });


    })

};
