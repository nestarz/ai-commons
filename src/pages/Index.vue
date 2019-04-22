<template>
  <div class="index">
    <div class="main">
      <div class="header">
        <h1>AI Commons Licence</h1>
        <ul>
          <li v-for="option in optionsActives" :key="option.id">
            <div>{{ option.title }}</div>
          </li>
        </ul>
      </div>
      <div>
        <p>
          This chooser helps you determine which AI Commons License is
          <span>right for you</span> in a few easy steps.
          If you are new to AI Commons, you may also want to read
          <g-link to="/disclamers">Licensing Considerations</g-link> before you get
          started.
        </p>
      </div>
    </div>
    <div class="panel">
      <div class="content">
        <div class="final" v-if="currentStep === steps.length">
          <final-license ref="license" :steps="steps" :options="options"/>
        </div>
        <div
          class="steps"
          v-for="(step, index) in steps"
          :key="step.id"
          v-show="currentStep === index"
        >
          <form ref="forms">
            <p>{{ step.description }}</p>
            <ul>
              <li
                v-for="option in step.options"
                :key="option.id"
                :class="{active: optionsActives.includes(option)}"
                @mouseover="mouseOver(option)"
                @mouseleave="mouseOver(null)"
              >
                <input
                  type="hidden"
                  :name="option.id"
                  :value="option.check"
                  v-if="option.type === 'checkbox-slider' || option.type === 'checkbox'"
                >
                <div class="checkbox" @click="select(option)"></div>
                <div>
                  <div class="content" @click="select(option)">
                    {{ option.title }}
                    <div class="description">{{ option.description }}</div>
                  </div>
                  <div v-if="option.code" @click="select(option)">
                    <vue-code-highlight class="code">{{ "\n" + option.code }}</vue-code-highlight>
                  </div>
                  <input
                    class="input"
                    type="text"
                    :name="option.id"
                    v-if="option.type == 'input'"
                    v-model.lazy="option['value']"
                    required
                  >
                  <div
                    class="slider"
                    v-if="option.type === 'checkbox-slider'"
                    @click="select(option, true)"
                  >
                    <div class="value">{{ option['value'] ? option['value'] : 0 }}%</div>
                    <range-slider v-bind="option" v-model="option['value']"></range-slider>
                  </div>
                </div>
              </li>
            </ul>
          </form>
        </div>
        <div class="pager">
          <div class="previous" @click="prev" v-if="currentStep !== 0">Previous</div>
          <div class="next" @click="next" v-if="currentStep !== steps.length">Next</div>
          <div class="save" @click="save" v-if="currentStep === steps.length">Save</div>
        </div>
      </div>
    </div>
  </div>
</template>

<page-query>
query allForms {
  allForms(sortBy: "order", order: ASC) {
    edges {
      node {
				id
        description
        license
        order
        options {
          id
          title
          description
          code
          type
          inputType
          min
          max
          step
          license
        }
      }
    }
  }
}
</page-query>

<script>
import { component as VueCodeHighlight } from "vue-code-highlight";
import RangeSlider from "vue-range-slider";
import FinalLicense from "../components/License.vue";
import FileSaver from "file-saver";

export default {
  metaInfo: {
    title: "Index"
  },
  components: {
    VueCodeHighlight,
    RangeSlider,
    FinalLicense
  },
  methods: {
    save() {
      var blob = new Blob([this.$refs.license.getMarkdown()], {
        type: "text/plain;charset=utf-8"
      });
      FileSaver.saveAs(blob, "LICENSE");
    },
    select(option, force) {
      this.$set(
        option,
        "check",
        typeof force !== "undefined"
          ? force
          : option["check"]
          ? !option["check"]
          : true
      );
    },
    mouseOver(option) {
      this.optionHover = option;
    },
    next() {
      console.log(this.$refs);
      const currentForm = this.$refs.forms[this.currentStep];
      if (currentForm.checkValidity()) {
        this.currentStep = Math.min(this.steps.length, this.currentStep + 1);
      } else {
        currentForm.reportValidity();
      }
    },
    prev() {
      this.currentStep = Math.max(0, this.currentStep - 1);
    }
  },
  computed: {
    options() {
      return this.steps.flatMap(step => step.options);
    },
    optionsActives() {
      return this.options.filter(option => option.check);
    },
    steps() {
      return this.$page ? this.$page.allForms.edges.map(edge => edge.node) : [];
    }
  },
  data() {
    return {
      firstName: null,
      lastName: null,
      pseudo: null,
      email: null,
      currentStep: 0,
      optionHover: null,
      inputs: {},
      sliderValue: 50,
      selectedOptions: []
    };
  }
};
</script>

<style lang="scss" scoped>
/* The typing effect */
@keyframes typing {
  from {
    text-decoration-color: #fff;
  }
  to {
    text-decoration-color: inherit;
  }
}

@keyframes ghost {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.index {
  min-height: 100%;
  display: grid;
  @media screen and (min-width: 600px) {
    grid-template-columns: 0.4fr 0.6fr;
  }

  :focus {
    outline: none;
    background-color: #eee;
  }
  .code {
    overflow: hidden;
    border-top: 1px solid black;
    font-size: 0.7rem;
    display: none;
    @media screen and (min-width: 1000px) {
      display: block;
    }
    & /deep/ pre.language-javascript {
      padding: 0 0.4rem;
      margin: -2.5rem 0;
      &,
      code {
        background: none;
        border: none;
        box-shadow: none;
      }
      &:before,
      &:after {
        display: none;
      }
      border: none;
    }
  }
  .panel {
    & > .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .final {
      padding: 1em;
      ul {
        margin: 0;
        padding: 0;
        li {
          list-style: none;
          margin: 0;
          padding: 0;
        }
      }
    }
    .pager {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid black;
      border-bottom: 1px solid black;
      .previous,
      .next,
      .save {
        padding: 1em;
        flex: 1;
        text-align: center;
        cursor: pointer;
        &:hover {
          background-color: #eee;
        }
      }
      .previous {
        border-right: 1px solid black;
      }
    }
    .steps {
      ul {
        display: grid;
        margin: 0;
        padding: 0;

        li {
          cursor: pointer;
          user-select: none;

          &:hover {
            background-color: #eee;
          }

          &.active .checkbox {
            background: linear-gradient(
                to top left,
                rgba(0, 0, 0, 0) 0%,
                rgba(0, 0, 0, 0) calc(50% - 0.8px),
                rgba(0, 0, 0, 1) 50%,
                rgba(0, 0, 0, 0) calc(50% + 0.8px),
                rgba(0, 0, 0, 0) 100%
              ),
              linear-gradient(
                to top right,
                rgba(0, 0, 0, 0) 0%,
                rgba(0, 0, 0, 0) calc(50% - 0.8px),
                rgba(0, 0, 0, 1) 50%,
                rgba(0, 0, 0, 0) calc(50% + 0.8px),
                rgba(0, 0, 0, 0) 100%
              );
          }
          .checkbox {
            content: "";
            border-right: 1px solid black;
          }

          &:first-child {
            border-top: 1px solid black;
          }

          .content {
            padding: 0 1em;
          }
          .slider {
            border-top: 1px solid black;
            display: flex;
            justify-content: center;
            align-items: center;
            .value {
              padding: 1em;
              border-right: 1px solid black;
            }
          }

          .input {
            border: 0;
            border-top: 1px solid #000;
            width: 100%;
            font-size: inherit;
            padding: 0;
            color: inherit;
            padding: 1em;
          }

          display: grid;
          grid-template-columns: 0.1fr 1fr;
          grid-gap: 1em 0;
          border-bottom: 1px solid black;
          margin: 0;
          list-style: none;

          .description {
            font-size: 80%;
            display: block;
          }
        }
      }
    }
  }

  .main {
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
    .header {
      width: 100%;
      h1 {
        border-bottom: 1px solid black;
        font-weight: 100;
        font-size: larger;
        text-transform: uppercase;
      }
      ul,
      h1 {
        padding: 1em;
      }
    }
    p {
      border-top: 1px solid black;
    }
    ul {
      margin: 0;
      li {
        margin: 0;
        padding: 0;
        list-style: lower-latin;
        list-style-position: inside;
        div {
          display: inline;
        }
      }
    }
  }

  .main,
  .panel {
    display: flex;
    border-right: 1px solid #111;
    @media screen and (min-width: 600px) {
      max-height: 100vh;
      overflow-y: scroll;
    }

    p {
      max-width: 40rem;
      margin: 0;
      padding: 1rem;

      a {
        animation: typing 3.5s forwards;
      }
    }
  }
}
</style>