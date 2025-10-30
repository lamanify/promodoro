export const calculateTimeSpent = (startTime: Date, endTime: Date): string => {
  const diffInMs = endTime.getTime() - startTime.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const seconds = diffInSeconds % 60;

  return `${hours}h ${minutes}m ${seconds}s`;
};
