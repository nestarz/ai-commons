<template>
  <div ref="license">
    <vue-markdown
      v-for="({ node: { license } }, index) in $static.allPreambules.edges"
      :source="license"
      :key="index"
    ></vue-markdown>
    <vue-markdown
      v-for="(paragraph, index) in paragraphs"
      :source="paragraph"
      :key="index"
    ></vue-markdown>
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

export default {
  props: ["steps", "options"],
  data() {
    return {
      benefits: 0,
      contributor_name: "Unknown"
    };
  },
  computed: {
    paragraphs() {
      const res = this.steps
        .filter(
          step =>
            step.options.filter(
              option =>
                !["checkbox", "checkbox-slider"].includes(option.type) ||
                option.check === true
            ).length > 0
        )
        .flatMap(step => [
          step.license,
          step.options
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
  methods: {
    getMarkdown() {
      return (
        this.$static.allPreambules.edges[0].node.license +
        "\n\n" +
        this.paragraphs.join("\n\n")
      );
    },
    replaceFields(string) {
      const regex = varname => new RegExp(`__${varname}__`, "g");
      return this.options.reduce(
        (str, option) => str.replace(regex(option.id), option.value),
        string
      );
    }
  }
};
</script>