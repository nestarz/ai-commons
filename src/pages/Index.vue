<template>
  <div class="index">
    <div class="side" :class="{ active, top: actives.flat().length }">
      <div class="header" @click="currentStep = 0">
        <div class="title">
          <g-image src="./AIC-logo-white.png"/>
        </div>
      </div>
      <div class="intro">
        <div class="about">
          This chooser helps you to specify the conditions under which you want to share your work
          If you are new, please read more about
          <a
            href="http://www.aicommons.com"
            alt="aicommons"
          >AI Commons</a>.
          <!-- Partager vos traLink to AI Commons -->
        </div>
        <el-button
          class="start"
          round
          type="primary"
          icon="el-icon-plus"
          v-if="!active"
          @click="active = true"
        >Start</el-button>
      </div>
      <super-summary :forms="forms"/>
    </div>
    <div class="main" @click="active = true">
      <div class="content">
        <el-steps class="steps" :active="currentStep" finish-status="success">
          <el-step></el-step>
          <el-step></el-step>
          <el-step></el-step>
        </el-steps>
        <final-license
          ref="license"
          :forms="forms"
          :actives="actives"
          v-if="currentStep === forms.length"
        />
        <commons-form :fields="form.options" :text="form.description" ref="form" v-else/>
        <div class="pager">
          <el-button round icon="el-icon-arrow-left" @click="prev" v-if="currentStep !== 0">Previous</el-button>
          <el-button round @click="next" v-if="currentStep !== forms.length">
            Next
            <i class="el-icon-arrow-right"></i>
          </el-button>
          <el-button
            round
            icon="el-icon-delete"
            @click="save"
            v-if="currentStep === forms.length"
          >Save</el-button>
        </div>
        <el-progress
          style="margin: 0"
          :show-text="false"
          :percentage="currentStep/forms.length*100"
        ></el-progress>
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
          icon
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
import SuperSummary from "../components/Summary.vue";
import FileSaver from "file-saver";

export default {
  metaInfo: {
    title: "Index"
  },
  components: {
    CommonsForm,
    FinalLicense,
    SuperSummary
  },
  data() {
    return {
      currentStep: 0,
      active: false
    };
  },
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
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  border-radius: 20px;
  padding: 12px 23px;
  text-transform: uppercase;

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
  margin-top: auto;
  text-transform: capitalize;

  button {
    color: #6040ff;
    background: #f6ecff;
    border-color: #c6b3ff;
  }

  & > :last-child {
    margin-left: auto;
  }
}

.only-desktop {
  @media screen and (max-width: 1050px) {
    display: none;
  }
}
.index {
  min-height: 100%;
  display: grid;
  overflow: hidden;
  @media screen and (min-width: 1050px) {
    grid-template-columns: 0.4fr 0.6fr;
  }
  .side,
  .main {
    display: flex;
    border-right: 1px solid var(--border-color);
    @media screen and (min-width: 1050px) {
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
      height: 100%;

      /deep/ .el-progress-bar__outer,
      /deep/ .el-progress-bar__inner {
        border-radius: 0;
      }

      .steps {
        margin: 2rem 2rem 1rem 2rem;

        @media screen and (min-width: 1050px) {
          margin: 1rem 2rem;
        }
      }
    }
    .final {
      padding: 1em;
    }
  }

  .side {
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    background: linear-gradient(145.74deg, #6b56b6 20.13%, #4c75bf 96.96%);
    color: #fff;
    z-index: 2;
    transition: all 2s ease;
    min-width: 100vw;
    overflow: hidden;
    overflow-y: scroll;
    box-shadow: rgba(0, 0, 0, 0.04) 0px 0px 6px;
    padding-top: 2rem;

    /*box-shadow: 1px 1px 20px 0px #777777;*/

    &.active {
      min-width: 100%;
    }

    &.active.top {
      justify-content: flex-start;
    }

    .intro {
      .about {
        max-width: 30rem;
        margin: 0;
        padding: 2rem;
        padding-top: 0rem;
        border-bottom: 1px solid var(--border-color);

        @media screen and (min-width: 1050px) {
          border-bottom: none;
        }
      }

      .start {
        margin: 0 2rem;
        display: none;

        @media screen and (min-width: 1050px) {
          display: block;
        }
      }
    }
    .header {
      width: 100%;
      border-bottom: 1px solid var(--border-color);
      font-weight: bolder;
      text-transform: uppercase;
      padding: 0 2rem;
      margin-bottom: 1rem;
      /* flex: 1; */
      justify-content: flex-start;
      align-items: flex-start;
      display: flex;
      cursor: pointer;

      .title {
        display: inline;
        line-height: 0;
      }
      img {
        max-width: 12rem;
        width: 100%;
        user-select: none;
      }
    }

    .fields {
      justify-self: flex-start;
      align-self: stretch;
      margin-top: auto;
      padding: 2rem 0;
      background: rgba(255, 255, 255, 0.1);

      & > .title {
        padding-left: 2rem;
        margin-bottom: 1rem;
        font-weight: 700;
        font-size: 120%;
      }

      .field {
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        &:first-child {
          border: none;
        }
        display: flex;
        padding: 0.25rem 2rem;

        .title {
          flex: 1;
          display: flex;
          padding: 0.1rem 0rem;
          align-items: center;

          font-weight: 600;
          display: flex;
          align-items: center;

          .icon {
            &:not(:empty) {
              flex: 0 0 1.2em;
              height: 1.2rem;
              margin-right: 0.75rem;
            }
          }
        }

        .value {
          border-left: 1px solid var(--border-color);
          margin: 0;
          padding: 0;
          margin-left: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
</style>