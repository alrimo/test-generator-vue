<template>
  <section id="container">
    <div class="d-flex justify-content-center align-items-center flex-column">
      <h2 class="h2-responsive">{{ resultTitle }}</h2>
      <h4 class="h4-responsive">Your Score</h4>
      <p>{{ score }}%</p>
      <h4 class="h4-responsive">Minimum Passing</h4>
      <p>{{ $minPassing }}%</p>
    </div>

    <div>
      <b-button
        variant="primary"
        v-if="passedTest"
        :disabled="!passedTest"
        class="mt-1 w-100"
        @click="generatePdf"
      >
        Print Certificate
      </b-button>
    </div>
    <!--
        <iframe :src=pdfOutput width="960" height="720">
            This browser does not support the display of PDFs
        </iframe>
        -->
  </section>
</template>

<script>
import * as jsPDF from "jspdf";

export default {
  data() {
    return {
      output: null,
      resultTitle: "Default Title"
    };
  },
  computed: {
    pdfOutput() {
      return this.output;
    },
    passedTest() {
      // returns: bool
      return this.$route.params.passedTest;
    },
    score() {
      // students score (percentage %)
      return this.$route.params.score;
    }
  },
  methods: {
    generatePdf() {
      let doc = new jsPDF({
        orientation: "landscape",
        format: "letter",
        unit: "px"
      });
      doc.setDisplayMode(1);
      let imgPath = require("@/assets/img/certificate-template.jpg");
      var img = new Image();
      img.src = imgPath;

      const [day, month, year] = this.getDateArr();

      // text
      doc.setFontType("italic");
      doc.addImage(img, "JPEG", 0, 0);
      doc.setFontSize(26);
      const name = this.$studentName;
      let offset = this.xOffset(doc, name);
      doc.text(offset, 192, name);

      let courseName = this.$testName;
      offset = this.xOffset(doc, courseName);
      doc.text(offset, 270, courseName);

      doc.setFont("times");
      doc.setFontSize(20);
      doc.setFontType("normal");

      let dateText =
        "Conferred on this " + day + " of " + month + " in the year " + year;
      offset = this.xOffset(doc, dateText);

      doc.text(offset, 313, dateText);

      //this.output = doc.output('bloburl');
      const fileName = `${this.studentName} Certificate.pdf`;
      doc.save(fileName);
    },
    xOffset(doc, text) {
      return (
        doc.internal.pageSize.width / 2 -
        (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) / 2
      );
    },
    getDateArr() {
      const d = new Date();
      let months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];

      return [d.getDate(), months[d.getMonth()], d.getFullYear()];
    },
    setupPage() {
      if (this.passedTest) {
        this.resultTitle = "Congratulations, you passed!";
      } else {
        this.resultTitle = "Sorry, you did not pass";
      }
    }
  },
  mounted() {
    //this.generatePdf();\
    this.setupPage();
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
</style>
