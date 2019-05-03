<template>
  <div class="block">
    <el-slider 
    class="slider"
      @input="$emit('input', $event.target.value)"
      :name="id"
      :min="min"
      :max="max"
      :step="step"
      v-model="value"
      show-input
    ></el-slider>
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
  width: 100%;
}
</style>
