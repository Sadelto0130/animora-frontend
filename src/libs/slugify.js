
export function slugify(text, {lower = true, maxLength = 120} = {}) {
  if (!text) return "";

  // quita acentos
  let slug = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Reemplaza cualquier carácter no alfanumerico por guion
  slug = slug.replace(/[^a-zA-Z0-9\u00C0-\u024F]+/g, "-");

  // Quita guiones duplicados y guiones al inicio/fin
  slug = slug.replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "");

  // Limita longitud
  if (maxLength && slug.length > maxLength) {
    slug = slug.slice(0, maxLength).replace(/-+$/,"");
  }

  return lower ? slug.toLowerCase() : slug;
}
