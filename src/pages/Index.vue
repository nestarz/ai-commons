<template>
  <div class="index">
    <div class="main">
      <div>
        <h1>AI Common Licence</h1>
        <ul>
          <li v-for="option in activeOptions" :key="option.label">
            <div>{{ option.label }}</div>
          </li>
        </ul>
      </div>
      <p>
        This chooser helps you determine which AI Commons License is
        <span>right for you</span> in a few easy steps.
        If you are new to AI Commons, you may also want to read
        <a
          href="#"
        >Licensing Considerations</a> before you get
        started.
      </p>
    </div>
    <div class="panel">
      <div>
        <div v-for="step in steps" :key="step.id">
          <p>{{ step.detail }}</p>
          <ul>
            <li v-for="option in step.options" :key="option.label" :class="{active: option.active}">
              <div class="checkbox" @click="select(option)"></div>
              <div>
                <div class="content" @click="select(option)">
                  {{ typeof option === 'string' ? option : option.label }}
                  <div class="description">{{ option.description }}</div>
                </div>
                <div @click="select(option)">
                  <vue-code-highlight v-if="option.code" class="code">{{ option.code }}</vue-code-highlight>
                </div>
                <input class="input" type="text" :name="option.label" v-if="option.type == 'input'">
                <div class="slider" v-if="option.type === 'slider'">
                  <div class="value">{{ sliderValue }}%</div>
                  <range-slider min="10" max="100" step="5" v-model="sliderValue"></range-slider>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* The typing effect */
@keyframes typing {
  from {
    text-decoration-color: #fff;
  }
  to {
    text-decoration-color: inherit;
  }
}

@keyframes ghost {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.index {
  min-height: 100%;
  display: grid;
  grid-template-columns: 0.4fr 0.6fr;
  .code {
    overflow: hidden;
    border-top: 1px solid black;
    & /deep/ pre.language-javascript {
      padding: 0 0.4rem;
      margin: -2.5rem 0 -3.8rem 0;
      &,
      code {
        background: none;
        border: none;
        box-shadow: none;
      }
      &:before,
      &:after {
        display: none;
      }
      border: none;
    }
  }
  .panel {
    ul {
      display: grid;
      margin: 0;
      padding: 0;

      li {
        cursor: pointer;
        user-select: none;

        &.active .checkbox {
          background: linear-gradient(
              to top left,
              rgba(0, 0, 0, 0) 0%,
              rgba(0, 0, 0, 0) calc(50% - 0.8px),
              rgba(0, 0, 0, 1) 50%,
              rgba(0, 0, 0, 0) calc(50% + 0.8px),
              rgba(0, 0, 0, 0) 100%
            ),
            linear-gradient(
              to top right,
              rgba(0, 0, 0, 0) 0%,
              rgba(0, 0, 0, 0) calc(50% - 0.8px),
              rgba(0, 0, 0, 1) 50%,
              rgba(0, 0, 0, 0) calc(50% + 0.8px),
              rgba(0, 0, 0, 0) 100%
            );
        }
        .checkbox {
          content: "";
          border-right: 1px solid black;
        }

        &:first-child {
          border-top: 1px solid black;
        }

        .content {
          padding: 0 1em;
        }
        .slider {
          border-top: 1px solid black;
          display: flex;
          justify-content: center;
          align-items: center;
          .value {
            padding: 1em;
            border-right: 1px solid black;
          }
          /deep/ .range-slider {
            padding: 0.3em 1em 1em 1em;
            height: auto;
            width: 100%;
            .range-slider-fill {
              background-color: black;
            }
          }
        }

        .input {
          border: 0;
          border-top: 1px solid #000;
          width: 100%;
          font-size: inherit;
          padding: 0;
          color: inherit;
          padding: 1em;
        }

        display: grid;
        grid-template-columns: 0.1fr 1fr;
        grid-gap: 1em 0;
        border-bottom: 1px solid black;
        margin: 0;
        list-style: none;

        .description {
          font-size: 80%;
          display: block;
        }
      }
    }
  }

  .main {
    justify-content: space-evenly;
    align-items: center;
    flex-direction: column;
    p {
      border-top: 1px solid black;
    }
    & > :first-child {
          padding: 1em;
    }
    ul {
      margin: 0;
      li {
        margin: 0;
        padding: 0;
        list-style: lower-latin;
        list-style-position: inside;
        div {
          display: inline;
        }
      }
    }
  }

  .main,
  .panel {
    display: flex;
    border-right: 1px solid #111;
    max-height: 100vh;
    overflow-y: scroll;

    p {
      max-width: 40rem;
      margin: 0;
      padding: 1rem;

      a {
        animation: typing 3.5s forwards;
      }
    }
  }
}
</style>

<script>
import { component as VueCodeHighlight } from "vue-code-highlight";
import "vue-code-highlight/themes/prism-coy.css";
import RangeSlider from "vue-range-slider";
import "vue-range-slider/dist/vue-range-slider.css";

export default {
  metaInfo: {
    title: "Index"
  },
  components: {
    VueCodeHighlight,
    RangeSlider
  },
  methods: {
    select(option) {
      option.active = !option.active;
    }
  },
  computed: {
    activeOptions() {
      return this.steps
        .filter(step => step.options)
        .flatMap(step => step.options.filter(option => option.active));
    }
  },
  data() {
    return {
      sliderValue: 50,
      steps: [
        {
          id: "natures",
          detail:
            "Le Common sous Licence visée par la présente Licence est de la/des nature(s) suivante(s) :",
          options: [
            {
              active: false,
              label: "Algorithmes",
              description:
                "A machine-learning algorithm is a mathematical model that learns to find patterns in the input that is fed to it. This input is referred to as training data.",
              code: `
def train(x, y):
  weights = 2 * random((3, 1)) - 1
  for iteration in range(epoch):
      output = 1 / (1 + exp(-dot(x, weights)))
      weights += dot(x.T, (y - output) * output * (1 - output))
              `
            },
            {
              active: false,
              label: "Modèles",
              description: `Weights and biases are the learnable parameters of your model. When presented with data during training, they are adjusted towards values that have correct output.`,
              source:
                "https://datascience.stackexchange.com/questions/19099/what-is-weight-and-bias-in-deep-learning",
              code: `
weights = train(x, y) 
>>> [0.12,0.1981,0.679,0.235]
`
            },
            {
              active: false,
              label: "Bases de données",
              code: `
X = [[0, 0, 1], 
     [1, 1, 1], 
     [1, 0, 1],
     ...
     [0, 1, 1]]
Y = [[0, 1, 1, ..., 0]].T
              `
            },
            {
              active: false,
              label: "Données d'entraînement",
              code: `
x = X[1, 100] // subset(X)
y = Y[1, 100] // subset(Y)
`
            }
          ]
        },
        {
          id: "conditions",
          detail: `Le Contributeur accorde à l’Utilisateur le droit personnel, gratuit, non-transmissible,
non sous-licenciable et non-exclusif d'utiliser, pour le Monde entier et de manière
irrévocable, le Common sous Licence. L’Utilisateur a le droit de reproduire et de
partager le Common sous Licence, ainsi que le droit de produire, reproduire et
partager (sauf à ce que l’option “Interdiction des Oeuvres Dérivées” ait été
sélectionnée dans les Conditions Spécifiques) les éventuelles Oeuvres Dérivées.
Les Conditions Spécifiques applicables sont les suivantes:`,
          options: [
            {
              active: false,
              label: "Citation du Contributeur"
            },
            {
              active: false,
              label: "Usages Commerciaux Interdits"
            },
            {
              active: false,
              label: "Interdiction des Oeuvres Dérivées"
            },
            {
              active: false,
              label: "Partage dans les mêmes conditions"
            },
            {
              active: false,
              label:
                "Usages Commerciaux autorisés avec partage des bénéfices à définir entre le Contributeur et l’Utilisateur",
              type: "slider"
            }
          ]
        },
        {
          id: "identity",
          options: [
            {
              label: "Firstname",
              type: "input"
            },
            {
              label: "Lastname",
              type: "input"
            },
            {
              label: "Pseudonyme",
              type: "input"
            },
            {
              label: "Email",
              type: "input"
            }
          ]
        }
      ]
    };
  }
};
</script>