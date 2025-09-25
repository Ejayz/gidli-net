export default async function ActualRemainingTime(
  uptime_limit: string,
  uptime: string
) {
  // Convert time string to total seconds
  const toSeconds = (time: string): number => {
    const parts = time.split(":").map(Number);

    let hours = 0,
      minutes = 0,
      seconds = 0;

    if (parts.length === 3) {
      [hours, minutes, seconds] = parts;
    }
    return (hours * 60 + minutes) * 60 + seconds;
  };

  // Convert seconds back to Mikrotik style
  const formatTime = (totalSeconds: number): string => {
    if (totalSeconds < 0) totalSeconds = 0; // clamp to zero

    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${hours}:${minutes}:${seconds}`;
  };

  const remainingSeconds = toSeconds(uptime_limit) - toSeconds(uptime);

  return formatTime(remainingSeconds);
}
