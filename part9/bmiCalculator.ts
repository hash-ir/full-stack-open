const calculateBmi = (height: number, weight: number): string => {
  const heightInMeters: number = height / 100;
  if (heightInMeters === 0) {
    throw new Error("Height must not be 0.");
  }
  const bmi: number = weight / heightInMeters ** 2;

  if (bmi < 18.5) {
    return "Underweight";
  } else if (bmi >= 18.5 && bmi < 25) {
    return "Normal range";
  } else if (bmi >= 25 && bmi < 30) {
    return "Overweight";
  } else if (bmi >= 30) {
    return "Obese";
  } else {
    return "Invalid BMI";
  }
};

const bmiArgs = process.argv.slice(2);

if (bmiArgs.length !== 2) {
  console.error(
    `Expected exactly 2 number arguments (height (cm), width (kg)). Found ${
      process.argv.length - 2
    }`
  );
  process.exit(1);
}

const height: number = Number(process.argv[2]);
const weight: number = Number(process.argv[3]);

try {
  console.log(calculateBmi(height, weight));
} catch (error: unknown) {
  let errorMessage = "Something went wrong: ";

  if (error instanceof Error) {
    errorMessage += error.message;
  }

  console.log(errorMessage);
}
