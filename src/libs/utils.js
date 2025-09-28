export const getOrCreateUUID = () => {
  let uuid = localStorage.getItem("anon_uuid");
  if(!uuid) {
    uuid = crypto.randomUUID();
    localStorage.setItem("anon_uuid", uuid);
  }
  return uuid;
}

export const getDay = (created) => {
  let date = new Date(created)

  return `${date.getDate()} ${date.toLocaleString("es-ES", {month: "short"})}`
}

export const getFullDate = (created) => {
  let date = new Date(created)

  return `${date.getDate()} ${date.toLocaleString("es-ES", {month: "short"}).toUpperCase()} del ${date.getFullYear()}`
}
