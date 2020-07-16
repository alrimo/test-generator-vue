export function getCsvData(fileName, callback) {
	let path="@/assets/data/${fileName}.csv";
	import (path)
	.then( data => {
		return callback(data);
	})
}