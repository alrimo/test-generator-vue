<template>
    <section>

       
        <iframe :src=pdfOutput width="960" height="720">
            This browser does not support the display of PDFs
        </iframe>
           


    </section>
</template>

<script>

import * as jsPDF from 'jspdf';

export default {
    data() {
        return {
            output: null
        }
    },
    computed: {
        pdfOutput() {
            return this.output;
        },
        studentName() {
            // returns: string
            return this.$route.params.studentName || "None Supplied";
        },
        passedTest() {
            // returns: bool
            return this.$route.params.passedTest;
        },
        testName() {
            // returns: string
            return this.$route.params.testName || "None Supplied";
        }
    },
    methods: {
        generatePdf() {
            let doc = new jsPDF({
                orientation: 'landscape',
                format: "letter",
                unit: "px"

            });
            doc.setDisplayMode(1);
            let imgPath=require("@/assets/img/certificate-template.jpg");
            var img = new Image();
            img.src=imgPath;
            
            const [day, month, year] = this.getDateArr();


            // text
            doc.setFontType("italic");
            doc.addImage(img, "JPEG", 0, 0);
            doc.setFontSize(26);
            const name = this.$route.params.studentName;
            let offset = this.xOffset(doc, name);
            doc.text(offset, 192, name);

            let courseName = this.testName;
            offset = this.xOffset(doc, courseName);
            doc.text(offset, 270, courseName);

            doc.setFont("times");
            doc.setFontSize(20);
            doc.setFontType("normal");
            

            let dateText = "Conferred on this " + day + " of " + month + " in the year " + year; 
            offset = this.xOffset(doc, dateText);

            doc.text(offset + 20, 313, dateText);

            this.output = doc.output('bloburl');
        },
        xOffset(doc, text) {
            return (doc.internal.pageSize.width / 2) - (doc.getStringUnitWidth(text) * doc.internal.getFontSize() / 2); 
        },
        getDateArr(){
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
            ]

            return [d.getDay(), months[d.getMonth()], d.getFullYear()];
        }
    },
    mounted() {
        this.generatePdf();
    }
}
</script>

<style>

</style>