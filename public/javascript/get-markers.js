// let getMarkers = () => {
// 	const response = fetch("/api/places")
// 		.then((response) => response.json())
// 		.then((res) => {
// 			let markers = res;
// 			for (i = 0; i < markers.length; i++) {
// 				let latitude = Number(markers[i].latitude);
// 				let longitude = Number(markers[i].longitude);
// 				console.log(typeof latitude, typeof longitude);
// 				var marker = new google.maps.Marker({
// 					position: {
// 						lat: latitude,
// 						lng: longitude,
// 					},
// 					map: map,
// 				});
// 			}
// 		});
// };

// if (map) {
// 	getMarkers();
// }
