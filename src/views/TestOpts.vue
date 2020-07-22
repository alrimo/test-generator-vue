<template>
	<div>


		<b-container>
			<b-row align-h="center" class="text-center">
				<b-col>
					<h1>Options Page</h1>
					<div><p>{{testId}}</p></div>
				</b-col>
			</b-row>
			<b-row>
				<b-col cols="6" offset="3">
					<b-form
						id="formOptions" 
						@submit.prevent="onSubmit"
					>
						
						<b-form-group
							id="group-num-q"
							label="Questions"
							label-for="dd-num-q"
							description="Select desired number of questions"
							class="font-weight-bold"
						>
							<b-form-select
								id="dd-num-q"
								v-model="form.numQSelected"
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
								v-model="form.minPass"
								min="1"
								max="100"
							/>

						</b-form-group>
						<b-button 
							type="submit" 
							variant="primary"
							:disabled="submitDisabled"
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
				testId: this.$route.params.testId,				
				form: {
					numQSelected: null,
					minPass: 75
				},
				questions: []
			}
		},
		computed: {
			numQ() {
				return this.$testData.length;
			},
			numQOpts() {
				let opts = []
				opts.push( { value: null, text: 'Please select an option' } ) 
				
				//console.log(this.$testData);

				let val = null;
				for(let i=0; i < this.numQ; i++) {
					val = i + 1;
					opts.push( { value: val, text: val.toString() } )
				}

				return opts;
			},
			submitDisabled() {
				return this.form.numQSelected == null;
			}

		},
		methods: {
			onSubmit() {
				this.$router.push(
					{ 
						name: 'test', 
						params: 
							{ 
								numQ: this.form.numQSelected, 
								minPassing: this.form.minPass, 
								testId: this.testId,
								studentName: this.$route.params.studentName
							} 
					}
				);
			}
		}


	}

</script>
