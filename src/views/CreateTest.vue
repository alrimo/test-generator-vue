<template>
  <section>
    <nav class="sub-nav d-flex justify-content-center">
      <button v-b-modal.confirmReset class="ml-auto">
        <b-icon icon="arrow-repeat"></b-icon>
        Reset
      </button>
      <button v-if="showTakeTest" class="ml-auto">
        <b-icon icon="pencil" class="mr-2"></b-icon>
        Take Test
      </button>
      <button class="filled-btn" @click="saveCsv">Save CSV</button>
    </nav>

    <div class="test-container">
      <b-card class="shadow-sm mt-3 max-width">
        <b-card-body>
          <b-card v-if="showTitles" class="bg-light rounded-0 mb-3">
            <b-form-input
              id="inputMqfTitle"
              v-model="mqfTitle"
              type="text"
              placeholder="Title"
              class="mb-2"
            >
            </b-form-input>
            <b-form-input
              id="inputMqfDesc"
              v-model="mqfDesc"
              type="text"
              placeholder="Description"
            >
            </b-form-input>
          </b-card>
          <div v-for="(item, idx) in mqf" :key="item.id" class="mb-3">
            <TestQuestion
              :ordinal="getOrdinal(idx)"
              :init="item"
              @delete-question="deleteQuestion"
              @delete-option="deleteOption"
              @add-option="addOption"
              @modify-question="modifyQuestion"
              @modify-option="modifyOption"
              @correct-answer="correctAnswer"
              @duplicate-question="duplicateQuestion"
            >
            </TestQuestion>
          </div>

          <b-button
            size="lg"
            squared
            class="mt-4 btn-add-new"
            @click="addQuestion"
          >
            <b-icon icon="plus"></b-icon><span>Add New</span>
          </b-button>
        </b-card-body>
      </b-card>
    </div>
    <b-modal id="confirmReset" hide-header @ok="resetTest">
      <p class="my-0">Reset the entire test? This cannot be undone.</p>
    </b-modal>
  </section>
</template>

<script>
/**
 * @author Alan Morin <alan.morin@protonmail.com>
 */
import TestQuestion from "@/components/TestQuestion.vue";
import UniqueId from "@/assets/modules/uniqueId.js";
import * as Papa from "papaparse";
import { saveAs } from "file-saver";


export default {
  components: {
    TestQuestion
  },
  data() {
    return {
      mqf: [],
      mqfTitle: "",
      mqfDesc: "",
      showTakeTest: false,
      showTitles: false
    };
  },
  watch: {
    /**
     * Watched object.  Writes all updates to test
     * currently being edited to browser's local storage.
     * 
     * This is an alternative way to specify a watcher.
     * We use this to set a "deep" watch on the object, 
     * which is needced to detect changes in complex data
     * variables, such as a complex object literal
     */
    mqf: {
      deep: true,
      handler(newData) {
        localStorage.setItem("mqf", JSON.stringify(newData));
      }
    }
  },
  mounted() {
    if (localStorage.getItem("mqf")) {
      try {
        this.mqf = JSON.parse(localStorage.getItem("mqf"));
      } catch (e) {
        localStorage.removeItem("mqf");
        console.log("Local MQF storage cleared");
      }
    }
  },
  methods: {
    /**
     * Clear the form of all questions
     */
    resetTest() {
      if (localStorage.getItem("mqf")) {
        localStorage.removeItem("mqf");
        console.log("Local MQF storage cleared");
      }
      this.mqf = [];      
    },
    /**
     * Add a new empty question with
     * two blank options
     */
    addQuestion() {
      let ordinal = this.mqf.length + 1;
      this.mqf.push({
        id: UniqueId(),
        ordinal,
        question: "",
        options: ["", ""],
        correctIdx: 0
      });
    },
    /**
     * Add an option to the test
     * @param {Number} ordinal - Num (ordinal) of the test question
     */
    addOption(ordinal) {
      this.mqf[ordinal - 1].options.push("");
    },
    /**
     * Delete test question
     * @param {Number} ordinal - Num (ordinal) of the test question
     */
    deleteQuestion(ordinal) {
      console.log("delete ordinal: ", ordinal);
      let idx = ordinal - 1;
      console.log("question: ", idx);
      console.log("before: ", this.mqf);
      this.mqf.splice(idx, 1);
      console.log("after: ", this.mqf);
    },

    /**
     * Update question text (custom event method)
     * @param {object} data
     * @param {Number} data.ordinal - ordinal of question to update
     * @param {String} data.question - text to update
     */
    modifyQuestion(data) {
      // user changed the text in the question
      this.mqf[data.ordinal - 1].question = data.question;
    },

    /** 
     * Update option to a question
     * this.$set() is used so the watcher 
     * sees/tracks the change in 'mqf'
     */
    modifyOption(data) {
      this.$set(this.mqf[data.ordinal - 1].options, data.idx, data.value);
    },

    /**
     * Delete question option
     */
    deleteOption(data) {
      this.mqf[data.ordinal - 1].options.splice(data.idx, 1);
    },

    /**
     * Set/update correct answer for given question
     */
    correctAnswer(data) {
      this.$set(this.mqf[data.ordinal - 1], "correctIdx", data.idx);
    },

    /**
     * Duplicate question, using existing data
     * @param {Object} data
     * @param {number} data.ordinal - number / ordinal of current question
     * @param {string} data.question - question text to duplicate
     * @param {string[]} data.options - array of options to duplicate
     * @param {number} data.correctIdx - index of correct answer 
     */
    duplicateQuestion(data) {
      this.mqf.push({
        id: UniqueId(),
        ordinal: data.ordinal + 1,
        question: data.question,
        options: data.options,
        correctIdx: data.correctIdx
      });
    },

    /**
     * Get ordinal of question
     * Use of a method forces every update regenerate the ordinals.
     * This prevents caching
     * @param {number} idx
     * @returns {number}
     */
    getOrdinal(idx) {
      return idx + 1;
    },

    /**
     * Save test to CSV
     */
    saveCsv() {
      // convert data to CSV format:
      // ("question, opt1, opt2, opt3, opt4, opt5, opt6, ans")
      let mqfInCsv = [];
      let tempObj = {};
      let tempOpt = "";
      let tempArr = [];

      for (let entry of this.mqf) {
        tempObj.question = entry.question;

        // copy array so we can force length of 6 (avoids reactivity issues)
        // we need 6 entries to force opts 1-6 in the CSV
        tempArr = [...entry.options];
        tempArr.length = 6;

        // convert options array to individual object properties (opt1-opt6)
        for (let [idx, opt] of tempArr.entries()) {
          tempOpt = `opt${idx + 1}`;
          tempObj[tempOpt] = opt;
        }
        tempObj.ans = entry.correctIdx + 1;
        // push object onto array
        mqfInCsv.push(tempObj);
      }

      // convert to CSV
      const csv = Papa.unparse(mqfInCsv, {
        delimiter: "\t"
      });

      // Save
      const blob = new Blob([csv], { type: "text/plain;charset=utf-8" });
      saveAs(blob, "custom-test.csv");
    }
  }
};
</script>

<style scoped>
.sub-nav {
  box-sizing: border-box;
  background-color: white;
  padding: 3px;
}
.sub-nav > button {
  padding: 0 25px;
  background-color: transparent;
  border: none;
  height: 40px;
  box-sizing: inherit;
}

.sub-nav > button:hover {
  background-color: #eaeaea;
  color: #333;
}

.sub-nav > button.filled-btn {
  background-color: #008272;
  color: white;
  vertical-align: top;
  outline: 0;
  margin-right: 0.5rem;
  margin-left: 0.5rem;
}

.sub-nav > button.filled-btn:hover {
  background-color: #004b50;
}

.test-container {
  padding-left: calc(50% - 425px);
}
.max-width {
  max-width: 850px;
}

.btn-add-new {
  background-color: #008272;
  font-size: 20px;
}

.btn-add-new:hover {
  background-color: #004b50;
}
</style>
