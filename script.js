function tampilkanTamu(data) {
  if (data && data.nama) {
    document.getElementById("namaCover").innerText = data.nama;
    document.getElementById("nama").innerText = data.nama;
    document.getElementById("nomorID").innerText = data.id;
    document.getElementById("qr").src = data.qr;

    // Simpan ke localStorage cache
    if (data.id) {
      try {
        localStorage.setItem("tamu_" + data.id, JSON.stringify(data));
      } catch (e) {
        console.warn("Cache gagal disimpan:", e);
      }
    }

    console.log("DEBUG data.qr:", data.qr);
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

  // --- cek cache dulu ---
  const cached = localStorage.getItem("tamu_" + id);
  if (cached) {
    try {
      const data = JSON.parse(cached);
      console.log("Load dari cache:", data);
      tampilkanTamu(data);
      return; // stop, gak usah fetch
    } catch (e) {
      console.warn("Cache corrupt, lanjut fetch:", e);
    }
  }

  // --- Hybrid: coba fetch JSON dulu ---
  const baseUrl = "https://script.google.com/macros/s/AKfycbxNDD9fRaS49GQck2ZiXdbo0_UrbqKW1rJJVyp9Vf-WWqltt_hBqLNDflQRlbjh4Vblww/exec?api=1&id="
                  + encodeURIComponent(id);

  fetch(baseUrl)
    .then(res => res.json())
    .then(data => tampilkanTamu(data))
    .catch(err => {
      console.warn("Fetch JSON gagal, fallback ke JSONP:", err);

      // fallback JSONP
      const script = document.createElement("script");
      script.src = baseUrl + "&callback=tampilkanTamu";
      document.body.appendChild(script);
    });
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

// Saat awal load, kunci scroll
window.onload = function () {
  document.body.classList.add("no-scroll");
};

function bukaUndangan() {
  const cover = document.getElementById("cover"); 

  cover.classList.add("slide-up");

  const musik = document.getElementById("musik");
  musik.play().catch(err => {
    console.log("User interaction diperlukan untuk mulai musik:", err);
  });

  cover.addEventListener("transitionend", function () {
    cover.style.display = "none";
    document.querySelector(".undangan").style.display = "block";
    document.querySelector(".map-container").style.display = "block";

    document.body.classList.remove("no-scroll");
    document.documentElement.classList.remove("no-scroll");
  }, { once: true });
}

// play musik awal (antisipasi autoplay error)
const musik = document.getElementById("musik");
musik.play().catch(() => {
  musik.muted = false;
  musik.play();
});