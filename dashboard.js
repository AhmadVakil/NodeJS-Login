if (sessionStorage.getItem('user') === null) {
      window.location.href = "loggedOut.html";
} else {
    document.getElementById('username').innerHTML = sessionStorage.getItem('user');
    document.getElementById('logout').addEventListener('click', function(){
        sessionStorage.clear();
        window.location.href = "loggedOut.html";
    })
}