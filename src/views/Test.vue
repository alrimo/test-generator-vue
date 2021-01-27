<template>
  <section id="testArea">
    <b-container>
      <b-row align-h="center">
        <b-col lg="6" class="p-0 mt-5">
          <b-card>
            <b-card-header id="cardHeader" class="text-center">
              <h3>Question {{ pagination.currentPage }}</h3>
            </b-card-header>

            <b-card-body>
              <h3>{{ currentQ.question }}</h3>
              <b-list-group
                v-for="(option, index) in currentQ.options"
                :key="index"
                @click.prevent="selectedAnswer(index)"
              >
                <b-list-group-item
                  v-if="option !== ''"
                  :class="selectedClass(index)"
                >
                  <p>{{ option }}</p>
                </b-list-group-item>
              </b-list-group>
            </b-card-body>

            <b-card-footer footer-tag="nav">
              <b-pagination
                v-model="pagination.currentPage"
                :total-rows="totalRows"
                :per-page="pagination.perPage"
                @input="paginate(pagination.currentPage)"
              ></b-pagination>

              <b-button v-b-modal.submit-test>Finish</b-button>
            </b-card-footer>
          </b-card>
        </b-col>
      </b-row>
    </b-container>

    <b-modal id="submit-test" :hide-header="true" @ok="submitTest">
      <h3>Sumbit Test?</h3>
      <div v-if="allAnswered() == false">
        Are you sure? You haven't answered all the questions.
      </div>
    </b-modal>
  </section>
</template>

<script>
import commonFunctions from "@/mixins/commonFunctions.js";

export default {
  mixins: [commonFunctions],
  data() {
    return {
      pagination: {
        currentPage: 1,
        perPage: 1,
      },
    };
  },
  computed: {
    selectedIndex() {
      return this.$questionBank[this.pagination.currentPage - 1].selectedIndex;
    },
    testVersion() {
      return this.$route.params.testVersion;
    },
    totalRows() {
      return this.$questionBank.length;
    },
    currentQ() {
      return this.$questionBank[this.pagination.currentPage - 1] || "";
    },
  },
  methods: {
    initVersions() {
      /*  Desc: User selected a test version
            Approach: pull out all questions w/ that version number,
                      and then pass to constructQuestionBank() 
        */
      let Qs = [];
      for (let [idx, q] of this.$testData.entries()) {
        if (q.version.toUpperCase() == this.testVersion) {
          console.log("idx: ", idx);
          console.log("q: ", q);
          Qs.push(idx);
        }
      }

      if (this.$debug) {
        console.log("Version Questions:", Qs);
      }

      this.constructQuestionBank(Qs);
    },
    initRandomized() {
      /* Desc: randomly select questions from question file */

      // array w/ sequential numbers - same length as question file
      let randQuestions = [];
      for (let i = 0; i < this.$testLength; i++) {
        randQuestions.push(i);
      }

      // Shuffle array then truncate to # of user-selected questions
      // These are the indices of our random questions in the question file
      this.shuffleArray(randQuestions);
      randQuestions.length = this.$numRandQuestions || randQuestions.length; //select all questions if a number of random questions wasn't supplied
      if (this.$debug) {
        console.log("Random Questions", randQuestions);
      }

      // set to global so we can access later (i.e., if user re-takes the test we can regenerate the same questions)
      this.$randomQuestions = randQuestions;

      // construct the question bank
      this.constructQuestionBank(randQuestions);
    },
    constructQuestionBank(questions) {
      // init questionBank by copying over the questions from the question file
      this.$questionBank = []; //reset questionbank if already has data
      for (let value of questions) {
        this.$questionBank.push({
          selectedIndex: -1, // user's selected answer (index)
          questionIdx: value, // index of the question in the question file (csv)
          correctAnswer: parseInt(this.$testData[value].ans),
          question: this.$testData[value].question,
          ansIsCorrect: null,
          options: {
            // hard-coding 6 (max) answer options
            0: this.$testData[value].opt1,
            1: this.$testData[value].opt2,
            2: this.$testData[value].opt3,
            3: this.$testData[value].opt4,
            4: this.$testData[value].opt5,
            5: this.$testData[value].opt6,
          },
        });
      }
      if (this.$debug) {
        console.log(this.$questionBank);
      }
    },
    paginate(page) {
      console.log("page:", page);
      //let idx = this.questionBank[this.pagination.currentPage-1].questionIdx;
    },
    selectedAnswer(index) {
      this.$questionBank[this.pagination.currentPage - 1].selectedIndex = index;
    },
    selectedClass(index) {
      let cls = "";
      if (this.selectedIndex === index) {
        cls = "selected";
      }
      return cls;
    },
    allAnswered() {
      // returns true if all questions have been answered
      for (const question of this.$questionBank) {
        if (question.selectedIndex == -1) {
          return false;
        }
      }
      return true;
    },
    submitTest() {
      // Correct the test
      let numCorrect = 0;
      for (const question of this.$questionBank) {
        if (parseInt(question.selectedIndex) == question.correctAnswer - 1) {
          // -1 is needed because the indexes are 0 based but the CSV
          // asks for which question number (opt1, opt2, etc).
          question.ansIsCorrect = true;
          numCorrect += 1;
        } else {
          question.ansIsCorrect = false;
        }
      }

      // Calculate if passed test
      let score = 0;
      if (numCorrect > 0) {
        score = Math.floor((numCorrect / this.totalRows) * 100);
      }
      const passedTest = score >= this.$minPassing;
      if (this.$debug) {
        console.log("min passing: ", this.$minPassing);
        console.log("student score %: ", score);
        console.log("Passed:", passedTest);
        console.log("num correct: ", numCorrect);
        console.log("question bank: ", this.$questionBank);
      }
      //let testVer = this.testVersion;
      this.$router.push({
        name: "results",
        params: { passedTest, score, testVersion: this.testVersion },
      });
    },
  },
  mounted() {
    if (this.testVersion != null) {
      // user selected a test version
      this.initVersions();
    } else if (this.$randomQuestions != null) {
      // Reset test questions since user is re-taking the same test
      // This means looping through $questionBank and setting
      // "ansIsCorrect" to null and "selectedIndex" to -1
      for (let itm of this.$questionBank) {
        if (this.$debug) {
          console.log(itm);
        }
        itm.ansIsCorrect = null;
        itm.selectedIndex = -1;
      }
    } else {
      // user isn't taking a versioned test or re-taking an existing one:
      // generate randomize test - this assumes user selected number of
      // questions to randomize on TestOps.vue (Test Options Page)
      this.initRandomized();
    }
  },
};
</script>

<style scoped>
.list-group-item:hover {
  background: #eee;
  cursor: pointer;
}

.selected {
  background-color: yellow;
}

.selected:hover {
  background-color: yellow;
}
</style>
