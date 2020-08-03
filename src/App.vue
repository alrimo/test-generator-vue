<template class="bg-light">
  <div id="app">
    <b-navbar
      type="dark"
      variant="dark"
      :sticky=true
    >
      <b-navbar-brand>Test Generator</b-navbar-brand>
      <b-navbar-nav>
        <b-nav-item @click="goHome">
          Home
        </b-nav-item>
        <b-nav-item>Create</b-nav-item>
      </b-navbar-nav>

    </b-navbar>

    <router-view></router-view>
  </div>

</template>

<script>

export default {
  name: "App",
  methods: {
    goHome() {
      this.$router.push({ name: "Home"});
    }
  }

};

</script>

<style lang="scss">
#app {
  //font-family: "Segoe UI Web (West European)','Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue',sans-serif";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  //color: #2c3e50;
  color: #323130;
}

html,body {
  background-color: #f8f9fa !important;
}

</style>
