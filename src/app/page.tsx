"use client";

import { useState } from "react";
import Link from "next/link";

type Recipe = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch() {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setRecipes([]);

    try {
      const response = await fetch(
        `/api/recipes-public?search=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const data = await response.json();

      if (!data.meals) {
        setError("Recipe not found.");
        return;
      }

      setRecipes(data.meals);
    } catch (error) {
      console.error(error);
      setError("Unable to fetch recipes.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: "2rem", maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        Recipe Search
      </h1>

      {/* Search */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Search recipes (ex: chicken)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          style={{ flex: 1, padding: "0.75rem", fontSize: "1rem" }}
        />

        <button
          onClick={handleSearch}
          disabled={loading}
          style={{ padding: "0.75rem 1.5rem", cursor: "pointer" }}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* States */}
      {loading && <p>Loading recipes...</p>}

      {error && (
        <p style={{ color: "red", fontWeight: 500 }}>
          {error}
        </p>
      )}

      {/* Results */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {recipes.map((recipe) => (
          <Link
            key={recipe.idMeal}
            href={`/recipes/${recipe.idMeal}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              <img
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                style={{
                  width: "100%",
                  height: 180,
                  objectFit: "cover",
                }}
              />

              <div style={{ padding: "1rem" }}>
                <h3 style={{ fontSize: "1.1rem" }}>
                  {recipe.strMeal}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
