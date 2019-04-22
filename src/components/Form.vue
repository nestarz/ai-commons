<template>
  <form class="form">
    <div class="text">{{ text }}</div>
    <div class="field" v-for="field in fields" :key="field.id">
      <div class="checkbox" :class="{active: field.check}" @click="toggleSelect(field)"></div>
      <div class="content" @click="toggleSelect(field)">
        <div class="main">
          <div class="title">{{ field.title }}</div>
          <div class="description">{{ field.description }}</div>
        </div>
        <div class="code" v-if="field.code">
          <pre v-highlightjs="field.code"><code class="python"></code></pre>
        </div>
        <input
          class="input"
          :type="field.type"
          :name="field.id"
          v-model.lazy="field.value"
          v-show="!field.type.includes('checkbox')"
          :required="!field.type.includes('checkbox')"
        >
        <div class="slider" v-if="field.type.includes('slider')" @click="toggleSelect(field, true)">
          <div class="value">{{ field.value }}&nbsp;%</div>
          <input
            type="range"
            v-model="field.value"
            :name="field.id"
            :min="field.min"
            :max="field.max"
            :step="field.step"
          >
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import VueMarkdown from "vue-markdown-v2";
import RangeSlider from "./Slider.vue";

export default {
  props: ["fields", "text"],
  components: {
    RangeSlider
  },
  methods: {
    toggleSelect(field, force) {
      this.$set(
        field,
        "check",
        typeof force !== "undefined" ? force : field.check ? !field.check : true
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.text {
  padding: 1em;
  border-bottom: 1px solid #6b17e6;
}

.field {
  display: grid;
  grid-template-columns: 0.1fr 1fr;
  grid-gap: 1em 0;
  border-bottom: 1px solid #6b17e6;
  user-select: none;
  cursor: pointer;

  .input {
    border: 0;
    border-top: 1px solid #6b17e6;
    width: 100%;
    font-size: inherit;
    padding: 0;
    color: inherit;
    padding: 1em;
  }

  :focus,
  &:hover {
    outline: none;
    background-color: #f8f3ff;
  }

  .content {
    .main,
    .code {
      padding: 0.25em 1em;
    }

    .main {
      .description {
        font-size: 80%;
        display: block;
      }
    }

    .code {
      font-size: 75%;
      border-top: 1px solid #6b17e6;
    }

    .slider {
      display: flex;
      border-top: 1px solid #6b17e6;
      :focus {
        background: transparent;
      }

      .value {
        padding: 1rem;
        border-right: 1px solid #6b17e6;
      }
    }
  }

  .checkbox {
    content: "";
    border-right: 1px solid #6b17e6;
    cursor: pointer;

    &.active {
      background: linear-gradient(
          to top left,
          rgba(0, 0, 0, 0) 0%,
          rgba(0, 0, 0, 0) calc(50% - 0.8px),
          #6b17e6 50%,
          rgba(0, 0, 0, 0) calc(50% + 0.8px),
          rgba(0, 0, 0, 0) 100%
        ),
        linear-gradient(
          to top right,
          rgba(0, 0, 0, 0) 0%,
          rgba(0, 0, 0, 0) calc(50% - 0.8px),
          #6b17e6 50%,
          rgba(0, 0, 0, 0) calc(50% + 0.8px),
          rgba(0, 0, 0, 0) 100%
        );
    }
  }
}
</style>
