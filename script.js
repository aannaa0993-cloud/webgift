let selectedGiftType = 'box';

// Event Listener untuk Pilihan Kado
document.querySelectorAll('.gift-card').forEach(card => {
    card.addEventListener('click', function() {
        document.querySelectorAll('.gift-card').forEach(el => el.classList.remove('selected'));
        this.classList.add('selected');
        selectedGiftType = this.dataset.type;
    });
});

// Ekstrak YouTube ID
function extractYTId(url) {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
}

// Generate Link Kado
document.getElementById('gift-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const data = {
        t: document.getElementById('toName').value.trim(),
        f: document.getElementById('fromName').value.trim(),
        gt: selectedGiftType,
        m: document.getElementById('message').value.trim(),
        i: document.getElementById('imageUrl').value.trim(),
        y: extractYTId(document.getElementById('youtubeUrl').value.trim())
    };

    // Encode JSON ke Base64 (Aman URL)
    const jsonStr = JSON.stringify(data);
    const encoded = btoa(unescape(encodeURIComponent(jsonStr)));

    // Buat URL Lengkap
    const finalUrl = window.location.origin + window.location.pathname + '#gift=' + encoded;

    // Tampilkan di Modal Pop-up
    document.getElementById('generated-link').innerText = finalUrl;
    document.getElementById('modal-overlay').classList.add('active');
});

// Tombol Copy Link
document.getElementById('btn-copy').addEventListener('click', function() {
    const linkText = document.getElementById('generated-link').innerText;
    navigator.clipboard.writeText(linkText).then(() => {
        alert('✨ Link berhasil disalin! Kirimkan ke WhatsApp atau DM.');
        document.getElementById('modal-overlay').classList.remove('active');
    }).catch(() => {
        alert('Salin teks link di dalam kotak secara manual ya!');
    });
});

// Tombol Bikin Sendiri
document.getElementById('btn-create-own').addEventListener('click', function() {
    window.location.href = window.location.pathname;
});

// Deteksi Pembacaan Link (Viewer Screen)
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash;
    if (hash.startsWith('#gift=')) {
        try {
            const encodedData = hash.replace('#gift=', '');
            const jsonStr = decodeURIComponent(escape(atob(encodedData)));
            const data = JSON.parse(jsonStr);

            renderGiftViewer(data);
        } catch (err) {
            console.error('Data Hash Error:', err);
        }
    }
});

function renderGiftViewer(data) {
    document.getElementById('builder-screen').classList.add('hidden');
    document.getElementById('viewer-screen').classList.remove('hidden');

    const area = document.getElementById('interactive-box');
    area.innerHTML = '';

    const iconMap = {
        box: '🎁',
        letter: '✉️',
        cake: '🎂',
        balloon: '🎈'
    };

    const icon = iconMap[data.gt] || '🎁';
    area.innerHTML = `<div class="gift-anim">${icon}</div><p style="margin-top:10px; font-weight:700; color:var(--primary);">Ketuk Untuk Membuka!</p>`;

    // Event Klik Buka Kado
    area.onclick = function() {
        area.style.display = 'none';
        document.getElementById('view-title').innerText = 'Pesan Untukmu ✨';
        document.getElementById('view-subtitle').style.display = 'none';

        // Tampilkan Isi
        document.getElementById('letter-to').innerText = `Dear ${data.t},`;
        document.getElementById('letter-text').innerText = data.m;
        document.getElementById('letter-from').innerText = `~ Dari: ${data.f}`;

        if (data.i) {
            const imgEl = document.getElementById('letter-img');
            imgEl.src = data.i;
            imgEl.classList.remove('hidden');
        }

        document.getElementById('letter-wrapper').classList.remove('hidden');
        document.getElementById('btn-create-own').classList.remove('hidden');

        // Efek Confetti
        confetti({
            particleCount: 90,
            spread: 65,
            origin: { y: 0.6 }
        });
    };

    // Auto Play YouTube Music
    if (data.y) {
        document.getElementById('yt-player').innerHTML = 
            `<iframe width="1" height="1" src="https://www.youtube.com/embed/${data.y}?autoplay=1&loop=1" frameborder="0" allow="autoplay"></iframe>`;
    }
}
