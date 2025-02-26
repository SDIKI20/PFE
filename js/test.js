const sliderElement = document.getElementById("slider");
const minInput = document.getElementById("priceMin");
const maxInput = document.getElementById("priceMax");

// Initialize the range slider
let slider = new RangeSliderPips({
  target: sliderElement,
  props: {
    min: 0,
    max: 70,
    values: [20, 50],
    pips: true,
    pipstep: 1,
    float: true,
    range: true,
    prefix: "$ ",
    pushy: true,
    handleFormatter: (v) => v,
  }
});

// Event listener for slider value change
sliderElement.addEventListener("change", (e) => {
  minInput.value = e.detail.values[0];
  maxInput.value = e.detail.values[1];
});
// Update slider values when input fields change
[minInput, maxInput].forEach((input) => {
  input.addEventListener("change", () => {
    slider.$set({ values: [minInput.value, maxInput.value] });
  });
});
