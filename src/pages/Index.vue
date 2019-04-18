<template>
  <Layout class="index">
    This chooser helps you determine which AI Commons License is right for you in a few easy steps. If you are new to AI Commons, you may also want to read Licensing Considerations before you get started.
  </Layout>
</template>

<static-query>
query {
  metaData {
    siteName
  }
}
</static-query>

<script>
import author from "~/assets/author.yml";

export default {
  metaInfo: {
    title: "Index"
  },
  components: {},
  data() {
    return {
      social: author.social,
      natures: [
        "Algorithmes",
        "Modèles",
        "Bases de données",
        "Données d'entraînement"
      ],
      conditions: [
        "Citation du Contributeur",
        "Usages Commerciaux Interdits",
        "Interdiction des Oeuvres Dérivées",
        "Partage dans les mêmes conditions",
        "Usages Commerciaux autorisés avec partage des bénéfices à définir entre le Contributeur \
        et l’Utilisateur"
      ]
    };
  },
  computed: {
    bio() {
      return author.bio[this.$store.state.lang.slug];
    }
  }
};
</script>

<style lang="scss" scoped>
.index {
  display: flex;
  justify-content: center;
  min-height: 100%;
  flex-direction: column;
  background: white;

  .main {
    display: flex;
    justify-content: center;
    flex-direction: column;
    flex: 1;
    margin: 1em;
  }

  .version {
    align-self: flex-end;
    font-size: small;
  }

  .start {
    align-self: center;
    margin: 2em;
    border: 1px solid;
    padding: 0.2em 1em;
    user-select: none;
  }
  .page {
    align-self: flex-end;
    justify-self: flex-end;
  }
  .licence {
    display: grid;
    grid-gap: 1em;
    grid-template-columns: 0.4fr 1fr;
    margin-top: 1em;
    > :first-child {
      font-weight: bold;
      color: gainsboro;
      .active {
        color: black;
      }
    }
  }

  .logo {
    filter: invert(1);
    user-select: none;
  }
  .home-links a {
    margin-right: 1rem;
  }

  .checkbox {
    display: flex;
    align-items: center;
    color: var(--link-color);
    text-decoration: underline;
    cursor: pointer;

    input {
      position: absolute;
      visibility: hidden;
      z-index: -9999;
    }

    span {
      width: 20px;
      height: 20px;
      margin-right: 1em;
      display: block;
      border: 1px solid black;
      border-radius: 28%;
      box-shadow: inset 0px 0px 3px rgba(10, 10, 10, 0.6);
    }

    input:checked + span {
      background: black;
    }
  }
}
</style>
