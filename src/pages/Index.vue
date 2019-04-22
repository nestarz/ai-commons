<template>
  <div class="index">
    <div class="main">
      <div class="header">
        <h1>
          <div @click="prev(0)"><g-link to="/">AI Commons Licence</g-link></div>
        </h1>
        <ul class="desktop">
          <li
            v-for="option in options"
            :key="option.id"
            v-show="(['checkbox', 'checkbox-slider'].includes(option.type) && option.check === true) || option.value"
          >
            <div>{{ option.title }}</div>
            <div v-if="option.value" class="value">{{ option.value }}{{ option.type === 'checkbox-slider' ? '%' : ''}}</div>
          </li>
        </ul>
      </div>
      <div class="about" :class="{desktop: currentStep !== 0}">
        <p>
          Ce guide vous aide à déterminer quelle licence AI Commons vous convient
          le mieux en quelques étapes simples. Si vous êtes nouveau,
          vous pouvez également lire les
          <g-link to="/disclamers">Licensing Considerations</g-link> avant de commencer.
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
      currentStep: 0,
      optionHover: null,
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
.desktop {
  @media screen and (max-width: 600px) {
    display: none;
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
    border-top: 1px dashed #6b17e6;
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
      border-top: 1px solid #6b17e6;
      border-bottom: 1px solid #6b17e6;
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
        border-right: 1px solid #6b17e6;
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
          .checkbox {
            content: "";
            border-right: 1px solid #6b17e6;
          }

          &:first-child {
            border-top: 1px solid #6b17e6;
          }

          .content {
            padding: 0.25em 1em;
          }
          .slider {
            border-top: 1px solid #6b17e6;
            display: flex;
            justify-content: center;
            align-items: center;
            .value {
              padding: 1em;
              border-right: 1px solid #6b17e6;
            }
          }

          .input {
            border: 0;
            border-top: 1px solid #6b17e6;
            width: 100%;
            font-size: inherit;
            padding: 0;
            color: inherit;
            padding: 1em;
          }

          display: grid;
          grid-template-columns: 0.1fr 1fr;
          grid-gap: 1em 0;
          border-bottom: 1px solid #6b17e6;
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
    .about {
      @media screen and (max-width: 600px) {
        border-bottom: 1px solid #6b17e6;
      }
    }
    .header {
      width: 100%;
      h1 {
        border-bottom: 1px solid #6b17e6;
        font-weight: 100;
        font-size: larger;
        text-transform: uppercase;
      }
      li,
      h1 {
        padding: 1em;
        margin: 0;
      }
      li {
        border-bottom: 1px solid #6b17e6;
        display: flex;
        grid-template-columns: 0.8fr 0.2fr;
        padding: 0;
        & > * {
          display: flex;
          padding: 0.25em 1em;
          justify-content: center;
          align-items: center;
        }
        .value {
          border-left: 1px solid #6b17e6;
          padding-left: 1em;
          margin-left: 1em;
        }
      }
    }
    p {
      border-top: 1px solid #6b17e6;
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
    border-right: 1px solid #6b17e6;
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