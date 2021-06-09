const StreamArray = require("stream-json/streamers/StreamArray");
const fs = require("fs");

let overweightCount = 0;

function bmiCalculator(file_path) {
  const jsonParser = StreamArray.withParser();

  fs.createReadStream(file_path).pipe(jsonParser.input);

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
    }
  });

  jsonParser.on("end", () => {
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

bmiCalculator('input.json');