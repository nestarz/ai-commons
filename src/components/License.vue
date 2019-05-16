<template>
  <div class="license">
    <el-button class="showPdf" round @click="showPdf = !showPdf">
      Show as
      <span v-if="showPdf">HTML</span>
      <span v-else>PDF</span>
    </el-button>
    <div class="pdf-viewer" v-if="showPdf">
      <object :data="pdfuri" type="application/pdf" v-if="pdfuri">
        <iframe :src="`https://docs.google.com/viewer?url=${pdfuri}&embedded=true`"></iframe>
      </object>
    </div>
    <div ref="license" class="content" v-show="!showPdf">
      <div class="body">
        <div class="header">
          <img src="./AIC-logo-black.png">
          <h2>Summary</h2>
          <ol v-if="actives.length">
            <li v-for="field in actives" :key="field.id">
              <span v-html="field.icon"></span>
              {{ field.title }}
              <template
                v-if="field.value"
              >: {{ field.value }}&nbsp;{{ field.type === 'checkbox-slider' ? '%' : ''}}</template>
            </li>
          </ol>
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
import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";

export default {
  props: ["forms", "actives"],
  data() {
    return {
      benefits: 0,
      contributor_name: "Unknown",
      pdfuri: null,
      showPdf: false
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
  mounted() {
    this.downloadImage();
  },
  methods: {
    downloadImage() {
      const contentHtml = this.$refs.license;
      // Save the PDF
      html2pdf()
        .set({
          margin: 1,
          image: { type: "jpeg", quality: 0.1 },
          html2canvas: {
            dpi: 10,
            onclone: element => {
              const svgElements = Array.from(element.querySelectorAll("svg"));
              svgElements.forEach(s => {
                const bBox = s.getBBox();
                s.setAttribute("x", bBox.x);
                s.setAttribute("y", bBox.y);
                s.setAttribute("width", bBox.width / 1.92);
                s.setAttribute("height", bBox.height / 1.92);
              });
            }
          },
          pagebreak: { mode: ["avoid-all"] },
          jsPDF: {
            unit: "in",
            format: "A4",
            orientation: "portrait"
          }
        })
        .from(
          `
        <style>
        .header {
          display: block;
        }
        </style>
        ${contentHtml.innerHTML}`
        )
        .toPdf()
        .output("datauristring")
        .then(res => (this.pdfuri = res));
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
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  flex-direction: column;
  border-top: 1px solid #eee;
  margin-top: 0.5rem;
  padding: 1rem 2rem;

  .showPdf {
    margin-bottom: 2rem;
  }

  .pdf-viewer {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    min-height: 60vh;

    object,
    embed {
      width: 100%;
      flex: 1;
      z-index: 99999;
    }
  }

  .content {
    .header {
    }

    /deep/ * {
      box-sizing: border-box;
    }
    /deep/ svg {
      width: 0.7em;
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
