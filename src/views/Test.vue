<template>
	<section id="testArea">
		<b-container>
			<b-row align-h="center">
				<b-col lg="6" class="p-0 mt-5">
					<b-card>
						
						<b-card-header id="cardHeader" class="text-center">
							<h3>Question {{ currentQ.questionIdx }}</h3>
						</b-card-header>
						
						<b-card-body>
							<h3></h3>
							<b-list-group
								v-for="(option, index) in currentQ.options" 
								:key="index"
								@click.prevent="selectedAnswer(index)"
							>
								<b-list-group-item 
									v-if="option !== '' "
									:class="[selectedIndex === index ? 'selected' : '' ]"
								>
									<p>{{ option }}</p>
								</b-list-group-item>
							</b-list-group>
						</b-card-body>


						<b-card-footer footer-tag="nav">
							

							<b-pagination
								v-model="pagination.currentPage"
								:total-rows="numQ"
								:per-page="pagination.perPage"
								@input="paginate(pagination.currentPage)"
							></b-pagination>

							<p class="mt-3">Current Page: {{ pagination.currentPage }}</p>


						</b-card-footer>

					</b-card>

				</b-col>
			</b-row>
		</b-container>
		

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
					perPage: 1
				},
				questionBank: []
			}
		},
		computed: {
			selectedIndex() {
				return this.questionBank[this.pagination.currentPage-1].selectedIndex
			},
			numQ() {
				return this.$route.params.numQ || "";
			},
			minPassing() {
				return this.$route.params.minPassing || "";
			},
			testId() {
				return this.$route.params.testId || "";
			},
			currentQ() {
				return this.questionBank[this.pagination.currentPage-1] || "";
			}
		},
		methods: {
			init() {
				/* Desc: randomly select questions from question file */
				
				// array w/ sequential numbers - same length as question file 
				let randQuestions = [];
				for(let i=0; i < this.$testLength; i++) {
					randQuestions.push(i);
				}
				
				// Shuffle array then truncate to # of user-selected questions
				// These are the indices of our random questions in the question file
				this.shuffleArray(randQuestions);
				randQuestions.length = this.numQ;

				// init questionBank by copying over the questions from the question file
				for(let value of randQuestions) {
					this.questionBank.push(
						{ 
							selectedIndex: -1, 	// user's selected answer (index)
							questionIdx: value,	// index of the question in the question file (csv)
							correctAnswer: this.$testData[value].ans,
							question: this.$testData[value].question,
							options: {	// hard-coding 6 (max) answer options
								0: this.$testData[value].opt1,
								1: this.$testData[value].opt2,
								2: this.$testData[value].opt3,
								3: this.$testData[value].opt4,
								4: this.$testData[value].opt5,
								5: this.$testData[value].opt6
							}
						}
					);
				}
			},  // end methods()
			paginate(page) {
				console.log("page:", page);
				//let idx = this.questionBank[this.pagination.currentPage-1].questionIdx;
				

			},
			selectedAnswer(index) {
				console.log("selected answer: ", index);
				this.questionBank[this.pagination.currentPage-1].selectedIndex = index;
			}
		},
		mounted() {
			this.init();

		}

	}

</script>

<style scoped>
	.list-group-item:hover {
		background: #eee;
		cursor: pointer;
	}

	.selected {
		background-color: yellow;
	}




</style>