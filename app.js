const yargs = require('yargs');
const axios = require('axios');


const argv = yargs
	.options({
		a: {
			demand: true,
			alias: 'address',
			describe: 'Address to fetch weather for',
			string: true
		}
	})
	.help()
	.alias('help', 'h')
	.argv;


var encodedAddress = encodeURIComponent(argv.address);
var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

axios.get(geocodeUrl).then((response) => {
	if (response.data.status === 'ZERO_RESULTS') {
		throw new Error ('Address not found.');
	}
	var latitude = response.data.results[0].geometry.location.lat;
	var	longitude = response.data.results[0].geometry.location.lng;
	var apiKey = 'YOURKEY';	
	var	weatherUrl = `https://api.forecast.io/forecast/${apiKey}/${latitude},${longitude}`;
	console.log(response.data.results[0].formatted_address);
	return axios.get(weatherUrl);
}).then((response) => {
	var temperature = response.data.currently.temperature.toFixed(0);
  	var apparentTemperature = response.data.currently.apparentTemperature.toFixed(0);
  	var tC = ((temperature-32)*5/9).toFixed(0);
  	var atC = ((apparentTemperature-32)*5/9).toFixed(0);
  	console.log(`It's currently ${temperature}°F / ${tC}°C. It feels like ${apparentTemperature}°F / ${atC}°C.`);
}).catch((error) => {
	if (error.code === 'ENOTFOUND') {
		console.log('Unable to connect to API servers.')
	} else {
		console.log(error.message);
	}	
});

