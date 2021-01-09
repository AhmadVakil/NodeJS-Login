var socket = io.connect('http://localhost:4000');
$(document).ready(function(){
  $("#loginButton").click(function(){
  console.log('clicked')
    socket.emit("login_register", {
        user: $("#userName").val(),
        pass: $("#Password").val()
    });
  });
});

socket.on("logged_in", function(user){
  //$("#n_log_in").hide();
  //$("#log_in").html("Welcome back " + name + ", nice to see you again!");
  //$("#log_in").show();
  console.log('connected')
  sessionStorage.setItem('user', user.user);
  window.location.href = "dashboard.html";
});

socket.on("invalid", function(){
  alert("Username / Password Invalid, Please try again!");
});

socket.on("error", function(){
  alert("Error: Please try again!");
});