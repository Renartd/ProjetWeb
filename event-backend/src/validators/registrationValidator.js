function validateEventId(eventId) {
  const id = Number(eventId);
  if (!Number.isInteger(id) || id <= 0) {
    return { field: "eventId", message: "eventId must be a positive integer" };
  }
  return null;
}

module.exports = {
  validateEventId
};
