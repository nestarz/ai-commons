<template>
  <Layout class="index">
    <p>
      Le Common sous Licence visée par la présente Licence est de la/des nature(s)
      suivante(s) :
    </p>

    <ul>
      <label class="checkbox" v-for="nature in natures" :key="nature">
        <input type="checkbox">
        <span class="checkmark"></span>
        {{ nature }} {{ test }}
      </label>
    </ul>
  </Layout>
</template>

<script>
import author from "~/assets/author.yml";

export default {
  metaInfo: {
    title: "Disclamer"
  },
  components: {},
  props: {
      test: Boolean,
  },
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
