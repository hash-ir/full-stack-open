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
    periodLength: 7,
    trainingDays: dailyHours.filter((n) => n !== 0).length,
    target: target,
    average: total / 7,
    success: success,
    rating: rating,
    ratingDescription: ratingDesc,
  };
};

const feedback = calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2);
console.log(feedback)
