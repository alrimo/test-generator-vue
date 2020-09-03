<template>
  <section id="testQuestion">
    <b-card class="bg-light test-card rounded-0">
      <b-row align-h="end">
        <b-icon
          icon="files"
          class="mx-3 toolbar-btn"
          @click="duplicateQuestion"
        ></b-icon>
        <b-icon
          icon="trash"
          class="mx-3 toolbar-btn"
          @click="deleteQuestion"
        ></b-icon>
      </b-row>
      <b-row class="mt-3">
        <b-col cols="12">
          <b-form>
            <label class="d-inline-flex lbl-test-number">
              {{ ordinal }}.
            </label>
            <b-form-input
              class="d-inline-flex input-test-question mb-2"
              v-model="question"
              placeholder="Question"
              @change="modifyQuestion"
            ></b-form-input>
            <transition-group name="fade">
              <div v-for="(opt, idx) in options" :key="idx" class="d-flex mb-2">
                <b-input-group class="col-6">
                  <b-input-group-prepend class="radio-option">
                    <b-form-radio
                      name="answer-options"
                      :value="idx"
                      class="mr-n2"
                      v-model="checked"
                      @change="correctAnswer"
                    >
                    </b-form-radio>
                  </b-input-group-prepend>
                  <b-form-input
                    type="text"
                    v-model="opt.value"
                    :placeholder="`Option #${idx + 1}`"
                    @change="modifyOption(idx, opt.value)"
                  >
                  </b-form-input>
                  <b-input-group-append>
                    <a @click="removeOption(idx)" class="radio-option">
                      <b-icon icon="trash"></b-icon>
                    </a>
                  </b-input-group-append>
                </b-input-group>
              </div>
            </transition-group>
          </b-form>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col cols="6">
          <button class="btn-add-opt" @click="addOption">
            <b-icon class="plus-icon" icon="plus"></b-icon
            ><span>Add Option</span>
          </button>
          <span class="form-error ml-3">{{ errorText }}</span>
        </b-col>
      </b-row>
    </b-card>
  </section>
</template>

<script>
export default {
  props: {
    ordinal: {
      type: Number,
      required: true
    },
    init: {
      type: Object
    }
  },
  data() {
    return {
      question: this.init.question,
      checked: this.init.correctIdx,
      options: this.init.options.map(function(val) {
        return { value: val }; // expected format is array of objs
      }),
      errorText: ""
    };
  },
  methods: {
    addOption() {
      if (this.options.length < 6) {
        this.$emit("add-option", this.ordinal);
        this.options.push({ value: "" });
      } else {
        this.errorText = "Max of 6 options";
      }
    },
    removeOption(idx) {
      this.options.splice(idx, 1);
      this.errorText = "";
      this.$emit("delete-option", { ordinal: this.ordinal, idx });
    },
    deleteQuestion() {
      this.$emit("delete-question", this.ordinal);
    },
    duplicateQuestion() {
      // - send all data to parent for duplication
      // - this is more efficient than JSON.parse() for
      //   when there are a lot of questions

      let opts = this.options.map(function(obj) {
        // - format in parent is array, not array of objects
        // - stripping out objects, holding values in simple array
        return obj.value;
      });

      this.$emit("duplicate-question", {
        ordinal: this.ordinal,
        question: this.question,
        options: opts,
        correctIdx: this.checked
      });
    },
    modifyQuestion(value) {
      this.$emit("modify-question", { ordinal: this.ordinal, question: value });
    },
    modifyOption(idx, value) {
      this.$emit("modify-option", { ordinal: this.ordinal, idx, value });
    },
    correctAnswer(idx) {
      this.$emit("correct-answer", { ordinal: this.ordinal, idx });
    }
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.form-error {
  font-size: 0.9rem;
  color: red;
}

.radio-option {
  background-color: transparent;
  display: flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
  white-space: nowrap;
  color: #333;
}

.radio-option:hover {
  cursor: pointer;
}

.option-box {
  margin-left: 23px;
}

.plus-icon {
  font-size: 18px;
  color: #008272;
}

.test-card {
  border-top: 5px solid #008272;
}

.lbl-test-number {
  width: 23px;
}

.input-test-question {
  width: calc(100% - 23px);
}

.btn-add-opt {
  background: transparent;
  border: none;
  font-size: 15px;
}

.btn-add-opt span {
  color: #333;
}

.toolbar-btn:hover {
  cursor: pointer;
}
</style>
