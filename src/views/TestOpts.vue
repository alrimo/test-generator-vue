<template>
  <div>
    <b-container>
      <b-row align-h="center" class="text-center">
        <b-col>
          <h1>Options Page</h1>
          <div>
            <p>{{ $testId }}</p>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="6" offset="3">
          <b-form id="formOptions" @submit.prevent="onSubmit">
            <b-form-group
              v-if="versionsExist"
              id="group-versions"
              label="Test Version"
              label-for="dd-versions"
              description="Select test version"
              class="font-weight-bold"
            >
              <b-form-select
                id="dd-versions"
                v-model="selectedVersion"
                :options="versionOpts"
                @input="handleVersionSelect"
              ></b-form-select>
            </b-form-group>

            <b-form-group
              v-if="selectedVersion == null"
              id="group-num-q"
              label="Questions"
              label-for="dd-num-q"
              description="Select desired number of questions"
              class="font-weight-bold"
            >
              <b-form-select
                id="dd-num-q"
                v-model="$numRandQuestions"
                :options="numQOpts"
                required
              ></b-form-select>
            </b-form-group>

            <b-form-group
              id="group-min-passing"
              label="Minimum Passing"
              label-for="spin-min-passing"
              description="Selection minimum passing score"
              class="font-weight-bold"
            >
              <b-form-spinbutton
                id="spin-min-passing"
                v-model="$minPassing"
                min="1"
                max="100"
              />
            </b-form-group>
            <b-button type="submit" variant="primary" :disabled="submitDisabled"
              >Submit</b-button
            >
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      questions: [],
      versions: [],
      selectedVersion: null
    };
  },
  computed: {
    versionOpts() {
      // Options for "Test Version" select box
      // returns: array of value/text objects
      let opts = [];
      opts.push({ value: null, text: "No Version" });

      for (let v of this.versions) {
        opts.push({ value: v, text: v });
      }

      return opts;
    },
    versionsExist() {
      return this.versions.length > 0;
    },
    numQ() {
      return this.$testData.length;
    },
    numQOpts() {
      // Options for "Questions" select box
      // returns: array of value/text objects
      let opts = [];
      opts.push({ value: null, text: "None Selected" });

      let val = null;
      for (let i = 0; i < this.$testLength; i++) {
        val = i + 1;
        opts.push({ value: val, text: val.toString() });
      }

      return opts;
    },
    submitDisabled() {
      let disabled = true;
      if (this.selectedVersion != null) {
        disabled = false;
      } else if (this.$numRandQuestions != null) {
        disabled = false;
      }

      return disabled;
    }
  },
  methods: {
    onSubmit() {
      this.$router.push({
        name: "test",
        params: { testVersion: this.selectedVersion }
      });
    },
    handleVersions() {
      // if versions exist, collect them up and
      // add drop-down
      if (
        this.$testData &&
        Object.prototype.hasOwnProperty.call(this.$testData[0], "version")
      ) {
        // data exists and the property "version" exists
        // on at least the 1st object in the array

        // Now we cycle through all the questions, collecting
        // up how many unique versions there are

        if (this.$debug) {
          console.log("Test versions detected");
        }

        let vers = "";
        for (let q of this.$testData) {
          vers = q.version.toUpperCase();
          if (vers != "" && !this.versions.includes(vers)) {
            this.versions.push(vers);
          }
        }

        // sort alphabetically
        this.versions.sort();
      }

      if (this.$debug) {
        console.log(this.versions);
      }
    },
    handleVersionSelect(val) {
      // Reset number of random questions if
      // user happened to select before choosing
      // a version
      if (this.$debug) {
        console.log("Version Select Value: ", val);
      }

      if (val != null) {
        this.$numRandQuestions = null;
      }
    }
  },
  mounted() {
    this.handleVersions();
  }
};
</script>
