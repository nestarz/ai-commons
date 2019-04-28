<template>
  <div class="index">
    <div class="side">
      <div class="header">
        <g-link to="/" class="title">
          <g-image src="https://aicommons.com/wp-content/uploads/2019/02/AIC-logo-white-1@3x.png"/>
        </g-link>
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
        This chooser helps you to specify the conditions under which you want to share your work
        If you are new, please read more about
        <g-link to="http://www.aicommons.com">AI Commons</g-link>.
        <!-- Partager vos traLink to AI Commons -->
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
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  user-select: none;
  margin-top: 2rem;
  background-color: #111;
  color: white;
  font-weight: 900;
  font-style: italic;
  font-size: 1rem;

  .previous,
  .next,
  .save {
    padding: 1em;
    flex: 1;
    text-align: center;
    cursor: pointer;
    &:hover {
      background-color: #444;
    }
  }
  .previous {
    border-right: 1px solid var(--border-color);
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
    border-right: 1px solid var(--border-color);
    @media screen and (min-width: 600px) {
      max-height: 100vh;
      overflow-y: scroll;
    }
  }

  .main {
    max-width: 50rem;
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
    background: linear-gradient(145.74deg, #6b56b6 20.13%, #4c75bf 96.96%);
    color: #fff;

    .about {
      max-width: 40rem;
      margin: 0;
      padding: 1rem;

      @media screen and (max-width: 600px) {
        border-bottom: 1px solid var(--border-color);
      }
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
            flex: 1;

      a {
        display: inline;
        line-height: 0;
      }
      img {
        max-width: 258px;
      }
    }

    .fields {
      justify-self: flex-start;
      align-self: stretch;
      margin-bottom: auto;

      .field {
        border-bottom: 1px solid var(--border-color);
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