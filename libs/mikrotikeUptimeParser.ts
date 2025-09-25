export default function mikrotikTimeParser(time: String) {
  if (
    time.includes("w") &&
    time.includes("d") &&
    time.includes("h") &&
    time.includes("m") &&
    time.includes("s")
  ) {
    const week = parseInt(time.split("w")[0]);
    const days = parseInt(time.split("w")[1].split("d")[0]);
    const hours = parseInt(time.split("w")[1].split("d")[0].split("h")[0]);
    const minutes = parseInt(time.split("w")[1].split("h")[1].split("m")[0]);
    const seconds = parseInt(
      time.split("w")[1].split("h")[0].split("m")[1].split("s")[0]
    );

    const convertweekstodays = week * 7;
    const adddays = convertweekstodays + days;
    const convertdaystohours = adddays * 24;
    const actualhoursadded = convertdaystohours + hours;
    const finalTime = `${actualhoursadded}:${minutes}:${seconds}`;
    return finalTime;
  } else if (
    time.includes("d") &&
    time.includes("h") &&
    time.includes("m") &&
    time.includes("s")
  ) {
    const days = parseInt(time.split("d")[0]);
    const hours = parseInt(time.split("d")[0].split("h")[0]);
    const minutes = parseInt(time.split("d")[1].split("h")[1].split("m")[0]);
    const seconds = parseInt(
      time.split("d")[1].split("h")[0].split("m")[1].split("s")[0]
    );

    const convertdaystohours = days * 24;
    const actualhoursadded = convertdaystohours + hours;
    const finalTime = `${actualhoursadded}:${minutes}:${seconds}`;

    return finalTime;
  } else if (time.includes("h") && time.includes("m") && time.includes("s")) {
    const hours = parseInt(time.split("d")[0].split("h")[0]);
    const minutes = parseInt(time.split("h")[1].split("m")[0]);
    const seconds = parseInt(time.split("h")[0].split("m")[1].split("s")[0]);

    const finalTime = `${hours}:${minutes}:${seconds}`;
    return finalTime;
  } else if (time.includes("m") && time.includes("s")) {
    const minutes = parseInt(time.split("m")[0]);
    const seconds = parseInt(time.split("m")[1].split("s")[0]);

    const finalTime = `00:${minutes}:${seconds}`;
    return finalTime;
  } else if (time.includes("m") && time.includes("s")) {
    const seconds = parseInt(time.split("s")[0]);

    const finalTime = `00:00:${seconds}`;
    return finalTime;
  } else if (time.includes("w") && time.includes("h")) {
    const weeks = parseInt(time.split("w")[0]);
    const hours = parseInt(time.split("w")[1].split("h")[0]);

    const weekstodays = weeks * 7;
    const getTotalDays= weekstodays
    const getFinalhours = weekstodays * 24 + hours ;
    const finalTime = `${getFinalhours}:00:00`;
    return finalTime;
  } else {
    return false;
  }
}
