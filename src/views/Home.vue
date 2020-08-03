<template>
  <div class="home mt-3">
  	<b-container>
      <b-container>
        <b-row align-h="center">
          <b-col class="d-flex flex-column align-items-center">
            <h1 class="display-4 text center">Pre-built MQFs</h1>
            <b-button-group>
              <b-button 
                v-for="button in buttons" 
                :key="button.val"
                :variant="button.variant"
                @click="loadAndGo(button.val)"
                >
                {{button.text}}
              </b-button>
            </b-button-group>
          </b-col>
        </b-row>
        <b-row align-h="center">
          <b-col>
            <h1 class="display-4 text-center mt-5 mb-3">Custom Upload</h1>
            <b-row id="drop-area" align-h="center">
              <b-col cols="6">
                <b-form-file
                  v-model="file"
                  :state="Boolean(file)"
                  placeholder="Choose a file or drop it here..."
                  drop-placeholder="Drop file here..."
                  accept=".csv, .txt"
                  @input="handleUpload"
                >

                </b-form-file>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>

      <div class="justify-content-center row justify-content-center mt-5 pb-5">
        <div class="col-lg-10 row justify-content-center">	
          <div>
            <div class="py-3 text-center">
              <h2 class="display-5">Custom Upload Instructions</h2>
              <a id="instrToggle" v-b-toggle.instrCollapse class="row justify-content-center text-center">									
                  <p class="h3"> <b-icon icon="arrow-down-circle-fill" class="hover-pointer"></b-icon></p>
              </a>
            </div>

            <b-collapse id="instrCollapse">
              <div class="card">
                <h3 class="card-header bg-info text-white">Step One</h3>
                <div class="card-body">
                  <h5 class="mb-1">Create question file in Excel</h5>
                  <span class="d-block"><b>Note:</b> The "version" column is only required if using test versions (see below)</span>
                  <span class="d-block"><b>Note 2:</b> Blank answers are OK ("see opt6, below")</span>
                  <span class="d-block mb-2"><b>Note 3:</b> The "ans" column is the number of the correct "opt"</span>
                  <img src="@/assets/img/template-example-2.jpg" class="img-fluid">
                  <h5 class="my-4 ml-2">- OR - </h5>
                  <h5 class="mb-1">Use a template</h5>
                  <a 
                    :href="`${publicPath}template/template.csv`"
                    class="btn btn-secondary btn-sm py-0 ml-2"
                    download
                  >
                    Get Template
                  </a>
                  <span class="d-block mt-2"><b>Import into Excel</b></span>
                  <ol>
                    <li>Open blank workbook</li>
                    <li>Click Data-->From Text</li>
                    <li>Find CSV</li>
                    <li>It should auto-detect the options, so just hit ENTER </li>
                  </ol>
                </div>
              </div>
              <div class="card">
                <h3 class="card-header bg-info text-white">Step Two</h3>
                <div class="card-body">
                  <h5>"Save as" tab-delmited text file </h5>
                  <img src="@/assets/img/template-example-save.jpg" class="img-fluid">
                </div>
              </div>							
              <div class="card">
                <h3 class="card-header bg-info text-white">Step Three</h3>
                <div class="card-body">
                  <h5>Drag onto drop-zone (above)</h5>
                </div>
              </div>
              <div class="card">
                <h3 class="card-header bg-warning text-white">Feature: Using Test Versions</h3>
                <div class="card-body">
                  <h6>Test versions allow you to have different versions of your test ("a", "b", "c"...)</h6>
                  <h6>Usage Notes</h6>
                  <ul>
                    <li>Versions are optional</li>
                    <li>Not every question needs a version (blank if not needed)</li>										
                    <li>ALL versioned questions will be tested (within the selected version)</li>
                    <li>No randomization available</li>
                  </ul>
                </div>
              </div>							
            </b-collapse> <!-- end collapse -->


          </div>
        </div>
      </div>

  	</b-container>





  </div>
</template>

<script>
import * as Papa from 'papaparse';

export default {
  name: "Home",
  data() {
  	return {
	  	buttons: [
	  		{variant: "primary", text: "C-130", val: "c-130"},
	  		{variant: "secondary", text: "C-17", val: "c-17"},
	  		{variant: "success", text: "C-5", val: "c-5"},
	  		{variant: "danger", text: "KC-10", val: "kc-10"},
	  		{variant: "warning", text: "KC-135", val: "kc-135"},
	  		{variant: "info", text: "VIP/SAM", val: "vip-sam"},
		  ],
      file: null,
      publicPath: process.env.BASE_URL

	  }
  },
  methods: {
    handleUpload(){
      //console.log("File:", this.file);
      

      Papa.parse(this.file, {
        skipEmptyLines: "greedy",
        delimiter: "\t",
        header: true,
        complete: (results) => { 
           //arrow function required here (anonymous function creates a new scope for "this")
          
          // debug
          if(this.$debug) { 
            console.log(results); 
            console.log("this: ", this);
          }
          this.parseAndGo(results);
        }
      });
      


    },
    parseAndGo(data) {
      this.$testData = data.data;
      this.$testId = this.file.name;
      this.$router.push({ name: 'testName' });
    },
    loadAndGo(buttonVal) {
      // load the data file
      import(`@/assets/data/${buttonVal}.csv`)
      .then( ({default: data}) => { 
        // push question file (csv) data to global var
        this.$testData = data;
        // push testId to global var
        this.$testId = buttonVal;
        // set test name
        this.$testName = `${this.$testId.toUpperCase()} Standardized MQF`
        // route to next test options page
        this.$router.push({ name: 'studentName'});
      })
      .catch( error => console.log(error));
    }
  }
};
</script>

<style scoped>
  .hover-pointer:hover {
    cursor: pointer;
  }

  #instrCollapse .card {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

</style>
