function tampilkanTamu(data) {
  if (data && data.nama) {
    document.getElementById("namaCover").innerText = data.nama;
    document.getElementById("nama").innerText = data.nama;
    document.getElementById("nomorID").innerText = data.id;
    document.getElementById("qr").src = data.qr;
    console.log("DEBUG data.qr:", data.qr);
    console.log("Isi data.qr:", data.qr);
  } else {
    document.getElementById("nama").innerText = "Tamu tidak dikenal";
  }
}

(function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    document.getElementById("nama").innerText = "ID tidak ditemukan";
    return;
  }

  // Buat <script> JSONP
  const script = document.createElement("script");
  script.src = "https://script.google.com/macros/s/AKfycbxNDD9fRaS49GQck2ZiXdbo0_UrbqKW1rJJVyp9Vf-WWqltt_hBqLNDflQRlbjh4Vblww/exec?api=1&id="
    + encodeURIComponent(id) + "&callback=tampilkanTamu";
  document.body.appendChild(script);
})();

// Musik auto play sekali klik
window.addEventListener(
  "click",
  function () {
    const musik = document.getElementById("musik");
    if (musik) {
      musik.muted = false;
      musik.play();
    }
  },
  { once: true }
);

async function init() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const tamu = await getData(id);

  if (tamu) {
    // isi nama di cover + undangan
    document.getElementById("namaCover").innerText = tamu.nama;
    document.getElementById("nama").innerText = tamu.nama;
    document.getElementById("qr").src = tamu.qr;
  } else {
    document.getElementById("namaCover").innerText = "Tamu tidak dikenal";
    document.getElementById("nama").innerText = "Tamu tidak dikenal";
  }
}

// Saat awal load, kunci scroll
window.onload = function () {
  document.body.classList.add("no-scroll");
};

function bukaUndangan() {
  const cover = document.getElementById("cover"); // ambil elemen cover

  // tambahkan class animasi
  cover.classList.add("slide-up");

    // Mulai musik ketika tombol diklik
  const musik = document.getElementById("musik");
  musik.play().catch(err => {
    console.log("User interaction diperlukan untuk mulai musik:", err);
  });

  // tunggu animasi selesai, baru sembunyikan cover & tampilkan undangan
  cover.addEventListener("transitionend", function () {
    cover.style.display = "none";                   // sembunyikan cover
    document.querySelector(".undangan").style.display = "block"; // tampilkan undangan
    document.querySelector(".map-container").style.display = "block"; // tampilkan map

    // lepas lock scroll
    document.body.classList.remove("no-scroll");
    document.documentElement.classList.remove("no-scroll");
  }, { once: true }); // pastikan event hanya sekali
}

// play musik
const musik = document.getElementById("musik");
musik.play().catch(() => {
  musik.muted = false;
  musik.play();
});