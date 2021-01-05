var socket = io.connect('127.0.0.1:5001')
socket.on('username', function(data){
    console.log(data.username)
})
console.log("test")