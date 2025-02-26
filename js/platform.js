const sliderElement = document.getElementById("slider");
const minInput = document.getElementById("priceMin");
const maxInput = document.getElementById("priceMax");

// Initialize the range slider
let slider = new RangeSliderPips({
  target: sliderElement,
  props: {
    min: 0,
    max: 100,
    values: [0, 100],
    pips: true,
    pipstep: 1,
    float: true,
    range: true,
    prefix: "DZD ",
    pushy: true,
    handleFormatter: (v) => v,
  }
});
