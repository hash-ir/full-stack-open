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

try {
  console.log(calculateBmi(180, 74));
} catch (error: unknown) {
  let errorMessage = "Something went wrong: ";

  if (error instanceof Error) {
    errorMessage += error.message;
  }

  console.log(errorMessage);
}
