<template>
  <div class="home mt-3">
  	<b-container>
  		<b-row align-h="center">
    		<b-col>
    			<Jumbotron />  			
    		</b-col>
  		</b-row>
  		<b-row align-h="center">
  			<b-col>
  				<h1 class="display-4">Pre-built MQFs</h1>
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
  	</b-container>
  </div>
</template>

<script>
import Jumbotron from "@/views/Jumbotron.vue";

export default {
  name: "Home",
  components: {
    Jumbotron
  },
  data() {
  	return {
	  	buttons: [
	  		{variant: "primary", text: "C-130", val: "c-130"},
	  		{variant: "secondary", text: "C-17", val: "c-17"},
	  		{variant: "success", text: "C-5", val: "c-5"},
	  		{variant: "danger", text: "KC-10", val: "kc-10"},
	  		{variant: "warning", text: "KC-135", val: "kc-135"},
	  		{variant: "info", text: "VIP/SAM", val: "vip-sam"},
	  	]
	  }
  },
  methods: {
    loadAndGo(buttonVal) {
      // load the data file
      import(`@/assets/data/${buttonVal}.csv`)
      .then( ({default: data}) => { 
        // push question file (csv) data to global var
		this.$testData = data;
		// push testId to global var
		this.$testId = buttonVal;
        // route to next test options page
        this.$router.push({ name: 'studentName'});
      })
      .catch( error => console.log(error));
    }
  }
};
</script>
