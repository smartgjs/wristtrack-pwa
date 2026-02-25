export type ISODate = `${number}-${number}-${number}`; // "YYYY-MM-DD"
export type Records = Record<ISODate, string>; // date -> watchId