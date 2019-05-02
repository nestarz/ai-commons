<template>
  <form class="form">
    <div class="text">{{ text }}</div>
    <div class="fields">
      <div class="field" v-for="field in fields" :key="field.id" @click="toggleSelect(field)">
        <div class="checkbox" v-if="field.type.includes('checkbox')">
          <div class="slider">
            <div class="toggle" :class="{active: field.check}">
              <span class="circle"></span>
            </div>
          </div>
          <div class="title">{{ field.title }}</div>
          <div class="icon"></div>
          <div>
            <div class="description">{{ field.description }}</div>
            <div
              class="slider"
              v-if="field.type.includes('slider')"
              @click="toggleSelect(field, true)"
            >
              <div class="value">{{ field.value ? field.value : 0 }}&nbsp;%</div>
              <range-slider />
            </div>
          </div>
        </div>
        <div>
          <div class="text-field" v-if="!field.type.includes('checkbox')">
            <div class="form__group">
              <input
                class="form__field"
                v-model.lazy="field.value"
                :type="field.type"
                :name="field.id"
                :id="field.id"
                :placeholder="field.title"
                :required="!field.type.includes('checkbox')"
              >
              <label :for="field.id" class="form__label">{{ field.title }}</label>
            </div>
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
.form {
  .text {
    padding: 1rem 2rem;
    border-bottom: 1px solid #eee;
  }

  .fields {
    .field {
      padding: 1rem 2rem;
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
        background: transparent;
        &:focus {
          outline: none;
        }
      }

      &:hover {
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

      .text-field {
        .form__group {
          position: relative;
          padding: 15px 0 0;
        }

        .form__field {
          font-family: inherit;
          width: 100%;
          border: 0;
          border-bottom: 1px solid #d2d2d2;
          outline: 0;
          font-size: 16px;
          color: #212121;
          padding: 7px 0;
          background: transparent;
          transition: border-color 0.2s;
        }

        .form__field::placeholder {
          color: transparent;
        }

        .form__field:placeholder-shown ~ .form__label {
          font-size: 16px;
          cursor: text;
          top: 20px;
        }

        label,
        .form__field:focus ~ .form__label {
          position: absolute;
          top: 0;
          display: block;
          transition: 0.2s;
          font-size: 12px;
          color: #9b9b9b;
        }

        .form__field:focus ~ .form__label {
          color: #6b56b6;
        }

        .form__field:focus {
          padding-bottom: 6px;
          border-bottom: 2px solid #6b56b6;
        }
      }

      .checkbox {
        display: grid;
        grid-template-columns: 40px 1fr;
        grid-gap: 0 2rem;

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
            padding: 1rem;
            padding-left: 0;
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
          background: linear-gradient(
            145.74deg,
            #6b56b6 20.13%,
            #4c75bf 96.96%
          );
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

        .slider {
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
  }
}
</style>
