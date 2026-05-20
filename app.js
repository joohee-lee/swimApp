const STORAGE_KEY = 'swim_records';
const FAV_KEY = 'swim_favorites';

const form = document.getElementById('swim-form');
const recordsEl = document.getElementById('records');
const poolInput = document.getElementById('pool');
const favoritesEl = document.getElementById('favorites');

// 오늘 날짜 기본값
document.getElementById('date').valueAsDate = new Date();

function load() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function save(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function loadFavorites() {
  return JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
}

function saveFavorite(name) {
  const favs = loadFavorites();
  if (name && !favs.includes(name)) {
    favs.unshift(name);
    localStorage.setItem(FAV_KEY, JSON.stringify(favs.slice(0, 5)));
  }
  renderFavorites();
}

function renderFavorites() {
  const favs = loadFavorites();
  favoritesEl.innerHTML = favs.map(f =>
    `<button type="button" class="fav-btn" data-pool="${f}">${f}</button>`
  ).join('');
}

favoritesEl.addEventListener('click', e => {
  if (e.target.classList.contains('fav-btn')) {
    poolInput.value = e.target.dataset.pool;
  }
});

function getCheckedStrokes() {
  return [...document.querySelectorAll('.strokes input:checked')].map(el => el.value);
}

function resetStrokes() {
  document.querySelectorAll('.strokes input').forEach(el => el.checked = false);
}

function renderCards() {
  const records = load();
  if (!records.length) {
    recordsEl.innerHTML = '';
    return;
  }
  recordsEl.innerHTML = records.map((r, i) => `
    <div class="card">
      <button class="delete-btn" data-index="${i}">✕</button>
      <div class="card-header">
        <span class="card-date">${r.date}</span>
        <span class="card-pool">${r.pool || '—'}</span>
      </div>
      <div class="card-stats">
        <span>🏊 ${r.distance ? r.distance + 'm' : '—'}</span>
        <span>⏱ ${r.duration ? r.duration + '분' : '—'}</span>
      </div>
      ${r.strokes.length ? `<div class="card-strokes">${r.strokes.map(s => `<span class="stroke-tag">${s}</span>`).join('')}</div>` : ''}
      ${r.diary ? `<div class="card-diary">"${r.diary}"</div>` : ''}
    </div>
  `).join('');
}

recordsEl.addEventListener('click', e => {
  if (e.target.classList.contains('delete-btn')) {
    const records = load();
    records.splice(Number(e.target.dataset.index), 1);
    save(records);
    renderCards();
  }
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const record = {
    date: document.getElementById('date').value,
    pool: poolInput.value.trim(),
    distance: document.getElementById('distance').value,
    duration: document.getElementById('duration').value,
    strokes: getCheckedStrokes(),
    diary: document.getElementById('diary').value.trim(),
  };
  const records = load();
  records.unshift(record);
  save(records);
  saveFavorite(record.pool);
  resetStrokes();
  form.reset();
  document.getElementById('date').valueAsDate = new Date();
  renderCards();
});

renderFavorites();
renderCards();
