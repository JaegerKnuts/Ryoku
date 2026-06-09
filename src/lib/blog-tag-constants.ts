export const START_HERE_TAG = "Empieza aquí";

export const EDITORIAL_TAGS = [
  START_HERE_TAG,
  "Extracciones",
  "Materia prima",
  "Calidad y clasificación",
  "Curado y conservación",
  "Consumo y herramientas",
  "Glosario",
];

const editorialOrder = new Map(EDITORIAL_TAGS.map((tag, index) => [tag, index]));

export function sortBlogTags(tags: string[]): string[] {
  const editorial = EDITORIAL_TAGS.filter((tag) => tags.includes(tag));
  const others = tags
    .filter((tag) => !editorialOrder.has(tag))
    .sort((a, b) => a.localeCompare(b, "es"));
  return [...editorial, ...others];
}
