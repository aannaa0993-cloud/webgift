let currentTheme = 'sakura';
let currentGiftType = 'box';

// EVENT LISTENER TEMA WARNA
document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentTheme = this.dataset.theme;
        document.body.className = 'theme-' + currentTheme;
    });
});

// EVENT LISTENER TIPE KADO
document.querySelectorAll('.gift-tile').forEach(tile => {
    tile.addEventListener('click', function() {
        document.querySelectorAll('.gift-tile').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        currentGiftType = this.dataset.type;
    });
});

// EKSTRAK YOUTUBE MUSIC ID
function getYouTubeId(url) {
    if (!url) return '';
    const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
    return (match && match[2].length === 11) ? match[2] : url;
}

// GENERATE LINK KADO (FORM SUBMIT)
document.getElementById('gift-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const data = {
        t: document.getElementById('toName').value.trim(),
        f: document.getElementById('fromName').value.trim(),
        th: currentTheme,
        gt: currentGiftType,
        m: document.getElementById('message').value.trim(),
        i: document.getElementById('imageUrl').value.trim(),
        y: getYouTubeId(document.getElementById('youtubeUrl').value.trim())
    };

    // Encode Data ke URL Hash (Base64)
    const jsonStr = JSON.stringify(data);
    const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
    const fullUrl = window.location.origin + window.location.pathname + '#gift=' + encoded;

    // Tampilkan di Modal Pop-up
    document.getElementById('generated-link').innerText = fullUrl;
    document.getElementById('modal-overlay').classList.add('active');
});

// TOMBOL COPY LINK
document.getElementById('btn-copy-link').addEventListener('click', function() {
    const link = document.getElementById('generated-link').innerText;
    navigator.clipboard.writeText(link).then(() => {
        alert('✨ Link kado berhasil disalin! Siap dikirimkan.');
        document.getElementById('modal-overlay').classList.remove('active');
    }).catch(() => {
        alert('Salin teks link di dalam kotak secara manual ya!');
    });
});

// TOMBOL BIKIN SENDIRI
document.getElementById('btn-recreate').addEventListener('click', function() {
    window.location.href = window.location.pathname;
});

// MEMBACA LINK SAAAT DIBUKA PENERIMA
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash;
    if (hash.startsWith('#gift=')) {
        try {
            const encoded = hash.replace('#gift=', '');
            const jsonStr = decodeURIComponent(escape(atob(encoded)));
            const data = JSON.parse(jsonStr);

            renderViewerScreen(data);
        } catch (err) {
            console.error('Error hash parsing:', err);
        }
    }
});

function renderViewerScreen(data) {
    document.body.className = 'theme-' + (data.th || 'sakura');
    document.getElementById('builder-screen').classList.add('hidden');
    document.getElementById('viewer-screen').classList.remove('hidden');

    const stage = document.getElementById('interactive-stage');
    stage.innerHTML = '';

    const iconMap = {
        box: '🎁',
        envelope: '✉️',
        cake: '🎂',
        balloon: '🎈'
    };

    const icon = iconMap[data.gt] || '🎁';
    stage.innerHTML = `<div class="stage-icon">${icon}</div><p style="margin-top:10px; font-weight:700; color:var(--primary);">Ketuk Untuk Membuka!</p>`;

    // Event Klik Buka Kado
    stage.onclick = function() {
        stage.style.display = 'none';
        document.getElementById('view-title').innerText = 'Pesan Spesial Untukmu ✨';
        document.getElementById('view-sub').style.display = 'none';

        // Tampilkan Isi Pesan
        document.getElementById('letter-to').innerText = `Dear ${data.t},`;
        document.getElementById('letter-text').innerText = data.m;
        document.getElementById('letter-from').innerText = `~ Dari: ${data.f}`;

        if (data.i) {
            document.getElementById('letter-img').src = data.i;
            document.getElementById('polaroid-frame').classList.remove('hidden');
        }

        document.getElementById('letter-card').classList.remove('hidden');
        document.getElementById('btn-recreate').classList.remove('hidden');

        // Efek Confetti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    };

    // Auto Play Audio YouTube
    if (data.y) {
        document.getElementById('yt-player').innerHTML = 
            `<iframe width="1" height="1" src="https://www.youtube.com/embed/${data.y}?autoplay=1&loop=1" frameborder="0" allow="autoplay"></iframe>`;
    }
}
