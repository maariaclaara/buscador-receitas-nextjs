import Image from "next/image";
import { notFound } from "next/navigation";
import styles from "./recipe.module.css";

type RecipeDetail = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  [key: string]: string | undefined;
};

async function getRecipe(id: string): Promise<RecipeDetail | null> {
  try {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(
      id
    )}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;

    const data = (await res.json()) as { meals: RecipeDetail[] | null };
    return data.meals?.[0] ?? null;
  } catch {
    return null;
  }
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) notFound();

  const recipe = await getRecipe(id);
  if (!recipe) notFound();

  const ingredients = Array.from({ length: 20 }, (_, i) => i + 1)
    .map((i) => ({
      ingredient: recipe[`strIngredient${i}`]?.trim() ?? "",
      measure: recipe[`strMeasure${i}`]?.trim() ?? "",
    }))
    .filter((x) => x.ingredient.length > 0);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>{recipe.strMeal}</h1>

            <div className={styles.metaRow}>
              <span className={styles.badge}>
                {recipe.strCategory || "Uncategorized"}
              </span>
              <span className={styles.dot} />
              <span className={styles.metaText}>
                {recipe.strArea || "Unknown origin"}
              </span>
            </div>
          </div>
        </header>

        <section className={styles.heroGrid}>
          <div className={styles.imageCard}>
            {recipe.strMealThumb ? (
              <Image
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                width={1200}
                height={800}
                className={styles.image}
                priority
              />
            ) : (
              <div className={styles.imagePlaceholder}>No image</div>
            )}
          </div>

          <aside className={styles.sideCard}>
            <h2 className={styles.sectionTitle}>Ingredients</h2>

            {ingredients.length ? (
              <ul className={styles.ingredientsList}>
                {ingredients.map((item, idx) => (
                  <li className={styles.ingredientItem} key={`${item.ingredient}-${idx}`}>
                    <span className={styles.ingredientName}>{item.ingredient}</span>
                    {item.measure ? (
                      <span className={styles.ingredientMeasure}>{item.measure}</span>
                    ) : (
                      <span className={styles.ingredientMeasureMuted}>—</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.muted}>Nenhum ingrediente informado.</p>
            )}
          </aside>
        </section>

        <section className={styles.contentCard}>
          <h2 className={styles.sectionTitle}>Instructions</h2>
          <p className={styles.instructions}>
            {recipe.strInstructions || "Sem instruções."}
          </p>
        </section>
      </div>
    </main>
  );
}