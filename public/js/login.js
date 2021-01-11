var socket = io.connect('http://localhost:4000');
$(document).ready(function(){
  $("#loginButton").click(function(){
  console.log('clicked')
    socket.emit("login", {
      user: $("#userName").val(),
      pass: $("#Password").val()
    });
  });
});

socket.on("logged_in", function(user){
  console.log('connected')
  sessionStorage.setItem('user', user.user);
  sessionStorage.setItem('pPic', user.pPic)
  sessionStorage.setItem('userId', user.userId)
  document.getElementById('errorSpan').style.display = 'none'
  window.location.href = "dashboard.html";
});

socket.on("incorrectUserPass", function(){
  document.getElementById('errorSpan').style.display = 'block'
})
socket.on("invalid", function(){
  alert("Username / Password Invalid, Please try again!");
});

socket.on("error", function(){
  alert("Error: Please try again!");
});