document.addEventListener("DOMContentLoaded", function () {

   // =========================
// 1. İLAN EKLEME
// =========================

const form = document.getElementById("ilanForm");

if (form) {

    form.addEventListener("submit", function(e){

        e.preventDefault();

        const baslik =
        document.getElementById("baslik").value;

        const aciklama =
        document.getElementById("aciklama").value;

        const fiyat =
        document.getElementById("fiyat").value;

        const kategori =
        document.getElementById("kategori").value;

        const user =
        localStorage.getItem("currentUser");

        if(!user){

            alert("Önce giriş yap!");
            return;
        }

        const resimInput =
        document.getElementById("resim");

        if(resimInput && resimInput.files[0]){

            const reader = new FileReader();

            reader.onload = function(e){

                kaydetIlan(
                    e.target.result
                );
            };

            reader.readAsDataURL(
                resimInput.files[0]
            );

        } else {

            kaydetIlan("");
        }

        function kaydetIlan(resim){

            const ilan = {

                id: Date.now(),
                baslik,
                aciklama,
                fiyat,
                kategori,
                userEmail:user,
                resim:resim

            };

            let ilanlar =
            JSON.parse(
                localStorage.getItem("ilanlar")
            ) || [];

            ilanlar.push(ilan);

            localStorage.setItem(
                "ilanlar",
                JSON.stringify(ilanlar)
            );

            alert("İlan eklendi!");

            form.reset();
        }

    });

}

    // =========================
    // 2. İLAN LİSTELEME
    // =========================
    const ilanListesi = document.getElementById("ilanListesi");

    if (ilanListesi) {

        let ilanlar = JSON.parse(localStorage.getItem("ilanlar")) || [];

        ilanListesi.innerHTML = "";

        ilanlar.forEach(ilan => {

            ilanListesi.innerHTML += `
                <div class="col-md-4 mb-4">
                    <div class="card shadow h-100">

                        <img src="${ilan.resim || 'https://picsum.photos/400/250'}" class="card-img-top">

                        <div class="card-body d-flex flex-column">

                            <h5>${ilan.baslik}</h5>
                            <p>${ilan.aciklama}</p>
                            <h4 class="text-primary">${ilan.fiyat} ₺</h4>

                            <a href="ilan-detay.html?id=${ilan.id}"
                               class="btn btn-dark mt-auto">
                               Detay Gör
                            </a>

                        </div>
                    </div>
                </div>
            `;
        });
    }

    // =========================
// ARAMA + FİLTRE
// =========================

const aramaInput =
document.getElementById("aramaInput");

const kategoriFiltre =
document.getElementById("kategoriFiltre");

if(aramaInput && kategoriFiltre){

    function filtrele(){

        let ilanlar =
        JSON.parse(
            localStorage.getItem("ilanlar")
        ) || [];

        const arama =
        aramaInput.value.toLowerCase();

        const kategori =
        kategoriFiltre.value;

        let filtreli =
        ilanlar.filter(ilan => {

            const baslikUygun =
            ilan.baslik
            .toLowerCase()
            .includes(arama);

            const kategoriUygun =

            kategori === "all" ||

            ilan.kategori === kategori;

            return baslikUygun &&
                   kategoriUygun;
        });

        ilanListesi.innerHTML="";

        filtreli.forEach(ilan=>{

            ilanListesi.innerHTML += `

            <div class="col-md-4 mb-4">

                <div class="card shadow h-100">

                    <img src="${ilan.resim || 'https://picsum.photos/400/250'}"
                         class="card-img-top">

                    <div class="card-body d-flex flex-column">

                        <h5>${ilan.baslik}</h5>

                        <p>${ilan.aciklama}</p>

                        <h4 class="text-primary">
                            ${ilan.fiyat} ₺
                        </h4>

                        <a href="ilan-detay.html?id=${ilan.id}"
                           class="btn btn-dark mt-auto">

                            Detay Gör

                        </a>

                    </div>

                </div>

            </div>

            `;
        });

    }

    aramaInput.addEventListener(
        "input",
        filtrele
    );

    kategoriFiltre.addEventListener(
        "change",
        filtrele
    );

}

    // =========================
    // 3. İLAN DETAY
    // =========================
    const detayDiv = document.getElementById("ilanDetay");

    if (detayDiv) {

        const id = Number(new URLSearchParams(window.location.search).get("id"));

        let ilanlar = JSON.parse(localStorage.getItem("ilanlar")) || [];

        const ilan = ilanlar.find(i => i.id === id);

        if (ilan) {

            detayDiv.innerHTML = `
                <div class="row">

                    <div class="col-md-6">
                        <img src="${ilan.resim || 'https://picsum.photos/400/250'}" class="card-img-top">
                    </div>

                    <div class="col-md-6">

                        <h2>${ilan.baslik}</h2>
                        <h3 class="text-primary">${ilan.fiyat} ₺</h3>
                        <p>${ilan.aciklama}</p>

                        <button class="btn btn-success w-100 mt-3"
                            onclick="mesajBaslat('${ilan.userEmail}', ${ilan.id})">
                            Satıcı ile İletişime Geç
                        </button>

                    </div>

                </div>
            `;
        }
    }

    // =========================
    // 4. PROFİL İLANLAR
    // =========================
    const profilIlanlar = document.getElementById("profilIlanlar");

    if (profilIlanlar) {

        const user = localStorage.getItem("currentUser");

        let ilanlar = JSON.parse(localStorage.getItem("ilanlar")) || [];

        let benimIlanlarim = ilanlar.filter(i => i.userEmail === user);

        profilIlanlar.innerHTML = "";

        if (benimIlanlarim.length === 0) {
            profilIlanlar.innerHTML = `<p>Henüz ilan yok</p>`;
        }

        benimIlanlarim.forEach(ilan => {

            profilIlanlar.innerHTML += `
                <div class="col-md-4 mb-3">
                    <div class="card shadow">

                        <div class="card-body">

                            <h5>${ilan.baslik}</h5>
                            <p>${ilan.aciklama}</p>
                            <h4 class="text-primary">${ilan.fiyat} ₺</h4>

                            <button class="btn btn-danger w-100"
                                    onclick="ilanSil(${ilan.id})">
                                İlanı Sil
                            </button>

                        </div>

                    </div>
                </div>
            `;
        });
    }

    // =========================
    // CHAT LOAD
    // =========================
    mesajlariGoster();
});


// =========================
// 5. İLAN SİL
// =========================
function ilanSil(id) {

    let ilanlar = JSON.parse(localStorage.getItem("ilanlar")) || [];

    ilanlar = ilanlar.filter(i => i.id !== id);

    localStorage.setItem("ilanlar", JSON.stringify(ilanlar));

    location.reload();
}


// =========================
// 6. ADMIN İLAN SİL
// =========================
function adminIlanSil(id) {

    let ilanlar = JSON.parse(localStorage.getItem("ilanlar")) || [];

    ilanlar = ilanlar.filter(i => i.id !== id);

    localStorage.setItem("ilanlar", JSON.stringify(ilanlar));

    location.reload();
}


// =========================
// 7. LOGIN
// =========================
function girisYap() {

    const email = document.getElementById("email").value;
    const sifre = document.getElementById("sifre").value;

    if (!email || !sifre) {
        alert("Tüm alanları doldur!");
        return;
    }

    localStorage.setItem("currentUser", email);

    if (email === "admin@kampus.com" && sifre === "1234") {

        localStorage.setItem("rol", "admin");
        window.location.href = "admin/panel.html";

    } else {

        localStorage.setItem("rol", "user");
        window.location.href = "index.html";
    }
}


// =========================
// 8. CHAT BAŞLAT
// =========================
function mesajBaslat(aliciEmail, ilanId) {

    const user = localStorage.getItem("currentUser");

    if (!user) {
        alert("Önce giriş yap!");
        return;
    }

    const sohbetId = [user, aliciEmail, ilanId].sort().join("_");

    localStorage.setItem("sohbetId", sohbetId);
    localStorage.setItem("sohbetAlici", aliciEmail);
    localStorage.setItem("aktifIlan", ilanId);

    window.location.href = "tiletisim.html";
}


// =========================
// 9. MESAJ GÖNDER
// =========================
function mesajGonder() {

    const gonderen = localStorage.getItem("currentUser");
    const mesaj = document.getElementById("mesaj").value;

    const sohbetId = localStorage.getItem("sohbetId");

    if (!mesaj || !sohbetId) return;

    let mesajlar = JSON.parse(localStorage.getItem("mesajlar")) || [];

    mesajlar.push({
    id: Date.now(),
    sohbetId,
    gonderen,
    mesaj,
    tarih: new Date().toLocaleString(),

    
    alici: localStorage.getItem("sohbetAlici")
});
    localStorage.setItem("mesajlar", JSON.stringify(mesajlar));

    document.getElementById("mesaj").value = "";

    mesajlariGoster();
}


// =========================
// 10. MESAJ LİSTELE
// =========================
function mesajlariGoster() {

    const box = document.getElementById("mesajListesi");
    if (!box) return;

    const user = localStorage.getItem("currentUser");
    const sohbetId = localStorage.getItem("sohbetId");

    let mesajlar = JSON.parse(localStorage.getItem("mesajlar")) || [];

    let filtreli = mesajlar.filter(m => m.sohbetId === sohbetId);

    box.innerHTML = "";

    filtreli.forEach(m => {

        const isMe = m.gonderen === user;

        box.innerHTML += `
            <div style="text-align:${isMe ? "right" : "left"}; margin:8px;">
                <span style="
                    display:inline-block;
                    padding:10px;
                    border-radius:12px;
                    background:${isMe ? "#DCF8C6" : "#f1f1f1"};
                ">
                    ${m.mesaj}
                </span>
                <br>
                <small>${m.tarih}</small>
            </div>
        `;
    });

    box.scrollTop = box.scrollHeight;
}

function cikisYap() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("rol");
    localStorage.removeItem("sohbetId");
    localStorage.removeItem("sohbetAlici");

    window.location.href = "giris.html";
}

function sohbetleriListele() {

    const user = localStorage.getItem("currentUser");
    if (!user) return;

    let mesajlar = JSON.parse(localStorage.getItem("mesajlar")) || [];

    // bu kullanıcıya ait sohbetleri bul
    let sohbetler = new Set();

    mesajlar.forEach(m => {
        if (m.sohbetId.includes(user)) {
            sohbetler.add(m.sohbetId);
        }
    });

    const container = document.getElementById("sohbetListesi");
    if (!container) return;

    container.innerHTML = "";

    sohbetler.forEach(id => {

        let sonMesaj = mesajlar
            .filter(m => m.sohbetId === id)
            .slice(-1)[0];

        container.innerHTML += `
            <div class="card mb-2 p-2"
                 onclick="sohbetAc('${id}')"
                 style="cursor:pointer">

                <b>Söhbet</b>
                <p>${sonMesaj ? sonMesaj.mesaj : ""}</p>

            </div>
        `;
    });
}

function sohbetAc(id) {

    localStorage.setItem("sohbetId", id);

    window.location.href = "tiletisim.html";
}