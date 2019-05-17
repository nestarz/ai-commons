<template>
  <Layout>
    <div class="disclamers">
      <g-image src="./AIC-logo-black.png"/>
      <vue-markdown :source="$static.allDisclamers.edges[0].node.license"></vue-markdown>
    </div>
  </Layout>
</template>

<script>
import VueMarkdown from "vue-markdown-v2";

export default {
  metaInfo: {
    title: "Disclamers"
  },
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

  counter-reset: h2counter;
  /deep/ h1 {
    counter-reset: h2counter;
  }
  /deep/ h2 {
    counter-reset: h3counter;
  }
  /deep/ h2:before {
    content: counter(h2counter) ".\0000a0\0000a0";
    counter-increment: h2counter;
  }
  /deep/ h3:before {
    content: counter(h2counter) "." counter(h3counter) ".\0000a0\0000a0";
    counter-increment: h3counter;
  }
}
</style>
