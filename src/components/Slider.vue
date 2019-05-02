<template>
  <div class="slider">
    <div class="value">{{ value ? value : 0 }}&nbsp;%</div>
    <input
      type="range"
      @input="$emit('input', $event.target.value)"
      :name="id"
      :min="min"
      :max="max"
      :step="step"
      :value="value"
      :style="`background-image: linear-gradient(to right, rgb(107, 23, 230) ${
        normalizedValue}%, rgb(197, 197, 197) ${normalizedValue}%);`"
    >
  </div>
</template>

<script>
export default {
  props: ["value", "name", "min", "max", "step"],
  computed: {
    normalizedValue() {
      return ((this.value - this.min) / (this.max - this.min)) * 100;
    }
  }
};
</script>
  
<style lang="scss" scoped>
.slider {
  display: flex;
  border-top: 1px solid var(--border-color);

  input,
  :focus {
    &,
    &:focus {
      background: transparent;
    }
  }

  .value {
    padding: 0.25rem 1rem;
    margin: 0.5rem 1rem;
    margin-left: 0;
    font-weight: 700;
    background-color: #eee;
  }

  input[type="range"] {
    appearance: none;
    width: 100%;
    margin: 5px 0;
    height: 2px;
  }
  input[type="range"]:focus {
    outline: none;
  }
  input[type="range"]::-webkit-slider-runnable-track {
    width: 100%;
    height: 1px;
    cursor: pointer;
    border-radius: 0px;
    border: 0px solid #010101;
  }
  input[type="range"]::-webkit-slider-thumb {
    border: 0.6px solid #7702ff;
    height: 11px;
    width: 11px;
    border-radius: 50px;
    background: #7702ff;
    cursor: pointer;
    appearance: none;
    margin-top: -5px;
  }
  input[type="range"]:focus::-webkit-slider-runnable-track {
    outline: none;
  }
  input[type="range"]::-moz-range-track {
    width: 100%;
    height: 1px;
    cursor: pointer;
  }
  input[type="range"]::-moz-range-thumb {
    border: 0.6px solid #7702ff;
    height: 11px;
    width: 11px;
    border-radius: 50px;
    background: #7702ff;
    cursor: pointer;
  }
  input[type="range"]::-ms-track {
    width: 100%;
    height: 1px;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  input[type="range"]::-ms-thumb {
    border: 0.6px solid #7702ff;
    height: 11px;
    width: 11px;
    border-radius: 50px;
    background: #7702ff;
    cursor: pointer;
    height: 1px;
  }
}
</style>
