<template>
  <div class="content">
    <final-license ref="license" :forms="forms" v-if="currentStep === forms.length"/>
    <commons-form :fields="form.options" :text="form.description" ref="form" v-else/>
    <div class="pager">
      <div class="previous" @click="prev" v-if="currentStep !== 0">Previous</div>
      <div class="next" @click="next" v-if="currentStep !== forms.length">Next</div>
      <div class="save" @click="save" v-if="currentStep === forms.length">Save</div>
    </div>
  </div>
</template>

<script>
export default {
  metaInfo: {
    title: "Commons Form"
  },
  components: {
    CommonsForm,
    FinalLicense
  },
  data() {
    return {
      currentStep: 0,
      active: false
    };
  },
}
</script>

<style lang="scss" scoped>
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .pager {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid var(--border-color);
      border-bottom: 1px solid var(--border-color);
      user-select: none;
      margin-top: 2rem;
      background-color: #111;
      color: white;
      font-weight: 900;
      font-style: italic;
      font-size: 1rem;

      .previous,
      .next,
      .save {
        padding: 1em;
        flex: 1;
        text-align: center;
        cursor: pointer;

        &:hover {
          background-color: #444;
        }
      }

      .previous {
        border-right: 1px solid var(--border-color);
      }
    }
  }
  </style>

