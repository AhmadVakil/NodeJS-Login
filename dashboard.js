var socket = io.connect('http://localhost:4000');

socket.emit('getDashboardInfo', {userId : sessionStorage.getItem('userId')});
socket.on('profilePictureChanged', function(data){
    document.getElementById("profilePicture").setAttribute('src', data.picture);
})

socket.on('dashboardInfo', function(data){
    document.getElementById('username').innerHTML = data.username;
    document.getElementById("profilePicture").setAttribute('src', data.picture);
})

if (sessionStorage.getItem('user') === null) {
      window.location.href = "loggedOut.html";
} else {
    document.getElementById('username').innerHTML = sessionStorage.getItem('user');
    document.getElementById("profilePicture").setAttribute('src', sessionStorage.getItem('pPic'));

    document.getElementById('logout').addEventListener('click', function(){
        sessionStorage.clear();
        window.location.href = "loggedOut.html";
    })
}

document.getElementById('changeProfilePic').addEventListener("click", function(){
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
    const file = document.getElementById("readURL").files[0];
    async function emitProfilePic() {
        var profilePic = await toBase64(file)
        var profilePicBase64 = {
            string : profilePic,
            userId : sessionStorage.getItem('userId')
        }
        socket.emit('changeProfilePic', profilePicBase64)
    }
    emitProfilePic()
})
