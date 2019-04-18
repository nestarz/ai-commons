<template>
  <Layout class="index">
    <p>
      Le Contributeur accorde à l’Utilisateur le droit personnel, gratuit, non-transmissible,
      non sous-licenciable et non-exclusif d&#39;utiliser, pour le Monde entier et de manière
      irrévocable, le Common sous Licence. L’Utilisateur a le droit de reproduire et de
      partager le Common sous Licence, ainsi que le droit de produire, reproduire et
      partager (sauf à ce que l’option “Interdiction des Oeuvres Dérivées” ait été
      sélectionnée dans les Conditions Spécifiques) les éventuelles Oeuvres Dérivées.
    </p>

    <ul>
      <label class="checkbox" v-for="condition in conditions" :key="condition">
        <input type="checkbox">
        <span class="checkmark"></span>
        {{ condition }}
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
