const StreamArray = require( 'stream-json/streamers/StreamArray');
const fs = require('fs');

const jsonParser = StreamArray.withParser();

fs.createReadStream('input.json').pipe(jsonParser.input);

jsonParser.on('data', ({key, value}) => {
  if(value.WeightKg == 0 || value.HeightCm == 0) {
    console.log(key, "Incorrect values")
  }
  else {
    const HeightM = value.HeightCm / 100;
    const bmi = Math.round((value.WeightKg / (HeightM * HeightM)) * 100) / 100;
    console.log(key, value.Gender, value.HeightCm, value.WeightKg, bmi);
  }
});

jsonParser.on('end', () => {
    console.log('Completed parsing file');
});