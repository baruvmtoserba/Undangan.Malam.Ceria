async function getData(id) {
  // PUBLISH CSV, bukan pubhtml
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTFJg99ZcAEyEgy_mBaW1IItEUQoL1GCGCNvzk1t5bD-6CdP2Cvprc_7nDIPeVxXrbFWPtZO75agSsE/pub?gid=0&single=true&output=csv";

  const response = await fetch(url);
  const text = await response.text();
  console.log("RAW CSV:", text);  // cek mentahan
  const rows = text.split("\n").map(r => r.split(","));
  console.log("ROWS:", rows);     // cek hasil pecahan

  for (let i = 1; i < rows.length; i++) {
    let row = rows[i];
    console.log("ROW CEK:", row); // cek isi per baris
    if (row[0] === id) {
      return {
        nomorID: row[0],
        nama: row[1],
        qr: row[7]  // kolom H = link QR
      };
    }
  }
  return null;
}

(async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const tamu = await getData(id);

  if (tamu) {
    document.getElementById("nama").innerText = tamu.nama;
    document.getElementById("nomorID").innerText = tamu.nomorID;
    document.getElementById("qr").src = tamu.qr;
  } else {
    document.getElementById("nama").innerText = "Tamu tidak dikenal";
  }
})();

const music = document.getElementById("bg-music");
music.volume = 0.3; // volume 30%