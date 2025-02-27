const minPriceInput = document.getElementById('minPrice');
const maxPriceInput = document.getElementById('maxPrice');
const minRangeInput = document.getElementById('minRange');
const maxRangeInput = document.getElementById('maxRange');
const minTooltip = document.getElementById('minTooltip');
const maxTooltip = document.getElementById('maxTooltip');

// Update tooltip and input values
function updateValues() {
  minTooltip.textContent = minRangeInput.value;
  maxTooltip.textContent = maxRangeInput.value;
  minPriceInput.value = minRangeInput.value;
  maxPriceInput.value = maxRangeInput.value;
}

// Sync range inputs with number inputs
minPriceInput.addEventListener('input', () => {
  minRangeInput.value = minPriceInput.value;
  updateValues();
});

maxPriceInput.addEventListener('input', () => {
  maxRangeInput.value = maxPriceInput.value;
  updateValues();
});

// Sync number inputs with range inputs
minRangeInput.addEventListener('input', () => {
  minPriceInput.value = minRangeInput.value;
  updateValues();
});

maxRangeInput.addEventListener('input', () => {
  maxPriceInput.value = maxRangeInput.value;
  updateValues();
});

// Initialize tooltips
updateValues();