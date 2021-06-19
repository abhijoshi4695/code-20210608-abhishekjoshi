const StreamArray = require("stream-json/streamers/StreamArray");
const fs = require("fs");

let overweightCount = 0;

function bmiCalculator(input_file, output_file) {
  const jsonParser = StreamArray.withParser();
  let firstWrite = true;

  fs.createReadStream(input_file).pipe(jsonParser.input);
  let writeStream = fs.createWriteStream(output_file);
  writeStream.write('[\n');

  jsonParser.on("data", ({ key, value }) => {
    if(value.WeightKg == '' || value.HeightCm == '') {
      console.log(key, "Height/Weight cannot be blank or zero");
    }
    else if (value.WeightKg < 0 || value.HeightCm < 0) {
      console.log(key, "Height/Weight cannot be negative");
    } else {
      const HeightM = value.HeightCm / 100;
      const bmi =
        Math.round((value.WeightKg / (HeightM * HeightM)) * 100) / 100;
      const categoryAndRisk = getCategoryAndRisk(bmi);
      console.log(
        key,
        value.Gender,
        value.HeightCm,
        value.WeightKg,
        bmi,
        '"' + categoryAndRisk.category + '"',
        '"' + categoryAndRisk.healthRisk + '"'
      );
      let writeObj = {
        "Gender": "Male",
        "HeightCm": 171,
        "WeightKg": 96,
        "BMI": bmi,
        "Category": categoryAndRisk.category,
        "HealthRisk": categoryAndRisk.healthRisk
      }
      if(firstWrite) {
        writeStream.write(JSON.stringify(writeObj));
        firstWrite = false;
      }
      else {
        writeStream.write(",\n" + JSON.stringify(writeObj));
      }
    }
  });

  jsonParser.on("end", () => {
    writeStream.write('\n]');
    writeStream.on('finish', () => {
      console.log("Completed writing to file " + output_file + "\n");
    });
    writeStream.end();
    console.log("Completed parsing file\n");
    console.log(
      "Count of persons categorized as overweight:" + overweightCount + "\n"
    );
  });
}

function getCategoryAndRisk(bmiVal) {
  const category = [
    "Underweight",
    "Normal weight",
    "Overweight",
    "Moderately obese",
    "Severely obese",
    "Very severely obese",
  ];
  const risk = [
    "Malnutrition risk",
    "Low risk",
    "Enhanced risk",
    "Medium risk",
    "High risk",
    "Very high risk",
  ];
  let i = 0;

  if (bmiVal > 18.4 && bmiVal <= 24.9) {
    i = 1;
  } else if (bmiVal > 24.9 && bmiVal <= 29.9) {
    i = 2;
    overweightCount++;
  } else if (bmiVal > 29.9 && bmiVal <= 34.9) {
    i = 3;
  } else if (bmiVal > 34.9 && bmiVal <= 39.9) {
    i = 4;
  } else if (bmiVal > 39.9) {
    i = 5;
  }

  return {
    category: category[i],
    healthRisk: risk[i],
  };
}

bmiCalculator('generated.json', 'out.json');