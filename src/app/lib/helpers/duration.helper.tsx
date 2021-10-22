export const convertMinutesToMessage = (minutes: number) => {
  let message;

  if (minutes > 60) {
    message = `${(minutes / 60).toFixed(2)} hours`;
  } else {
    message = `${minutes} minutes`;
  }

  return message;
}
