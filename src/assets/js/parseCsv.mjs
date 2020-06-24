import Papa from "papaparse";

export default function() {
	Papa.parse("@/assets/data/c-130.txt", { 
		header: true,
		download: true,
		delimiter: "\t",
		skipEmptyLines: 'greedy',
		before: function(file, inputElem){ console.log('Attempting to Parse...', file)},
		error: function(err, file, inputElem, reason){ console.log(err); },
		complete: function(results, file) {
			console.log("Finished: ", results, file);
		}

	});
}
