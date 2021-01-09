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

socket.on("logged_in", function(user){
  //$("#n_log_in").hide();
  //$("#log_in").html("Welcome back " + name + ", nice to see you again!");
  //$("#log_in").show();
  console.log('connected')
  sessionStorage.setItem('user', user.user);
  window.location.href = "dashboard.html";
});