import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    if (!search) {
      return NextResponse.json({ meals: null });
    }

    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`
    );

    if (!response.ok) {
      return NextResponse.json(
        { meals: null },
        { status: 200 }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { meals: null },
      { status: 200 }
    );
  }
}
