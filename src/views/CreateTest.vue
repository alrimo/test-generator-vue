<template>
    <section>
      <div class="test-container">
        <b-card class="shadow-sm mt-3 max-width">
          <b-card-body>
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
    </section>
</template>

<script>

import TestQuestion from "@/components/TestQuestion.vue";
import UniqueId from "@/assets/modules/uniqueId.js";


export default {
  components: {
    TestQuestion
  },
  data() {
    return {
      mqf: []
    }
  },
  watch: {
    mqf: {
      // - alternative way to specify a watcher
      // - we use this to set a "deep" watch on the object
      // - this is needed to detect changes in complex data vars
      deep: true,
      handler(newData) {
        localStorage.setItem('mqf', JSON.stringify(newData));
      }
    }
  },
  mounted() {
    if(localStorage.getItem('mqf')) {
      try {
        this.mqf = JSON.parse(localStorage.getItem('mqf'));
      } catch(e) {
        localStorage.removeItem('mqf');
        console.log("Local MQF storage cleared");
      }
    }
  },
  methods: {
    addQuestion() {
      let ordinal = this.mqf.length + 1;
      this.mqf.push(
        { 
          id: UniqueId(),
          ordinal,
          question: "",
          options: ["", ""],
          correctIdx: 0
        }
      );
    },
    addOption(ordinal) {
      // user added an option, update mqf
      this.mqf[ordinal - 1].options.push("");
    },
    deleteQuestion(ordinal) {
      console.log("delete ordinal: ", ordinal);
      let idx = ordinal - 1;
      console.log("question: ", idx);
      console.log("before: ", this.mqf);
      this.mqf.splice(idx, 1);
      console.log("after: ", this.mqf);
      
    },
    modifyQuestion(data) {
      // user changed the text in the question
      this.mqf[data.ordinal - 1].question = data.question;
    },
    modifyOption(data) {
      // - user changed the text in an option
      // - this.$set() is used to force reactivity, 
      //   (i.e., the watcher sees/tracks the change in 'mqf')
      this.$set(this.mqf[data.ordinal - 1].options, data.idx, data.value);
    },
    deleteOption(data) {
      //console.log("inside deleteOption()");
      this.mqf[data.ordinal - 1].options.splice(data.idx, 1);
    },
    correctAnswer(data) {
      // User selected radio button for correct answer
      this.$set(this.mqf[data.ordinal - 1], 'correctIdx', data.idx);
    },
    duplicateQuestion(data) {
      /*  inputs: "data" (object)
          properties: {ordinal(int), question(str), options(arr), correctIdx(int)}
      */
      this.mqf.push(
        {
          id: UniqueId(),
          ordinal: data.ordinal + 1,
          question: data.question,
          options: data.options,
          correctIdx: data.correctIdx
        }
      );
    },
    getOrdinal(idx) {
      // using a method to make every update regenerate the ordinals.
      // if we use the index in the template, the ordinal doesn't 
      // change when we add or delete test questions
      return idx + 1;
    }
  }
}
</script>

<style scoped>
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
    background-color: #004B50;
  }

</style>