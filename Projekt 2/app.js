// Scroll-to-top (můžeš nechat jak máš)
const scrollBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollBtn.classList.add("show");
  } else {
    scrollBtn.classList.remove("show");
  }
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// ---------- FILMY NA INDEXU ----------
const findMoviesBtn = document.getElementById("findMoviesBtn");
const moviesControls = document.getElementById("moviesControls");
const querySelect = document.getElementById("querySelect");
const apiGallery = document.getElementById("apiGallery");

let isControlsVisible = false;

function clearApiGallery() {
  if (!apiGallery) return;
  apiGallery.innerHTML = "";
}

function makeCard(show) {
  const card = document.createElement("div");
  card.className = "card";

  if (show?.image?.medium) {
    const img = document.createElement("img");
    img.src = show.image.medium;
    img.alt = show.name || "Poster";
    card.appendChild(img);
  } else {
    const fallback = document.createElement("div");
    fallback.className = "card__fallback";
    fallback.textContent = show?.name ? show.name : "Bez obrázku";
    card.appendChild(fallback);
  }

  return card;
}

async function fetchShows(q) {
  const res = await fetch(
    `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(q)}`
  );
  if (!res.ok) throw new Error("API chyba");
  return await res.json();
}

async function renderFromApi(q) {
  if (!apiGallery) return;

  clearApiGallery();

  try {
    const data = await fetchShows(q);

    // vezmeme třeba prvních 12 výsledků (ať to vypadá dobře)
    data.slice(0, 12).forEach((item) => {
      apiGallery.appendChild(makeCard(item.show));
    });
  } catch (e) {
    const p = document.createElement("p");
    p.textContent = "Nepodařilo se načíst filmy z API.";
    p.style.opacity = "0.8";
    apiGallery.appendChild(p);
  }
}

// Klik na "Najít další filmy"
findMoviesBtn?.addEventListener("click", async () => {
  if (!moviesControls || !querySelect) return;

  // poprvé: jen odkryj roletku a hned načti default (girl)
  if (!isControlsVisible) {
    moviesControls.style.display = "block";
    isControlsVisible = true;

    const q = String(querySelect.value || "girl");
    await renderFromApi(q);
    return;
  }

  // když už jsou controls vidět, klik může znovu načíst (volitelné)
  await renderFromApi(String(querySelect.value || "girl"));
});

// Změna hodnoty v roletce → reload filmů
querySelect?.addEventListener("change", () => {
  const q = String(querySelect.value || "girl");
  renderFromApi(q);
});
