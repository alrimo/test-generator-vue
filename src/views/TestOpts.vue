<template>
	<div>


		<b-container>
			<b-row align-h="center" class="text-center">
				<b-col>
					<h1>Options Page</h1>
					<div><p>{{x}}</p></div>
				</b-col>
			</b-row>
			<b-row>
				<b-col cols="6" offset="3">
					<b-form @submit.prevent="onSubmit">
						
						<b-form-group
							id="group-num-q"
							label="Questions"
							label-for="dd-num-q"
							description="Select desired number of questions"
						>
							<b-form-select
								id="dd-num-q"
								v-model="form.numQ"
								:options="questions"
								required
							></b-form-select>
						</b-form-group>

						<b-form-group
							id="group-min-passing"
							label="Minimum Passing"
							label-for="spin-min-passing"
							description="Selection minimum passing score"
						>
							<b-form-spinbutton
								id="spin-min-passing"
								v-model="form.minPass"
								min="1"
								max="100"
							/>

						</b-form-group>
						<b-button 
							type="submit" 
							variant="primary"
							:disabled="form.validated === false"
						>Submit</b-button>

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
				x: this.$route.params.testId,
				form: {
					numQ: null,
					minPass: 75,
					validated: false
				},
				questions: [{ text: "Select One", value: null }]
			}
		},
		created() {
			console.log("TestOpt.vue created");
			
		}

	}

</script>