<template>
 <section id="container">
    <div id="centered"> 
        <h1 class="h1-responsive">Please Enter Name of Custom Test</h1>
        <b-form 
            id="formName"
            @submit.prevent="onSubmit"
        >

            <b-form-input
                v-model="$testName"
                type="text"
                placeholder="Enter test name"
            >
            </b-form-input>
            <b-button
                type="submit"
                :variant="setBtnVariant()"
                :disabled="$testName == ''"
                block
                size="sm"
                class="mt-1"
            >Submit
            </b-button>

        </b-form>
     </div>
  </section>
</template>

<script>
export default {
    methods: {
        onSubmit() {
            this.$router.push({ name: 'studentName' });
        },
        setBtnVariant() {
            return (this.$testName == '') ? "secondary" : "primary";
        }
    }
}
</script>

<style>

    #container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }

    .h1-responsive {
        font-size: calc(16px + 1.5vw);
    }


</style>