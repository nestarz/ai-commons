<template>
  <form class="form">
    <div class="text">{{ text }}</div>
    <div class="fields">
      <div class="field" v-for="field in fields" :key="field.id" @click="toggleSelect(field)">
        <div class="checkbox">
          <div class="toggle" :class="{active: field.check}">
            <span></span>
          </div>
        </div>
        <div class="title">{{ field.title }}</div>
        <div></div>
        <div>
          <div class="description">{{ field.description }}</div>
          <div class="code" v-if="false">
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
          <div
            class="slider"
            v-if="field.type.includes('slider')"
            @click="toggleSelect(field, true)"
          >
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
  padding: 1rem 2rem;
  border-bottom: 1px solid #eee;
}

.fields {
  .field {
    display: grid;
    grid-template-columns: 40px 1fr;
    grid-gap: 0 2rem;
    padding: 2rem;
    border-bottom: 1px solid #eee;
    user-select: none;
    cursor: pointer;

    .input {
      border: 0;
      border-top: 1px solid var(--border-color);
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

    .code {
      padding: 0.25em 1em;
    }

    .title {
      font-weight: 600;
    }
    .description {
      font-size: 80%;
      display: block;
    }

    .code {
      font-size: 75%;
      border-top: 1px solid var(--border-color);
    }

    .slider {
      display: flex;
      border-top: 1px solid var(--border-color);
      :focus {
        background: transparent;
      }

      .value {
        padding: 1rem;
        border-right: 1px solid var(--border-color);
      }
    }

    .toggle {
      position: relative;
      display: block;
      width: 40px;
      height: 20px;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      transform: translate3d(0, 0, 0);
    }
    .toggle:before {
      content: "";
      position: relative;
      top: 3px;
      left: 3px;
      width: 34px;
      height: 14px;
      display: block;
      background: #eee;
      border-radius: 8px;
      transition: background 0.2s ease;
    }
    .toggle span {
      position: absolute;
      top: 0;
      left: 0;
      width: 20px;
      height: 20px;
      display: block;
      background: white;
      border-radius: 10px;
      box-shadow: 0 3px 8px rgba(154, 153, 153, 0.5);
      transition: all 0.2s ease;
    }
    .toggle span:before {
      content: "";
      position: absolute;
      display: block;
      margin: -18px;
      width: 56px;
      height: 56px;
      background: rgba(79, 46, 220, 0.5);
      border-radius: 50%;
      transform: scale(0);
      opacity: 1;
      pointer-events: none;
    }

    .toggle.active :before {
      background: #947ada;
    }
    .toggle.active span {
      background: linear-gradient(145.74deg, #6b56b6 20.13%, #4c75bf 96.96%);
      transform: translateX(20px);
      transition: all 0.2s cubic-bezier(0.8, 0.4, 0.3, 1.25),
        background 0.15s ease;
      box-shadow: 0 3px 8px rgba(79, 46, 220, 0.2);
    }
    .toggle.active span:before {
      transform: scale(1);
      opacity: 0;
      transition: all 0.4s ease;
    }

    .checkbox {
      content: "";
      border-right: 1px solid var(--border-color);
      cursor: pointer;
      display: flex;
      align-items: center;

      &.active {
        background: linear-gradient(
            to top left,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0) calc(50% - 0.8px),
            var(--border-color) 50%,
            rgba(0, 0, 0, 0) calc(50% + 0.8px),
            rgba(0, 0, 0, 0) 100%
          ),
          linear-gradient(
            to top right,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0) calc(50% - 0.8px),
            var(--border-color) 50%,
            rgba(0, 0, 0, 0) calc(50% + 0.8px),
            rgba(0, 0, 0, 0) 100%
          );
      }
    }
  }
}
</style>
