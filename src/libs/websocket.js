
import setting from "@/setting"
import util from '@/libs/util.js'
import store from '@/store'
export default {
    connect: function () {

        var socket;
        if (typeof (WebSocket) == "undefined") {
          console.log("遗憾：您的浏览器不支持WebSocket");
        } else {
          console.log("恭喜：您的浏览器支持WebSocket");
    
          //实现化WebSocket对象  
          //指定要连接的服务器地址与端口建立连接   
          //注意ws、wss使用不同的端口。我使用自签名的证书测试，  
          //无法使用wss，浏览器打开WebSocket时报错  
          //ws对应http、wss对应https。  
          const token  = util.cookies.get("token")
          socket = new WebSocket(setting.websocketUrl+"/"+token);
          let interval
          //连接打开事件    
          socket.onopen = function () {
            console.log("Socket 已打开");

            interval = setInterval(() => {
              socket.send("ping");
            }, 60000);
          };
          //收到消息事件    
          socket.onmessage = function (msg) {
            store.dispatch("d2admin/message/add",JSON.parse(msg.data))
            console.log(msg.data);
          };
          //连接关闭事件    
          socket.onclose = function () {
            clearInterval(interval)
            console.log("Socket已关闭");
          };
          //发生了错误事件    
          socket.onerror = function () {
            clearInterval(interval)
            alert("Socket发生了错误");
          }
    
          //窗口关闭时，关闭连接  
          window.unload = function () {
            socket.close();
          };
        }
      }
}