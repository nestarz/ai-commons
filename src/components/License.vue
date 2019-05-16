<template>
  <div class="license">
    <div class="pdf-viewer">
      <object :data="pdfuri" type="application/pdf" v-if="pdfuri">
        <iframe :src="`https://docs.google.com/viewer?url=${pdfuri}&embedded=true`"></iframe>
      </object>
    </div>
    <div ref="license" class="content">
      <vue-markdown
        v-for="({ node: { license } }, index) in $static.allPreambules.edges"
        :source="license"
        :key="index"
      ></vue-markdown>
      <vue-markdown v-for="(paragraph, index) in paragraphs" :source="paragraph" :key="index"></vue-markdown>
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
import * as jsPDF from "jspdf";
import html2pdf from 'html2pdf.js';

export default {
  props: ["forms"],
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
  mounted() {
    this.download();
  },
  methods: {
    download() {
       const doc = new jsPDF();
      doc.addFont('Amiri', 'Amiri', 'normal');
      doc.setFont('Amiri'); // set font
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);
      const contentHtml = this.$refs.license.innerHTML;
      doc.html(contentHtml, {
        callback: function (doc) {
          doc.save();
        }
      });
    },
    downloadImage() {
      const contentHtml = this.$refs.license.innerHTML;
      // Save the PDF
      html2pdf(contentHtml, {
        margin:       .1,
        filename:     'Interview_Form.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { dpi: 192 },
        jsPDF:        { unit: 'in', format: 'A4', orientation: 'portrait', footer: 'a' },
        pdfCallback:  pdf => {
          this.pdfuri = pdf.output("datauristring");
        },
      });
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
        .reduce(
          (str, option) => str.replace(regex(option.id), option.value),
          string
        );
    }
  }
};
</script>

<style lang="scss" scoped>
.license {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  .pdf-viewer {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    object, embed {
      width: 100%;
      flex: 1;
    }
  }
  
  .content {
    margin-top: 0.5rem;
    padding: 1rem 2rem;
    border-top: 1px solid #eee;

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
