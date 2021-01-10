var socket = io.connect('http://localhost:4000');
$(document).ready(function(){
  $("#signupButton").click(function(){
  console.log('clicked')
    socket.emit("register", {
        user: $("#userName").val(),
        pass: $("#Password").val(),
        email: $("#Email").val()
    });
  });
});
socket.on('usernameInvalid', function(){
        document.getElementById('usernameInvalid').style.display = 'block'
        document.getElementById('accountCreated').style.display = 'none'
})

socket.on('accountCreated', function(){
        document.getElementById('usernameInvalid').style.display = 'none'
        document.getElementById('accountCreated').style.display = 'block'
})
