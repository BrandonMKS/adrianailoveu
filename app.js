let wardrobe = {};
let selectedOutfit = {};
let currentCategory = 'sweaters';

// Fetch wardrobe data on load
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('clothes.json');
    wardrobe = await response.json();
    setupCategoryButtons();
    renderGrid(currentCategory);
  } catch (error) {
    console.error('Failed to load clothing data:', error);
  }
});

// Category Switcher
function setupCategoryButtons() {
  const buttons = document.querySelectorAll('.nav-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      buttons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentCategory = e.target.dataset.category;
      renderGrid(currentCategory);
    });
  });
}

// Render Photos for Selected Category
function renderGrid(category) {
  const grid = document.getElementById('clothing-grid');
  grid.innerHTML = '';

  const items = wardrobe[category] || [];

  if (items.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888;">No items added to ${category} yet.</p>`;
    return;
  }

  items.forEach(item => {
    const isSelected = selectedOutfit[category]?.id === item.id;
    const card = document.createElement('div');
    card.className = `card ${isSelected ? 'selected' : ''}`;

    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}" loading="lazy" />
      <div class="card-info">
        <h3>${item.name}</h3>
        <span>${item.tag || ''}</span>
      </div>
    `;

    card.addEventListener('click', () => toggleSelection(category, item));
    grid.appendChild(card);
  });
}

// Handle Selecting/Unselecting Items
function toggleSelection(category, item) {
  if (selectedOutfit[category]?.id === item.id) {
    delete selectedOutfit[category]; // Unselect if clicked again
  } else {
    selectedOutfit[category] = item; // Select new item
  }

  renderGrid(category);
  updateOutfitSummary();
}

// Render Selected Outfit Summary Bar
function updateOutfitSummary() {
  const container = document.getElementById('outfit-summary');
  const selectedCategories = Object.keys(selectedOutfit);

  if (selectedCategories.length === 0) {
    container.innerHTML = '<p style="color: #888;">No items selected yet. Click an item to add it to the outfit!</p>';
    return;
  }

  container.innerHTML = selectedCategories
    .map(cat => `<span class="summary-chip"><strong>${cat}:</strong> ${selectedOutfit[cat].name}</span>`)
    .join('');
}