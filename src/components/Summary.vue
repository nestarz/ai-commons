<template>
  <div class="summary" v-if="actives.flat().length">
    <div class="title">Summary</div>
    <div class="form" v-for="(form, index) in actives" :key="'form-' + index">
      <div class="field" v-for="field in form" :key="field.id">
        <div class="title">
          <div v-html="field.icon" class="icon"></div>
          <div class="title--content">{{ field.title }}</div>
        </div>
        <div
          class="value"
          v-if="field.value"
        >{{ field.value }}&nbsp;{{ field.type === 'checkbox-slider' ? '%' : ''}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["forms"],
  computed: {
    actives() {
      return this.forms.map(form =>
        form.options.filter(
          field =>
            (["checkbox", "checkbox-slider"].includes(field.type) &&
              field.check === true) ||
            (!["checkbox", "checkbox-slider"].includes(field.type) &&
              field.value)
        )
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.form {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
</style>