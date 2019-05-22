<template>
  <Layout>
    <div class="disclamers">
      <g-image src="./AIC-logo-black.png"/>
      {{ test }}
      <vue-markdown :source="$static.allDisclamers.edges[0].node.license"></vue-markdown>
    </div>
  </Layout>
</template>

<script>
import VueMarkdown from "vue-markdown-v2";

export default {
  metaInfo: {
    title: "terms"
  },
  props: ["test"],
  components: {
    VueMarkdown
  }
};
</script>

<static-query>
query allDisclamers {
  allDisclamers {
    edges {
      node {
				id
        license
      }
    }
  }
}
</static-query>

<style lang="scss" scoped>
.disclamers {
  padding: 1em;
  max-width: 40rem;
  border-left: 1px solid var(--border-color);
  margin: auto;

  img {
    margin-bottom: 1rem;
  }
}
</style>
