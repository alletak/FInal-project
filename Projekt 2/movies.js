const gallery = document.getElementById("gallery");
const querySelect = document.getElementById("querySelect");

// 1) Funkce: zavolá API
async function fetchMovies(q) {
  const res = await fetch(
    `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(q)}`
  );
  if (!res.ok) throw new Error("API chyba");
  return await res.json();
}

// 2) Funkce: vykreslí filmy do stránky
function renderMovies(data) {
  gallery.innerHTML = "";

  data.slice(0, 12).forEach((item) => {
    const show = item.show;

    const card = document.createElement("div");
    card.className = "card";

    if (show.image && show.image.medium) {
      const img = document.createElement("img");
      img.src = show.image.medium;
      img.alt = show.name;
      card.appendChild(img);
    } else {
      const fb = document.createElement("div");
      fb.className = "card__fallback";
      fb.textContent = show.name;
      card.appendChild(fb);
    }

    gallery.appendChild(card);
  });
}

// 3) Funkce: načti a vykresli
async function loadMovies(q) {
  try {
    const data = await fetchMovies(q);
    renderMovies(data);
  } catch (e) {
    gallery.innerHTML =
      "<p style='opacity:.8; text-align:center;'>Nepodařilo se načíst filmy.</p>";
  }
}

// 4) Start: defaultně NIC nenačítej
gallery.innerHTML = ""; // prázdno

// 5) Teprve když user vybere možnost
querySelect.addEventListener("change", () => {
  const q = querySelect.value;

  // q bude třeba "girl" / "boy"...
  if (!q) return;

  // doplníme q do URL (aby to bylo podle zadání)
  const url = new URL(window.location.href);
  url.searchParams.set("q", q);
  window.history.pushState({}, "", url);

  loadMovies(q);
});
