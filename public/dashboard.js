var socket = io.connect('127.0.0.1:3000')

socket.on('message', function(data){
    console.log("hello")
})
