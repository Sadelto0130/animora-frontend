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

export const validarPassword = (password) => {
  if (!password) {
    return { valido: false, mensaje: "La contraseña no puede estar vacía" };
  }

  // Evitar caracteres especiales
  if (/[^a-zA-Z0-9]/.test(password)) {
    return { valido: false, mensaje: "La contraseña no debe contener caracteres especiales" };
  }

  if (password.length < 6) {
    return { valido: false, mensaje: "La contraseña debe tener al menos 6 caracteres" };
  }

  if (!/[a-z]/.test(password)) {
    return { valido: false, mensaje: "Falta al menos una letra minúscula" };
  }

  if (!/[A-Z]/.test(password)) {
    return { valido: false, mensaje: "Falta al menos una letra mayúscula" };
  }

  if (!/[0-9]/.test(password)) {
    return { valido: false, mensaje: "Falta al menos un número" };
  }

  return { valido: true, mensaje: "Contraseña válida" };
}


export const validarUsuario = (usuario) => {
  if (!usuario) {
    return { valido: false, mensaje: "El usuario no puede estar en blanco" };
  }

  // Evitar caracteres especiales
  if (/[^a-zA-Z0-9]/.test(usuario)) {
    return { valido: false, mensaje: "El usuario no debe contener caracteres especiales" };
  }

  if (usuario.length < 4 && usuario.length > 10) {
    return { valido: false, mensaje: "El usuario debe tener al menos 4 caracteres" };
  }

  return { valido: true, mensaje: "usuario válida" };
}
