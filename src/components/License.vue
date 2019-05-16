<template>
  <div ref="license" class="license">
    <vue-markdown
      v-for="({ node: { license } }, index) in $static.allPreambules.edges"
      :source="license"
      :key="index"
    ></vue-markdown>
    <vue-markdown v-for="(paragraph, index) in paragraphs" :source="paragraph" :key="index"></vue-markdown>
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
import * as jsPDF from 'jspdf';

export default {
  props: ["forms"],
  data() {
    return {
      benefits: 0,
      contributor_name: "Unknown"
    };
  },
  computed: {
    paragraphs() {
      console.log(this.forms);
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
      const contentHtml = this.$refs.license.innerHTML;
      doc.fromHTML(contentHtml, 15, 15, {
        width: 170
      });
      doc.save("LICENSE.pdf");
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
</style>
