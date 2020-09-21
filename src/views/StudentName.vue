<template>
  <section id="container">
    <div id="centered">
      <h1 class="h1-responsive">Please Enter Your Name</h1>
      <b-form id="formName" @submit.prevent="onSubmit">
        <b-form-input
          v-model="$v.studentName.$model"
          type="text"
          placeholder="Enter your name"
          :state="validateState()"
        >
        </b-form-input>
        <b-form-invalid-feedback>
          Field is required and must be at least 4 characters
        </b-form-invalid-feedback>
        <b-button
          type="submit"
          :variant="setBtnVariant()"
          :disabled="studentName == ''"
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
import {required, minLength } from 'vuelidate/lib/validators';

export default {
  validations: {
    studentName: {
      required,
      minLength: minLength(4)
    }
  },
  methods: {
    onSubmit() {
      this.$router.push({ name: "TestOptions" });
    },
    setBtnVariant() {
      return this.studentName == "" ? "secondary" : "primary";
    },
    validateState(){
      const { $dirty, $error } = this.$v.studentName;
      return $dirty ? !$error : null;
    }
  }
};
</script>

<style scoped>
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
