<template>
  <div class="slider">
    <div class="value">{{ value ? value : 0 }}&nbsp;%</div>
    <input
      type="range"
      v-model="value"
      :name="id"
      :min="min"
      :max="max"
      :step="step"
      :style="`
      background-image: linear-gradient(
        to right, 
        #C5C5C5 ${normalizedValue * 100}%, 
        #6b17e6 ${normalizedValue * 100}%,
      );
      `"
    >
  </div>
</template>

<script>
export default {
  props: ["value", "name", "min", "max", "step"],
  computed: {
    normalizedValue() {
      return (this.value - this.min) / (this.max - this.min);
    }
  },
};
</script>
  
<style lang="scss" scoped>
.slider {
  input[type=range] {
    appearance: none;
    width: 100%;
    margin: 5px 0;
    height: 2px;
  }
  input[type=range]:focus {
    outline: none;
  }
  input[type=range]::-webkit-slider-runnable-track {
    width: 100%;
    height: 1px;
    cursor: pointer;
    border-radius: 0px;
    border: 0px solid #010101;
  }
  input[type=range]::-webkit-slider-thumb {
    border: 0.6px solid #7702ff;
    height: 11px;
    width: 11px;
    border-radius: 50px;
    background: #7702ff;
    cursor: pointer;
    appearance: none;
    margin-top: -5px;
  }
  input[type=range]:focus::-webkit-slider-runnable-track {
    outline: none;
  }
  input[type=range]::-moz-range-track {
    width: 100%;
    height: 1px;
    cursor: pointer;
  }
  input[type=range]::-moz-range-thumb {
    border: 0.6px solid #7702ff;
    height: 11px;
    width: 11px;
    border-radius: 50px;
    background: #7702ff;
    cursor: pointer;
  }
  input[type=range]::-ms-track {
    width: 100%;
    height: 1px;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  input[type=range]::-ms-thumb {
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
