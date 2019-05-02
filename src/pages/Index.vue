<template>
  <div class="index">
    <div class="side" :class="{ active }">
      <div class="header">
        <g-link to="/" class="title">
          <g-image src="https://aicommons.com/wp-content/uploads/2019/02/AIC-logo-white-1@3x.png"/>
        </g-link>
      </div>
      <div class="about">
        This chooser helps you to specify the conditions under which you want to share your work
        If you are new, please read more about
        <g-link to="http://www.aicommons.com">AI Commons</g-link>.
        <!-- Partager vos traLink to AI Commons -->
      </div>
      <div class="fields" v-if="actives.length">
        <div class="field" v-for="field in actives" :key="field.id">
          <div class="title">{{ field.title }}</div>
          <div
            class="value"
            v-if="field.value"
          >{{ field.value }}&nbsp;{{ field.type === 'checkbox-slider' ? '%' : ''}}</div>
        </div>
      </div>
      <div class="button dark start" v-if="!active" @click="active = true">Start</div>
    </div>
    <div class="main">
      <div class="content">
        <final-license ref="license" :forms="forms" v-if="currentStep === forms.length"/>
        <commons-form :fields="form.options" :text="form.description" ref="form" v-else/>
        <div class="pager">
          <div class="button previous" @click="prev" v-if="currentStep !== 0">Previous</div>
          <div class="button next" @click="next" v-if="currentStep !== forms.length">Next</div>
          <div class="button save" @click="save" v-if="currentStep === forms.length">Save</div>
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
          value
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
import CommonsForm from "../components/Form.vue";
import FinalLicense from "../components/License.vue";
import FileSaver from "file-saver";

export default {
  metaInfo: {
    title: "Index"
  },
  components: {
    CommonsForm,
    FinalLicense
  },
  data() {
    return {
      currentStep: 0,
      active: false
    };
  },
  computed: {
    actives() {
      return this.forms
        .flatMap(form => form.options)
        .filter(
          field =>
            (["checkbox", "checkbox-slider"].includes(field.type) &&
              field.check === true) ||
            !["checkbox", "checkbox-slider"].includes(field.type) && field.value
        );
    },
    forms() {
      return this.$page.allForms.edges.map(edge => edge.node);
    },
    form() {
      return this.$page.allForms.edges[this.currentStep].node;
    }
  },
  methods: {
    next() {
      const currentForm = this.$refs.form.$el;
      if (currentForm.checkValidity()) {
        this.currentStep = Math.min(this.forms.length, this.currentStep + 1);
      } else {
        currentForm.reportValidity();
      }
    },
    prev() {
      this.currentStep = Math.max(0, this.currentStep - 1);
    },
    save() {
      var blob = new Blob([this.$refs.license.getMarkdown()], {
        type: "text/plain;charset=utf-8"
      });
      FileSaver.saveAs(blob, "LICENSE");
    }
  }
};
</script>

<style lang="scss" scoped>
.button {
  font-size: 14px;
  line-height: 2.25rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-decoration: none;
  text-transform: uppercase;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  will-change: transform, opacity;
  padding: 0 8px 0 8px;
  display: inline-flex;
  position: relative;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 64px;
  height: 36px;
  border: none;
  outline: none;
  line-height: inherit;
  user-select: none;
  -webkit-appearance: none;
  overflow: hidden;
  vertical-align: middle;
  border-radius: 8px;
  border-style: solid;
  padding: 0 14px 0 14px;
  border-width: 2px;
  border-color: #fff;
  cursor: pointer;
  &:hover {
    background-color: #eee;
  }
  &.dark:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }
}
.pager {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  user-select: none;
  margin-top: 0rem;
  font-weight: 900;
  font-size: 1rem;
  padding: 1rem;
  text-transform: capitalize;

  .next {
    margin-left: auto;
    &:after {
      content: "\2192";
      font-size: 2rem;
      margin-top: -0.8rem;
      margin-left: 1rem;
    }
  }
  .previous {
    margin-right: auto;
    &:before {
      content: "\2190";
      font-size: 2rem;
      margin-top: -0.8rem;
      margin-right: 1rem;
    }
  }
}

.only-desktop {
  @media screen and (max-width: 600px) {
    display: none;
  }
}
.index {
  min-height: 100%;
  display: grid;
  overflow: hidden;
  @media screen and (min-width: 600px) {
    grid-template-columns: 0.4fr 0.6fr;
  }
  .side,
  .main {
    display: flex;
    border-right: 1px solid var(--border-color);
    @media screen and (min-width: 600px) {
      max-height: 100vh;
      overflow-y: scroll;
    }
  }

  .main {
    & > .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .final {
      padding: 1em;
    }
  }

  .side {
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: linear-gradient(145.74deg, #6b56b6 20.13%, #4c75bf 96.96%);
    color: #fff;
    z-index: 2;
    transition: all 2s ease;
    min-width: 100vw;
    overflow: hidden;

    &.active {
      min-width: 100%;
    }

    .about {
      max-width: 30rem;
      margin: 0;
      padding: 1rem;

      @media screen and (max-width: 600px) {
        border-bottom: 1px solid var(--border-color);
      }
    }

    .start {
      padding: 0.5rem 2rem;
      margin-bottom: 1rem;
      color: #fff;
      cursor: pointer;
      user-select: none;
    }

    .header {
      width: 100%;
      border-bottom: 1px solid var(--border-color);
      font-weight: bolder;
      text-transform: uppercase;
      padding: 1rem;
      /* flex: 1; */
      justify-content: center;
      align-items: center;
      display: flex;

      a {
        display: inline;
        line-height: 0;
      }
      img {
        max-width: 25rem;
        width: 100%;
        user-select: none;
      }
    }

    .fields {
      justify-self: flex-start;
      align-self: stretch;
      margin-top: auto;
      margin-bottom: 1rem;

      .field {
        border-top: 0px solid #fff;
        &:first-child {
          border: none;
        }
        display: flex;
        padding: 0;

        & > * {
          display: flex;
          padding: 0.1em 1em;
          justify-content: center;
          align-items: center;
        }

        .value {
          border-left: 1px solid var(--border-color);
          padding-left: 1em;
          margin-left: 1em;
        }
      }
    }
  }
}
</style>