function startlog(){
    var net1 = document.getElementById('username').value + document.getElementById('password').value;
    var net2 = ('admin') + ('123');
    if (net1 == net2) {
        // var logakses = document.getElementById('akses').innerHTML = 'Login Successfully';
        document.location='./app/home.html'
    }
    else {
        var logakses = document.getElementById('akses').innerHTML = 'Login Failed';
    }
};