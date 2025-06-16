type Rating = 1 | 2 | 3;

interface Feedback {
  periodLength: number;
  trainingDays: number;
  target: number;
  average: number;
  success: boolean;
  rating: Rating;
  ratingDescription: string;
}

const calculateExercises = (
  dailyHours: Array<number>,
  target: number
): Feedback => {
  const total = dailyHours.reduce((s, e) => s + e, 0);
  const averageHours = total / dailyHours.length;
  const success = averageHours < target ? false : true;
  const performance = (averageHours * 100) / target;

  let rating: Rating;
  let ratingDesc: string;
  if (performance >= 80) {
    rating = 3;
    ratingDesc = "They don't know me son";
  } else if (performance < 80 && performance > 40) {
    rating = 2;
    ratingDesc = "You stop when you're done";
  } else {
    rating = 1;
    ratingDesc = "Who is gonna carry the boats and the logs?";
  }

  return {
    periodLength: dailyHours.length,
    trainingDays: dailyHours.filter((n) => n !== 0).length,
    target: target,
    average: total / dailyHours.length,
    success: success,
    rating: rating,
    ratingDescription: ratingDesc,
  };
};

const exerciseArgs = process.argv.slice(2);

if (exerciseArgs.length < 2) {
  console.error(
    `Expected at least 2 number arguments (daily hours and target). Found ${exerciseArgs.length}`
  );
  process.exit(1);
}

const numbers = exerciseArgs.map((arg, index) => {
  const num = Number(arg);
  if (isNaN(num)) {
    console.error(`Argument ${index + 1} is not a valid number: ${arg}`);
    process.exit(1);
  }
  return num;
});

const dailyHours = numbers.slice(0, numbers.length - 1);
const target = numbers[numbers.length - 1];

const feedback = calculateExercises(dailyHours, target);
console.log(feedback);
