"use client";

import { useState } from "react";
import Link from "next/link";

interface PublicRecipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState<PublicRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    if (!search.trim()) return;

    setLoading(true);
    setError("");
    setRecipes([]);

    try {
      const response = await fetch(
        `/api/recipes/public?search=${encodeURIComponent(search)}`
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar receitas");
      }

      const data: PublicRecipe[] = await response.json();
      setRecipes(data);
    } catch (err) {
      setError("Não foi possível buscar a receita.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="space-y-8">
      {/* Título */}
      <section className="text-center">
        <h1 className="text-3xl font-bold">
          Buscador de Receitas
        </h1>
        <p className="text-gray-600">
          Encontre receitas incríveis para o seu dia a dia
        </p>
      </section>

      {/* Busca */}
      <section className="flex gap-2 max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Digite o nome da receita"
          className="flex-1 border rounded px-4 py-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />

        <button
          onClick={handleSearch}
          className="bg-black text-white px-6 py-2 rounded hover:opacity-90"
        >
          Buscar
        </button>
      </section>

      {/* Estados */}
      {loading && (
        <p className="text-center text-gray-500">
          Carregando receitas...
        </p>
      )}

      {error && (
        <p className="text-center text-red-500">
          {error}
        </p>
      )}

      {/* Lista de receitas */}
      {!loading && recipes.length > 0 && (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Link
              key={recipe.idMeal}
              href={`/recipes/${recipe.idMeal}`}
              className="border rounded overflow-hidden hover:shadow transition"
            >
              <img
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                className="w-full h-44 object-cover"
              />

              <div className="p-4">
                <h2 className="font-semibold text-lg">
                  {recipe.strMeal}
                </h2>
              </div>
            </Link>
          ))}
        </section>
      )}

      {/* Estado vazio */}
      {!loading && !error && recipes.length === 0 && (
        <p className="text-center text-gray-500">
          Digite um termo para buscar receitas.
        </p>
      )}
    </main>
  );
}
