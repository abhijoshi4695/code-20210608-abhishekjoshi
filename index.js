const StreamArray = require( 'stream-json/streamers/StreamArray');
const fs = require('fs');

const jsonParser = StreamArray.withParser();

fs.createReadStream('input.json').pipe(jsonParser.input);

jsonParser.on('data', ({key, value}) => {
    console.log(key, value);
});

jsonParser.on('end', () => {
    console.log('Completed parsing file');
});