function validateString(field, value, min = 1, max = 255) {
  if (typeof value !== "string") {
    return `${field} doit être une chaîne de caractères`;
  }
  if (value.trim().length < min) {
    return `${field} doit contenir au moins ${min} caractères`;
  }
  if (value.length > max) {
    return `${field} ne doit pas dépasser ${max} caractères`;
  }
  return null;
}

function validatePositiveInteger(field, value) {
  if (typeof value !== "number" || isNaN(value)) {
    return `${field} doit être un nombre`;
  }
  if (value <= 0) {
    return `${field} doit être supérieur à 0`;
  }
  return null;
}

function validateDate(field, value) {
  const d = new Date(value);
  if (isNaN(d.getTime())) {
    return `${field} doit être une date valide`;
  }
  return null;
}

function validateCreateEvent(data) {
  const { title, description, date, capacity } = data;

  if (!title) return { field: "title", message: "Le titre est obligatoire" };
  if (!date) return { field: "date", message: "La date est obligatoire" };
  if (capacity == null)
    return { field: "capacity", message: "La capacité est obligatoire" };

  const titleError = validateString("title", title, 3, 100);
  if (titleError) return { field: "title", message: titleError };

  if (description) {
    const descError = validateString("description", description, 3, 500);
    if (descError) return { field: "description", message: descError };
  }

  const dateError = validateDate("date", date);
  if (dateError) return { field: "date", message: dateError };

  const capacityError = validatePositiveInteger("capacity", capacity);
  if (capacityError) return { field: "capacity", message: capacityError };

  return null;
}

function validateUpdateEvent(data) {
  const { title, description, date, capacity } = data;

  if (title !== undefined) {
    const titleError = validateString("title", title, 3, 100);
    if (titleError) return { field: "title", message: titleError };
  }

  if (description !== undefined) {
    const descError = validateString("description", description, 3, 500);
    if (descError) return { field: "description", message: descError };
  }

  if (date !== undefined) {
    const dateError = validateDate("date", date);
    if (dateError) return { field: "date", message: dateError };
  }

  if (capacity !== undefined) {
    const capacityError = validatePositiveInteger("capacity", capacity);
    if (capacityError) return { field: "capacity", message: capacityError };
  }

  return null;
}

module.exports = {
  validateCreateEvent,
  validateUpdateEvent
};
