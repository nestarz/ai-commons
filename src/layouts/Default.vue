<template>
  <div class="index">
    <div class="main">
      <div class="version">v0.0.1</div>
      <div>
        <g-image
          class="logo"
          src="https://aicommons.com/wp-content/uploads/2019/02/AIC-logo-white-1@3x.png"
        >
          <g-link to="/">{{ $static.metaData.siteName }}</g-link>
        </g-image>
      </div>
      <div class="licence">
        <div>
          <div class="active">Choose a license</div>
          <div>Disclaimer</div>
          <div>Licence</div>
        </div>
        <div>
          <slot/>
        </div>
      </div>
      <g-link to="/disclamer" class="start" :test="true">Start</g-link>
    </div>
    <div class="page">
      <div>Conditions Spécifiques CONTRIBUTEUR</div>
      <div>Conditions Générales de la Plateforme (CGP)</div>
    </div>
  </div>
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
  props: {
    header: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      fullName: `${author.firstName} ${author.lastName}`
    };
  },
  computed: {
    locale() {
      const translations = {
        fr: {
          home: "Accueil",
          ressources: "Ressources",
          about: "À propos"
        },
        en: {
          home: "Home",
          ressources: "Ressources",
          about: "About"
        }
      };
      return translations[this.$store.state.lang.slug];
    }
  }
};
</script>

<style lang="scss" scoped>
.layout {
}

.index {
  max-width: 40rem;
  margin: auto;
  padding: 2em 1em;
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

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .logo {
    filter: invert(1);
  }
}

.nav__link {
  margin-left: 20px;
}
</style>