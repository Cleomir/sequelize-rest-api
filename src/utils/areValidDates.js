function areValidDates(startDate, endDate) {
  let valid = true;
  let errorMessage = "";

  if (!startDate || !endDate) {
    valid = false;
    errorMessage = "Start and end date are required";
  } else if (new Date(startDate) > new Date(endDate)) {
    valid = false;
    errorMessage = "Start date must be before end date";
  } else if (
    isNaN(new Date(startDate).getTime()) ||
    isNaN(new Date(endDate).getTime())
  ) {
    valid = false;
    errorMessage = "Invalid date format";
  }

  return { valid, errorMessage };
}

module.exports = areValidDates;
