import CarsBrowser from "@/components/cars/CarsBrowser";

async function getCars(searchParams) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const queryString = new URLSearchParams();

  const allowedParams = [
    "search",
    "make",
    "model",
    "bodyType",
    "fuelType",
    "transmission",
    "condition",
    "minPrice",
    "maxPrice",
    "minYear",
    "maxYear",
    "sort",
    "page",
    "limit",
  ];

  for (const key of allowedParams) {
    const value = searchParams?.[key];

    if (
      typeof value === "string" &&
      value.trim()
    ) {
      queryString.set(key, value);
    }
  }

  if (!queryString.has("page")) {
    queryString.set("page", "1");
  }

  if (!queryString.has("limit")) {
    queryString.set("limit", "12");
  }

  const response = await fetch(
    `${baseUrl}/api/cars?${queryString.toString()}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load cars");
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(
      result.message || "Failed to load cars"
    );
  }

  return result.data;
}

export default async function CarsPage({
  searchParams,
}) {
  const params = await searchParams;

  let data = {
    cars: [],

    pagination: {
      page: 1,
      limit: 12,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };

  try {
    data = await getCars(params);
  } catch (error) {
    console.error("Cars page error:", error);
  }

  return (
    <main className=" bg-white">
      <CarsBrowser
        initialCars={data.cars}
        initialPagination={data.pagination}
        initialFilters={params}
      />
    </main>
  );
}
