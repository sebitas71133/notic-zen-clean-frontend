const opciones = {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", opciones);
};
