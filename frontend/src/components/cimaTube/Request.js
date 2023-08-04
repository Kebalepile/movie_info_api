/**
 * 
 * @param {object} options
 * @description Creates data Object to be sent to API as query. 
 * @returns null or data Object
 */
export  function RequestData(options = null) {
  const date = new Date(),
    year = date.getFullYear(),
    month = date.getMonth(),
    day = date.getDate();

  if (options) {
    const data = {
      ...options,
      date: `${year}-${month.toString().padStart(2, 0)}-${day
        .toString()
        .padStart(2, "0")}`,
    };
    return data;
  }
  return null;
}

// options argument look like this
// {
//     query String
//     email String
//     mediaHandle String
// }
