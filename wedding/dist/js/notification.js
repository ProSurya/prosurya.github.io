// SAMPLE
(async () => {
    // create and show the notification
    const showNotification = () => {
        // create a new notification
        const notification = new Notification('JavaScript Notification API', {
            body: 'This is a JavaScript Notification API demo',
            icon: './img/js.png'
        });

        // close the notification after 10 seconds
        setTimeout(() => {
            notification.close();
        }, 10 * 1000);

        // navigate to a URL when clicked
        notification.addEventListener('click', () => {

            window.open('https://www.javascripttutorial.net/web-apis/javascript-notification/', '_blank');
        });
    }

    // show an error message
    const showError = () => {
        const error = document.querySelector('.error');
        error.style.display = 'block';
        error.textContent = 'You blocked the notifications';
    }

    // check notification permission
    let granted = false;

    if (Notification.permission === 'granted') {
        granted = true;
    } else if (Notification.permission !== 'denied') {
        let permission = await Notification.requestPermission();
        granted = permission === 'granted' ? true : false;
    }

    // show notification or error
    granted ? showNotification() : showError();

})();
// .SAMPLE



// NOTIFICATION BUTTON
document.getElementById('setAlarmButton').addEventListener('click', function() {
    // Tanggal target alarm (30 Desember 2023, pukul 00:00)
    const targetDate = new Date('2023-12-30T00:00:00');

    // Menghitung selisih waktu antara sekarang dan targetDate
    const timeUntilAlarm = targetDate - new Date();

    if (timeUntilAlarm > 0) {
        // Mengatur timeout untuk memicu notifikasi dan getaran pada waktu yang ditentukan
        setTimeout(function() {
            // Mengecek apakah API Notifikasi tidak tersedia di perangkat
            if (!("Notification" in window)) {
                alert("Web Notifications tidak didukung di perangkat ini.");
                return;
            }
            
            // Mengecek apakah API Notifikasi tersedia di perangkat
            if ('Notification' in window) {
                Notification.requestPermission().then(function(permission) {
                    if (permission === 'granted') {
                        new Notification('Pengingat Dibuat!', {
                            body: 'Pengingat Telah Dibuat!',
                            icon: 'alarm-icon.png'  // Ganti dengan URL ikon yang sesuai
                        });
                    }
                });
            }

            // Mengecek apakah API getaran tersedia di perangkat
            if ('vibrate' in navigator) {
                navigator.vibrate([1000, 500, 1000]);  // Menjalankan getaran selama 1 detik, istirahat 0.5 detik, dan getaran lagi selama 1 detik
            }
        }, timeUntilAlarm);
    } else {
        alert('Waktu pengingat sudah berlalu.');
    }
});
// .END NOTIFICATION BUTTON

