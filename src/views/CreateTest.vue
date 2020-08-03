<template>
    <section>

    </section>
  
</template>

<script>
export default {
    data() {
        return {
          mqf: null
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
    }
}
</script>

<style>

</style>