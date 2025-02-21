const capitalizeFirstLetter = (string) => {
  if (typeof string !== "string") return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

//Format Date
const formattedDate = (utcDate) => { 
  const date = new Date(utcDate);
  const istDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000); 
  return `${istDate.getDate().toString().padStart(2, '0')}/${(istDate.getMonth() + 1).toString().padStart(2, '0')}/${istDate.getFullYear()} ${istDate.getHours().toString().padStart(2, '0')}:${istDate.getMinutes().toString().padStart(2, '0')} ${istDate.getHours() >= 12 ? 'pm' : 'am'}`;
};

module.exports = {
  capitalizeFirstLetter,
  formattedDate,
};

