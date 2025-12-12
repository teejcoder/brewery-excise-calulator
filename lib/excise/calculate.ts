function calculateAbv(og: number, fg: number) {
  return parseFloat(((og - fg) * 131.25).toFixed(2));
}

function truncateHelper(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.trunc(value * factor) / factor;
}

function calculateLal(batchSize: number, abv: number) {
  const lal = batchSize * ((abv - 1.15) / 100); // ABV entered as percent (e.g. 5), subtract 1.15% and convert to fraction (/100)
  //   console.log('lal', lal);
  return lal.toFixed(2); // readable precise value for display
}

function calculateLalTruncated(batchSize: number, abv: number) {
  const preciseLal = parseFloat(calculateLal(batchSize, abv));
  //   console.log('precise lal', preciseLal);
  return truncateHelper(preciseLal, 1);
}

function calculateExciseDuty(batchSize: number, abv: number) {
  const lal = calculateLalTruncated(batchSize, abv);
  //   console.log("final LAL:", lal);
  const rate = 57.79; // default rate
  //   console.log("rate:", rate);
  const exciseDuty = lal * rate;
  // console.log("excise duty:", exciseDuty);
  const truncatedExciseDuty = Math.trunc(exciseDuty * 100) / 100;
  //   console.log("truncated excise duty:", truncatedExciseDuty);

  return truncatedExciseDuty; // truncated to 2 decimal places
}

export { calculateAbv, calculateLal, calculateLalTruncated, calculateExciseDuty };