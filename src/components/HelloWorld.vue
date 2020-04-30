<template>
  <div class="hello">
    <h1></h1>
    <h2>API DEMOS</h2>
    <ul>
      <li>
        <button @click="getBills">getBills</button>
      </li>
    </ul>
  </div>
</template>

<script>
import BXAPI from "../bxapi/api";

export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      BXAPI
    };
  },
  methods: {
    getBills() {
      this.BXAPI.getBills({ page: 1 }, (code, data) => {
        console.log(code, data);
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
button {
  padding: 10px 20px;
  font-size: 14px;
  border: 1px solid #999;
  background: #fafafa;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  border-radius: 5px;
}
</style>
