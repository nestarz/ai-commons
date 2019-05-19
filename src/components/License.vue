<template>
  <div class="license">
    <div class="showPdf" v-if="!pdfuri">
      <el-button class="showPdf" round @click="download">Download PDF</el-button>
    </div>
    <div class="pdf-viewer" v-if="pdfuri">
      <object :data="pdfuri" type="application/pdf" v-if="pdfuri"></object>
    </div>
    <div ref="license" class="content" v-show="!pdfuri">
      <div class="body markdown-body">
        <div class="header">
          <div class="summary" v-if="actives.flat().length">
            <div class="title">Summary</div>
            <div class="disclamer">
              <em>
                Disclaimer: this summary does not relieve the User from reading the
                terms of the License, including the User License and the Specific Terms.
              </em>
            </div>
            <div class="form" v-for="(form, index) in actives" :key="'i-form-' + index">
              <div
                class="preambule"
                v-if="index === 0"
              >The Licensed Common is of the following nature(s):</div>
              <div
                class="preambule"
                v-if="index === 1"
              >The Contributor grants the User the personal, free, non-transferable, non-sublicensable and non-exclusive right to use, for the entire World and irrevocably, the Licensed Common for the duration of the copyrights rights. The User has the right to reproduce and share the Licensed Common, as well as the right to produce, reproduce and share Derivative works (except if the option "Prohibition of Derivative Works" has been selected in the Specific Terms). The applicable Specific Attributions are as follows:</div>
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
        </div>
        <vue-markdown
          v-for="({ node: { license } }, index) in $static.allPreambules.edges"
          :source="license"
          :key="index"
        ></vue-markdown>
        <vue-markdown v-for="(paragraph, index) in paragraphs" :source="paragraph" :key="index"></vue-markdown>
      </div>
    </div>
  </div>
</template>

<static-query>
query allPreambules {
  allPreambules {
    edges {
      node {
				id
        license
      }
    }
  }
}
</static-query>

<script>
import VueMarkdown from "vue-markdown-v2";
import axios from "axios";

export default {
  props: ["forms", "actives"],
  data() {
    return {
      benefits: 0,
      contributor_name: "Unknown",
      pdfuri: null
    };
  },
  computed: {
    paragraphs() {
      const res = this.forms
        .filter(
          form =>
            form.options.filter(
              option =>
                !["checkbox", "checkbox-slider"].includes(option.type) ||
                option.check === true
            ).length > 0
        )
        .flatMap(form => [
          form.license,
          form.options
            .filter(
              option =>
                !["checkbox", "checkbox-slider"].includes(option.type) ||
                option.check === true
            )
            .filter(option => option.license !== "")
            .flatMap(option => option.license)
        ])
        .flat(2)
        .map(string => this.replaceFields(string));
      return res;
    }
  },
  components: {
    VueMarkdown
  },
  mounted() {},
  methods: {
    async download() {
      const res = await axios.post("./.netlify/functions/hello", {
        html: this.$refs.license.innerHTML
      });
      this.pdfuri = `data:application/pdf;base64,${res.data}`;
    },
    print() {
      const Printd = require("printd");
      const printd = new Printd.Printd();
      printd.print(this.$refs.license, [
        "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/3.0.1/github-markdown.min.css",
        `
        body  
        { 
            /* this affects the margin on the content before sending to printer */ 
            margin: 2cm;  
        } 

        * {
          font-size: 17pt;
        }

        img {
          width: 80%;
          text-align: center;
        }

        .markdown-body h3 {
          display: flex;
          align-items: center;
          margin-top: 1rem;
        }

        .markdown-body h1,
        .markdown-body h2 {
            clear: both;
            page-break-before: always;
            margin-top: 2cm;
        }

        svg {
            width: 2em !important;
            margin-right: 1rem !important;
        }

        .header {
                display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
        }
        .summary {
          justify-self: flex-start;
          align-self: stretch;
          margin-top: auto;
          padding: 2rem 0;
          background: rgba(255, 255, 255, 0.1);
        }
        .summary > .title {
          padding-left: 2rem;
          margin-bottom: 1rem;
          font-weight: 700;
          font-size: 120%;
        }
        .summary .field {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          padding: 0.25rem 2rem;
        }
        .summary .field:first-child {
          border: none;
        }
        .summary .field .title {
          flex: 1;
          display: flex;
          padding: 0.1rem 0rem;
          align-items: center;
          font-weight: 600;
          display: flex;
          align-items: center;
        }
        .summary .field .title .icon:not(:empty) {
          flex: 0 0 1.2em;
          height: 1.2rem;
          margin-right: 0.75rem;
        }
        .summary .field .value {
          border-left: 1px solid var(--border-color);
          margin: 0;
          padding: 0;
          margin-left: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .summary {
          margin-top: 6rem;
          background: white;
          border-radius: 20px;
          color: black;
          border: 1px solid black;
        }
        .summary .title {
          margin-bottom: 0;
        }
        .summary .disclamer, .summary .preambule {
          padding: 1rem 2rem;
          padding-top: 0;
        }
        .summary .field {
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }
        .summary .form {
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          margin-bottom: 1rem;
        }

        `
      ]);
    },
    getMarkdown() {
      return (
        this.$static.allPreambules.edges[0].node.license +
        "\n\n" +
        this.paragraphs.join("\n\n")
      );
    },
    replaceFields(string) {
      const regex = varname => new RegExp(`__${varname}__`, "g");
      return this.forms
        .flatMap(forms => forms.options)
        .reduce((str, option) => {
          Object.keys(option).forEach(
            key =>
              (str = str.replace(regex(`${option.id}:${key}`), option[key]))
          );
          return str;
        }, string);
    }
  }
};
</script>

<style lang="scss" scoped>
.html2pdf__container {
  line-height: 20px;
  font-size: 20px;

  svg {
    width: 0.7em;
  }
}

.license {
  a {
    color: #6040ff !important;
  }
  flex: 1;
  border-top: 1px solid #eee;
  margin-top: 0.5rem;
  padding: 0rem 0rem;

  .pdf-viewer {
    display: flex;
    flex: 1;
    flex-wrap: wrap;

    min-height: 90.5vh;
    object,
    embed {
      width: 100%;
      flex: 1;
      z-index: 99999;
    }
  }

  .showPdf {
    width: 100%;
    padding: 1rem 2rem;

    button {
      color: #6040ff;
      background: #f6ecff;
      border-color: #c6b3ff;
    }
  }

  .content {
    font-size: 16px;
    background: white;
    padding: 1rem 2rem;

    .hide-client {
      display: none;
    }

    .header {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;

      .summary {
        background: rgba(135, 119, 192, 0.08);
        border-radius: 20px;
        color: rgba(0, 0, 0, 0.719);
        .title {
          margin-bottom: 0;
        }
        .disclamer,
        .preambule {
          padding: 1rem 2rem;
          padding-top: 0;
        }
        .field {
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }
        .form {
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          margin-bottom: 1rem;
        }
      }
    }

    /deep/ h1 {
      margin-top: 4rem;
    }

    /deep/ h3 {
      svg {
        width: 2em;
        margin-right: 1rem;
      }
      display: flex;
      align-items: center;
      margin-top: 1rem;
    }

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
}
</style>
