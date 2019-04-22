<template>
  <div class="index">
    <div class="side">
      <div class="header">
        <g-link to="/" class="title">AI Commons Licence</g-link>
      </div>
      <div class="fields">
        <div class="field" v-for="field in actives" :key="field.id">
          <div class="title">{{ field.title }}</div>
          <div
            class="value"
            v-if="field.value"
          >{{ field.value }}&nbsp;{{ field.type === 'checkbox-slider' ? '%' : ''}}</div>
        </div>
      </div>
      <div class="about">
        This chooser helps you determine which AI Commons License is
        <span>right for you</span> in a few easy steps.
        If you are new to AI Commons, you may also want to read
        <g-link to="/disclamers">Licensing Considerations</g-link>&nbsp;before you get
        started.
      </div>
    </div>
    <div class="main">
      <div class="content">
        <final-license ref="license" :forms="forms" v-if="currentStep === forms.length"/>
        <commons-form :fields="form.options" :text="form.description" ref="form" v-else/>
        <div class="pager">
          <div class="previous" @click="prev" v-if="currentStep !== 0">Previous</div>
          <div class="next" @click="next" v-if="currentStep !== forms.length">Next</div>
          <div class="save" @click="save" v-if="currentStep === forms.length">Save</div>
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
      currentStep: 0
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
            field.value
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
.pager {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #6b17e6;
  border-bottom: 1px solid #6b17e6;
  user-select: none;
  margin-top: 2rem;

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

.only-desktop {
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
  .side,
  .main {
    display: flex;
    border-right: 1px solid #6b17e6;
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
    justify-content: space-around;
    align-items: center;
    flex-direction: column;

    .about {
      max-width: 40rem;
      margin: 0;
      padding: 1rem;

      @media screen and (max-width: 600px) {
        border-bottom: 1px solid #6b17e6;
      }
    }

    .header {
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
      width: 100%;
      border-bottom: 1px solid #6b17e6;
      font-weight: bolder;
      text-transform: uppercase;
      padding: 1rem;
      flex: 1;
      justify-content: center;
      align-items: center;
      display: flex;

      .title {
        background: white;
      }
    }

    .fields {
      justify-self: flex-start;
      align-self: stretch;
      margin-bottom: auto;

      .field {
        border-bottom: 1px solid #6b17e6;
        display: flex;
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
  }
}
</style>