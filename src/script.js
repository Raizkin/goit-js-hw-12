const API_URL = "https://restcountries.com/v2";
const inputEl = document.querySelector("#input");
const boxEl = document.querySelector("#box");
let debounceId;

inputEl.addEventListener("input", (e) => {
  clearTimeout(debounceId);
  debounceId = setTimeout(() => searchCountries(e.target.value.trim()), 1000);
});

function searchCountries(query) {
  boxEl.innerHTML = '';
  if (!query) return boxEl.innerHTML = '<p class="empty-note">Введіть назву країни</p>';

  fetch(`${API_URL}/name/${query}`)
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data) || data.status === 404) {
        boxEl.innerHTML = '<p class="empty-note">Країну не знайдено</p>';
        return;
      }
      if (data.length > 10) {
        alert('Знайдено занадто багато країн, уточніть пошук!');
      } else if (data.length >= 2) {
        renderCountries(data);
      } else {
        renderCountry(data[0]);
      }
    })
    .catch(err => console.warn(err));
}

function renderCountries(countries) {
  boxEl.innerHTML = '';
  countries.forEach(c => {
    const div = document.createElement('div');
    div.className = 'country-item';
    div.innerHTML = `
      <img src="${c.flag}" alt="${c.name}">
      <div>
        <div class="country-name">${c.name}</div>
        <div class="country-meta">Столиця: ${c.capital || '—'}</div>
      </div>`;
    boxEl.appendChild(div);
  });
}

function renderCountry(c) {
  boxEl.innerHTML = `
    <div class="country-card">
      <div class="card-flag"><img src="${c.flag}" alt="${c.name}"></div>
      <div class="card-info">
        <h2>${c.name}</h2>
        <p><small>Столиця</small><br>${c.capital || '—'}</p>
        <p><small>Населення</small><br>${c.population.toLocaleString()}</p>
        <p><small>Мови</small><br>${c.languages.map(l => l.name).join(', ')}</p>
      </div>
    </div>`;
}
