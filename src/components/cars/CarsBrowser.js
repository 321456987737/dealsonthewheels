"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowUpRight,
  ChevronDown,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const HERO_IMAGE = "/images/inventoryimages/Mercedes-AMG GT.webp";

const PAGE_SIZE = 6;

const BODY_TYPES = [
  "Sedan",
  "SUV",
  "Coupe",
  "Convertible",
  "Sports",
  "Hatchback",
  "Wagon",
  "Pickup",
  "Van",
  "Minivan",
];

const FUEL_TYPES = [
  "Petrol",
  "Diesel",
  "Hybrid",
  "Electric",
  "Plug-in Hybrid",
];

const TRANSMISSIONS = [
  "Automatic",
  "Manual",
  "CVT",
];

const CONDITIONS = [
  "New",
  "Used",
];

const MAKES = [
  "BMW",
  "Mercedes-Benz",
  "Toyota",
  "Porsche",
  "Audi",
  "Lexus",
  "Ford",
  "Honda",
  "Nissan",
  "Land Rover",
];

const SORT_OPTIONS = [
  {
    value: "newest",
    label: "Newest first",
  },
  {
    value: "price-low",
    label: "Price: Low to High",
  },
  {
    value: "price-high",
    label: "Price: High to Low",
  },
  {
    value: "year-new",
    label: "Newest year",
  },
  {
    value: "mileage-low",
    label: "Lowest mileage",
  },
];

const DEFAULT_PAGINATION = {
  page: 1,
  limit: PAGE_SIZE,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

function normalizeValue(value) {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
}

export default function CarsBrowser({
  initialCars,
  initialPagination,
  initialFilters,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /* ======================================================
      URL VALUES
  ====================================================== */

  const urlSearch = searchParams.get("search") || "";
  const urlMake = searchParams.get("make") || "";
  const urlBodyType = searchParams.get("bodyType") || "";
  const urlFuelType = searchParams.get("fuelType") || "";
  const urlTransmission =
    searchParams.get("transmission") || "";
  const urlCondition =
    searchParams.get("condition") || "";
  const urlMinPrice =
    searchParams.get("minPrice") || "";
  const urlMaxPrice =
    searchParams.get("maxPrice") || "";
  const urlMinYear =
    searchParams.get("minYear") || "";
  const urlMaxYear =
    searchParams.get("maxYear") || "";
  const urlSort =
    searchParams.get("sort") || "newest";

  /* ======================================================
      STATE
  ====================================================== */

  const [cars, setCars] = useState(
    initialCars || [],
  );

  const [pagination, setPagination] = useState({
    ...DEFAULT_PAGINATION,
    ...(initialPagination || {}),
    limit: PAGE_SIZE,
  });

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] =
    useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState(
    normalizeValue(initialFilters?.search) ||
      urlSearch,
  );

  const [make, setMake] = useState(
    normalizeValue(initialFilters?.make) ||
      urlMake,
  );

  const [bodyType, setBodyType] = useState(
    normalizeValue(initialFilters?.bodyType) ||
      urlBodyType,
  );

  const [fuelType, setFuelType] = useState(
    normalizeValue(initialFilters?.fuelType) ||
      urlFuelType,
  );

  const [transmission, setTransmission] =
    useState(
      normalizeValue(
        initialFilters?.transmission,
      ) || urlTransmission,
    );

  const [condition, setCondition] = useState(
    normalizeValue(initialFilters?.condition) ||
      urlCondition,
  );

  const [minPrice, setMinPrice] = useState(
    normalizeValue(initialFilters?.minPrice) ||
      urlMinPrice,
  );

  const [maxPrice, setMaxPrice] = useState(
    normalizeValue(initialFilters?.maxPrice) ||
      urlMaxPrice,
  );

  const [minYear, setMinYear] = useState(
    normalizeValue(initialFilters?.minYear) ||
      urlMinYear,
  );

  const [maxYear, setMaxYear] = useState(
    normalizeValue(initialFilters?.maxYear) ||
      urlMaxYear,
  );

  const [sort, setSort] = useState(
    normalizeValue(initialFilters?.sort) ||
      urlSort ||
      "newest",
  );

  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

  /* ======================================================
      REFS
  ====================================================== */

  const observerRef = useRef(null);
  const abortControllerRef = useRef(null);

  const paginationRef = useRef(
    pagination,
  );

  const loadingMoreRef = useRef(false);
  const firstLoadRef = useRef(false);

  const fetchCarsRef = useRef(null);

 useEffect(() => {
  paginationRef.current = pagination;
}, [pagination]);


  /* ======================================================
      BUILD API PARAMS
  ====================================================== */

  const buildParams = useCallback(
    (overrides = {}, page = 1) => {
      const values = {
        search,
        make,
        bodyType,
        fuelType,
        transmission,
        condition,
        minPrice,
        maxPrice,
        minYear,
        maxYear,
        sort,
        ...overrides,
      };

      const params = new URLSearchParams();

      if (values.search?.trim()) {
        params.set(
          "search",
          values.search.trim(),
        );
      }

      if (values.make) {
        params.set("make", values.make);
      }

      if (values.bodyType) {
        params.set(
          "bodyType",
          values.bodyType,
        );
      }

      if (values.fuelType) {
        params.set(
          "fuelType",
          values.fuelType,
        );
      }

      if (values.transmission) {
        params.set(
          "transmission",
          values.transmission,
        );
      }

      if (values.condition) {
        params.set(
          "condition",
          values.condition,
        );
      }

      if (values.minPrice) {
        params.set(
          "minPrice",
          values.minPrice,
        );
      }

      if (values.maxPrice) {
        params.set(
          "maxPrice",
          values.maxPrice,
        );
      }

      if (values.minYear) {
        params.set(
          "minYear",
          values.minYear,
        );
      }

      if (values.maxYear) {
        params.set(
          "maxYear",
          values.maxYear,
        );
      }

      if (values.sort) {
        params.set("sort", values.sort);
      }

      params.set("page", String(page));
      params.set("limit", String(PAGE_SIZE));

      return params;
    },
    [
      search,
      make,
      bodyType,
      fuelType,
      transmission,
      condition,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      sort,
    ],
  );

  /* ======================================================
      FETCH CARS
  ====================================================== */

  const fetchCars = useCallback(
    async (
      page = 1,
      overrides = {},
      append = false,
    ) => {
      const isLoadMore =
        append && page > 1;

      /* ----------------------------------------------
          Prevent duplicate next-page requests
      ---------------------------------------------- */

      if (isLoadMore) {
        if (loadingMoreRef.current) {
          return;
        }

        if (
          !paginationRef.current
            .hasNextPage
        ) {
          return;
        }

        loadingMoreRef.current = true;
        setLoadingMore(true);
      } else {
        /*
          Cancel previous filter/search request
          before starting a new one.
        */

        abortControllerRef.current?.abort();

        abortControllerRef.current =
          new AbortController();

        setLoading(true);
      }

      setError("");

      try {
        const params = buildParams(
          overrides,
          page,
        );

        console.log(
          "Fetching cars:",
          `/api/cars?${params.toString()}`,
        );

        const response = await fetch(
          `/api/cars?${params.toString()}`,
          {
            method: "GET",
            cache: "no-store",
            signal:
              abortControllerRef.current
                ?.signal,
          },
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load inventory",
          );
        }

        const result =
          await response.json();

        console.log(
          "Cars API response:",
          result,
        );

        if (!result.success) {
          throw new Error(
            result.message ||
              "Failed to load inventory",
          );
        }

        const nextCars =
          result.data?.cars || [];

        const nextPagination = {
          ...DEFAULT_PAGINATION,
          ...(result.data
            ?.pagination || {}),
          limit: PAGE_SIZE,
        };

        /* ----------------------------------------------
            FIRST PAGE
        ---------------------------------------------- */

        if (!isLoadMore) {
          setCars(nextCars);
        }

        /* ----------------------------------------------
            NEXT PAGES
        ---------------------------------------------- */

        if (isLoadMore) {
          setCars((currentCars) => {
            const existingIds =
              new Set(
                currentCars.map(
                  (car) =>
                    String(car._id),
                ),
              );

            const uniqueCars =
              nextCars.filter(
                (car) =>
                  !existingIds.has(
                    String(car._id),
                  ),
              );

            return [
              ...currentCars,
              ...uniqueCars,
            ];
          });
        }

        setPagination(
          nextPagination,
        );

        paginationRef.current =
          nextPagination;

        /* ----------------------------------------------
            UPDATE URL ONLY FOR FILTERING
            NO PAGE NUMBER
        ---------------------------------------------- */

        if (!isLoadMore) {
          const urlParams =
            new URLSearchParams();

          const values = {
            search,
            make,
            bodyType,
            fuelType,
            transmission,
            condition,
            minPrice,
            maxPrice,
            minYear,
            maxYear,
            sort,
            ...overrides,
          };

          if (
            values.search?.trim()
          ) {
            urlParams.set(
              "search",
              values.search.trim(),
            );
          }

          if (values.make) {
            urlParams.set(
              "make",
              values.make,
            );
          }

          if (values.bodyType) {
            urlParams.set(
              "bodyType",
              values.bodyType,
            );
          }

          if (values.fuelType) {
            urlParams.set(
              "fuelType",
              values.fuelType,
            );
          }

          if (values.transmission) {
            urlParams.set(
              "transmission",
              values.transmission,
            );
          }

          if (values.condition) {
            urlParams.set(
              "condition",
              values.condition,
            );
          }

          if (values.minPrice) {
            urlParams.set(
              "minPrice",
              values.minPrice,
            );
          }

          if (values.maxPrice) {
            urlParams.set(
              "maxPrice",
              values.maxPrice,
            );
          }

          if (values.minYear) {
            urlParams.set(
              "minYear",
              values.minYear,
            );
          }

          if (values.maxYear) {
            urlParams.set(
              "maxYear",
              values.maxYear,
            );
          }

          if (values.sort) {
            urlParams.set(
              "sort",
              values.sort,
            );
          }

          const query =
            urlParams.toString();

          router.replace(
            query
              ? `${pathname}?${query}`
              : pathname,
            {
              scroll: false,
            },
          );
        }
      } catch (fetchError) {
        if (
          fetchError?.name ===
          "AbortError"
        ) {
          return;
        }

        console.error(
          "Cars fetch error:",
          fetchError,
        );

        setError(
          "We couldn't load the inventory. Please try again.",
        );
      } finally {
        if (isLoadMore) {
          loadingMoreRef.current =
            false;

          setLoadingMore(false);
        } else {
          setLoading(false);
        }
      }
    },
    [
      buildParams,
      bodyType,
      condition,
      fuelType,
      make,
      maxPrice,
      maxYear,
      minPrice,
      minYear,
      pathname,
      router,
      search,
      sort,
      transmission,
    ],
  );

  /*
    Keep latest fetch function in a ref.
    This lets the mount effect run ONLY ONCE.
  */

 useEffect(() => {
  fetchCarsRef.current = fetchCars;
}, [fetchCars]);

  /* ======================================================
      INITIAL API CALL
  ====================================================== */

  useEffect(() => {
    if (firstLoadRef.current) {
      return;
    }

    firstLoadRef.current = true;

    const timer = window.setTimeout(() => {
      fetchCarsRef.current?.(
        1,
        {},
        false,
      );
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  /* ======================================================
      LAST CARD OBSERVER
  ====================================================== */

  const lastCarRef = useCallback(
    (node) => {
      observerRef.current?.disconnect();

      if (!node) {
        return;
      }

      if (loading) {
        return;
      }

      if (loadingMore) {
        return;
      }

      if (
        !paginationRef.current
          .hasNextPage
      ) {
        return;
      }

      observerRef.current =
        new IntersectionObserver(
          (entries) => {
            const firstEntry =
              entries[0];

            if (
              !firstEntry?.isIntersecting
            ) {
              return;
            }

            if (
              loadingMoreRef.current
            ) {
              return;
            }

            if (
              !paginationRef.current
                .hasNextPage
            ) {
              return;
            }

            const nextPage =
              paginationRef.current
                .page + 1;

            console.log(
              "Loading next page:",
              nextPage,
            );

            fetchCarsRef.current?.(
              nextPage,
              {},
              true,
            );
          },
          {
            root: null,
            rootMargin:
              "400px 0px",
            threshold: 0,
          },
        );

      observerRef.current.observe(
        node,
      );
    },
    [loading, loadingMore],
  );

  /* ======================================================
      CLEANUP
  ====================================================== */

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
      abortControllerRef.current?.abort();
    };
  }, []);

  /* ======================================================
      SEARCH
  ====================================================== */

  function handleSearch(event) {
    event.preventDefault();

    const formData =
      new FormData(
        event.currentTarget,
      );

    const nextSearch =
      String(
        formData.get("search") ||
          "",
      );

    setSearch(nextSearch);

    fetchCars(1, {
      search: nextSearch,
    });
  }

  /* ======================================================
      FILTER CHANGE
  ====================================================== */

  function handleFilterChange(
    setter,
    key,
    value,
  ) {
    setter(value);

    fetchCars(1, {
      [key]: value,
    });
  }

  /* ======================================================
      RANGE CHANGE
  ====================================================== */

  function handleRangeChange(
    setter,
    key,
    value,
  ) {
    setter(value);

    fetchCars(1, {
      [key]: value,
    });
  }

  /* ======================================================
      RESET
  ====================================================== */

  function resetFilters() {
    setSearch("");
    setMake("");
    setBodyType("");
    setFuelType("");
    setTransmission("");
    setCondition("");
    setMinPrice("");
    setMaxPrice("");
    setMinYear("");
    setMaxYear("");
    setSort("newest");

    fetchCars(1, {
      search: "",
      make: "",
      bodyType: "",
      fuelType: "",
      transmission: "",
      condition: "",
      minPrice: "",
      maxPrice: "",
      minYear: "",
      maxYear: "",
      sort: "newest",
    });
  }

  /* ======================================================
      ACTIVE FILTER COUNT
  ====================================================== */

  const activeFilterCount = [
    make,
    bodyType,
    fuelType,
    transmission,
    condition,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
  ].filter(Boolean).length;

  return (
    <>
      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="relative h-[40dvh] min-h-[320px] overflow-hidden bg-[#e8e8e5] md:min-h-[420px]">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt="Featured vehicle"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        <div className="absolute inset-0 bg-black/25" />

        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/5" />

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-[1800px] px-6 pb-10 md:px-10 md:pb-14 lg:px-14 lg:pb-16">
            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.65,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="max-w-3xl"
            >
              <p className="mb-3 font-montserrat text-[9px] font-medium uppercase tracking-[0.35em] text-white/60 md:text-[10px]">
                Our Collection
              </p>

              <h1 className="font-bebas text-[clamp(4rem,8vw,8rem)] leading-[0.8] tracking-[-0.045em] text-white">
                Find Your Next Car
              </h1>

              <p className="mt-5 max-w-xl font-montserrat text-[10px] leading-[1.8] tracking-[0.05em] text-white/60 md:text-[11px]">
                Explore our current
                collection of carefully
                selected vehicles, from
                refined daily drivers to
                performance-focused
                machines.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================================================
          ACTIVE CATEGORY
      ====================================================== */}

      {bodyType && (
        <div className="border-b border-black/10 bg-[#f7f7f5]">
          <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-5 px-6 py-4 md:px-10 lg:px-14">
            <div>
              <p className="font-montserrat text-[8px] uppercase tracking-[0.25em] text-black/35">
                Showing category
              </p>

              <p className="mt-1 font-bebas text-2xl leading-none">
                {bodyType}
              </p>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="cursor-pointer font-montserrat text-[8px] font-medium uppercase tracking-[0.16em] text-black/40 underline decoration-black/20 underline-offset-4 transition-colors hover:text-black"
            >
              Clear category
            </button>
          </div>
        </div>
      )}

      {/* ======================================================
          SEARCH
      ====================================================== */}

      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-[1800px] px-6 py-8 md:px-10 md:py-10 lg:px-14">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-montserrat text-[9px] font-medium uppercase tracking-[0.3em] text-black/35 md:text-[10px]">
                Available vehicles
              </p>

              <h2 className="mt-2 font-bebas text-4xl leading-none tracking-[-0.025em] md:text-5xl">
                The Collection
              </h2>
            </div>

            <form
              onSubmit={handleSearch}
              className="w-full max-w-2xl"
            >
              <div className="flex border-b border-black/20 pb-2 transition-colors duration-300 focus-within:border-black">
                <Search
                  size={17}
                  strokeWidth={1.3}
                  className="mr-3 mt-1 shrink-0 text-black/40"
                />

                <input
                  type="text"
                  name="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value,
                    )
                  }
                  placeholder="Search make, model or stock number"
                  className="min-w-0 flex-1 bg-transparent font-montserrat text-[11px] text-black outline-none placeholder:text-black/30"
                />

                <button
                  type="submit"
                  className="group ml-4 flex shrink-0 cursor-pointer items-center gap-2 font-montserrat text-[9px] font-medium uppercase tracking-[0.18em] text-black"
                >
                  Search

                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.3}
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ======================================================
          INVENTORY
      ====================================================== */}

      <section className="bg-white">
        <div className="mx-auto max-w-[1800px] px-6 py-10 md:px-10 md:py-12 lg:px-14 lg:py-14">
          <div className="mb-8 flex items-center justify-between gap-5 border-b border-black/10 pb-5">
            <div className="flex items-center gap-3">
              <p className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-black/35">
                {pagination.total}{" "}
                {pagination.total === 1
                  ? "vehicle"
                  : "vehicles"}{" "}
                available
              </p>

              {loading &&
                cars.length > 0 && (
                  <span className="font-montserrat text-[8px] uppercase tracking-[0.15em] text-black/30">
                    Updating...
                  </span>
                )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setMobileFiltersOpen(
                    true,
                  )
                }
                className="flex cursor-pointer items-center gap-2 border border-black/15 px-4 py-2.5 font-montserrat text-[9px] font-medium uppercase tracking-[0.16em] transition-colors duration-300 hover:border-black md:hidden"
              >
                <SlidersHorizontal
                  size={13}
                  strokeWidth={1.3}
                />

                Filters

                {activeFilterCount >
                  0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center bg-black px-1 text-[7px] text-white">
                    {
                      activeFilterCount
                    }
                  </span>
                )}
              </button>

              <div className="relative">
                <select
                  value={sort}
                  onChange={(event) =>
                    handleFilterChange(
                      setSort,
                      "sort",
                      event.target.value,
                    )
                  }
                  className="h-10 cursor-pointer appearance-none border border-black/15 bg-white pl-4 pr-9 font-montserrat text-[9px] font-medium uppercase tracking-[0.14em] text-black outline-none transition-colors duration-300 hover:border-black focus:border-black"
                >
                  {SORT_OPTIONS.map(
                    (option) => (
                      <option
                        key={
                          option.value
                        }
                        value={
                          option.value
                        }
                      >
                        {
                          option.label
                        }
                      </option>
                    ),
                  )}
                </select>

                <ChevronDown
                  size={13}
                  strokeWidth={1.3}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/40"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[230px_1fr] xl:grid-cols-[250px_1fr]">
            {/* DESKTOP FILTERS */}

            <aside className="hidden md:block">
              <FilterPanel
                make={make}
                setMake={setMake}
                bodyType={bodyType}
                setBodyType={
                  setBodyType
                }
                fuelType={fuelType}
                setFuelType={
                  setFuelType
                }
                transmission={
                  transmission
                }
                setTransmission={
                  setTransmission
                }
                condition={condition}
                setCondition={
                  setCondition
                }
                minPrice={minPrice}
                setMinPrice={
                  setMinPrice
                }
                maxPrice={maxPrice}
                setMaxPrice={
                  setMaxPrice
                }
                minYear={minYear}
                setMinYear={
                  setMinYear
                }
                maxYear={maxYear}
                setMaxYear={
                  setMaxYear
                }
                handleFilterChange={
                  handleFilterChange
                }
                handleRangeChange={
                  handleRangeChange
                }
                resetFilters={
                  resetFilters
                }
              />
            </aside>

            {/* MOBILE FILTER */}

            <AnimatePresence>
              {mobileFiltersOpen && (
                <>
                  <motion.div
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    onClick={() =>
                      setMobileFiltersOpen(
                        false,
                      )
                    }
                    className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-[2px] md:hidden"
                  />

                  <motion.aside
                    initial={{
                      x: "100%",
                    }}
                    animate={{
                      x: 0,
                    }}
                    exit={{
                      x: "100%",
                    }}
                    transition={{
                      duration: 0.4,
                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    }}
                    className="fixed inset-y-0 right-0 z-[100] w-[88%] max-w-sm overflow-y-auto bg-white p-6 md:hidden"
                  >
                    <div className="mb-8 flex items-center justify-between border-b border-black/10 pb-5">
                      <div>
                        <p className="font-montserrat text-[8px] uppercase tracking-[0.25em] text-black/35">
                          Refine
                        </p>

                        <h2 className="mt-1 font-bebas text-4xl leading-none">
                          Filters
                        </h2>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setMobileFiltersOpen(
                            false,
                          )
                        }
                        className="flex h-9 w-9 cursor-pointer items-center justify-center border border-black/15"
                      >
                        <X
                          size={16}
                          strokeWidth={
                            1.3
                          }
                        />
                      </button>
                    </div>

                    <FilterPanel
                      make={make}
                      setMake={setMake}
                      bodyType={bodyType}
                      setBodyType={
                        setBodyType
                      }
                      fuelType={fuelType}
                      setFuelType={
                        setFuelType
                      }
                      transmission={
                        transmission
                      }
                      setTransmission={
                        setTransmission
                      }
                      condition={
                        condition
                      }
                      setCondition={
                        setCondition
                      }
                      minPrice={
                        minPrice
                      }
                      setMinPrice={
                        setMinPrice
                      }
                      maxPrice={
                        maxPrice
                      }
                      setMaxPrice={
                        setMaxPrice
                      }
                      minYear={minYear}
                      setMinYear={
                        setMinYear
                      }
                      maxYear={maxYear}
                      setMaxYear={
                        setMaxYear
                      }
                      handleFilterChange={
                        handleFilterChange
                      }
                      handleRangeChange={
                        handleRangeChange
                      }
                      resetFilters={
                        resetFilters
                      }
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setMobileFiltersOpen(
                          false,
                        )
                      }
                      className="mt-8 flex w-full cursor-pointer items-center justify-center gap-3 bg-black py-4 font-montserrat text-[9px] font-medium uppercase tracking-[0.2em] text-white"
                    >
                      View vehicles

                      <ArrowUpRight
                        size={14}
                        strokeWidth={
                          1.3
                        }
                      />
                    </button>
                  </motion.aside>
                </>
              )}
            </AnimatePresence>

            {/* INVENTORY CONTENT */}

            <div className="min-w-0">
              {error && (
                <div className="mb-8 border border-black/10 bg-black/[0.02] p-5">
                  <p className="font-montserrat text-[9px] uppercase tracking-[0.16em] text-black/50">
                    {error}
                  </p>
                </div>
              )}

              {loading &&
              cars.length === 0 ? (
                <LoadingGrid />
              ) : cars.length >
                0 ? (
                <>
                  <AnimatePresence mode="popLayout">
                    <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 xl:grid-cols-3">
                      {cars.map(
                        (car, index) => (
                          <InventoryCard
                            key={car._id}
                            car={car}
                            index={
                              index
                            }
                            cardRef={
                              index ===
                              cars.length -
                                1
                                ? lastCarRef
                                : undefined
                            }
                          />
                        ),
                      )}
                    </div>
                  </AnimatePresence>

                  {loadingMore && (
                    <LoadingMoreIndicator />
                  )}

                  {!pagination.hasNextPage && (
                    <div className="mt-14 border-t border-black/10 pt-7 text-center">
                      <p className="font-montserrat text-[8px] uppercase tracking-[0.25em] text-black/30">
                        You&apos;ve reached
                        the end of the
                        collection
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <EmptyState
                  onReset={
                    resetFilters
                  }
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ============================================================
   FILTER PANEL
============================================================ */

function FilterPanel({
  make,
  setMake,
  bodyType,
  setBodyType,
  fuelType,
  setFuelType,
  transmission,
  setTransmission,
  condition,
  setCondition,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  minYear,
  setMinYear,
  maxYear,
  setMaxYear,
  handleFilterChange,
  handleRangeChange,
  resetFilters,
}) {
  return (
    <div className="border-t border-black/10">
      <div className="flex items-center justify-between border-b border-black/10 py-5">
        <div>
          <p className="font-montserrat text-[8px] uppercase tracking-[0.25em] text-black/30">
            Refine
          </p>

          <h2 className="mt-1 font-bebas text-3xl leading-none">
            Filters
          </h2>
        </div>

        <button
          type="button"
          onClick={resetFilters}
          className="cursor-pointer font-montserrat text-[8px] font-medium uppercase tracking-[0.16em] text-black/40 underline decoration-black/20 underline-offset-4 transition-colors duration-300 hover:text-black"
        >
          Clear all
        </button>
      </div>

      <div className="divide-y divide-black/10">
        <FilterSelect
          label="Make"
          value={make}
          onChange={(value) =>
            handleFilterChange(
              setMake,
              "make",
              value,
            )
          }
          options={MAKES}
        />

        <FilterSelect
          label="Body type"
          value={bodyType}
          onChange={(value) =>
            handleFilterChange(
              setBodyType,
              "bodyType",
              value,
            )
          }
          options={BODY_TYPES}
        />

        <FilterSelect
          label="Fuel"
          value={fuelType}
          onChange={(value) =>
            handleFilterChange(
              setFuelType,
              "fuelType",
              value,
            )
          }
          options={FUEL_TYPES}
        />

        <FilterSelect
          label="Transmission"
          value={transmission}
          onChange={(value) =>
            handleFilterChange(
              setTransmission,
              "transmission",
              value,
            )
          }
          options={TRANSMISSIONS}
        />

        <FilterSelect
          label="Condition"
          value={condition}
          onChange={(value) =>
            handleFilterChange(
              setCondition,
              "condition",
              value,
            )
          }
          options={CONDITIONS}
        />

        <div className="py-5">
          <label className="mb-3 block font-montserrat text-[8px] font-medium uppercase tracking-[0.2em] text-black/40">
            Price
          </label>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(event) =>
                setMinPrice(
                  event.target
                    .value,
                )
              }
              onBlur={(event) =>
                handleRangeChange(
                  setMinPrice,
                  "minPrice",
                  event.target
                    .value,
                )
              }
              placeholder="Min"
              className="h-10 w-full border border-black/15 bg-white px-3 font-montserrat text-[10px] outline-none placeholder:text-black/25 focus:border-black"
            />

            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(event) =>
                setMaxPrice(
                  event.target
                    .value,
                )
              }
              onBlur={(event) =>
                handleRangeChange(
                  setMaxPrice,
                  "maxPrice",
                  event.target
                    .value,
                )
              }
              placeholder="Max"
              className="h-10 w-full border border-black/15 bg-white px-3 font-montserrat text-[10px] outline-none placeholder:text-black/25 focus:border-black"
            />
          </div>
        </div>

        <div className="py-5">
          <label className="mb-3 block font-montserrat text-[8px] font-medium uppercase tracking-[0.2em] text-black/40">
            Year
          </label>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={minYear}
              onChange={(event) =>
                setMinYear(
                  event.target
                    .value,
                )
              }
              onBlur={(event) =>
                handleRangeChange(
                  setMinYear,
                  "minYear",
                  event.target
                    .value,
                )
              }
              placeholder="From"
              className="h-10 w-full border border-black/15 bg-white px-3 font-montserrat text-[10px] outline-none placeholder:text-black/25 focus:border-black"
            />

            <input
              type="number"
              value={maxYear}
              onChange={(event) =>
                setMaxYear(
                  event.target
                    .value,
                )
              }
              onBlur={(event) =>
                handleRangeChange(
                  setMaxYear,
                  "maxYear",
                  event.target
                    .value,
                )
              }
              placeholder="To"
              className="h-10 w-full border border-black/15 bg-white px-3 font-montserrat text-[10px] outline-none placeholder:text-black/25 focus:border-black"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   FILTER SELECT
============================================================ */

function FilterSelect({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div className="py-5">
      <label className="mb-3 block font-montserrat text-[8px] font-medium uppercase tracking-[0.2em] text-black/40">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(event) =>
            onChange(
              event.target
                .value,
            )
          }
          className="h-10 w-full cursor-pointer appearance-none border border-black/15 bg-white px-3 pr-8 font-montserrat text-[10px] text-black outline-none transition-colors duration-300 hover:border-black focus:border-black"
        >
          <option value="">
            All{" "}
            {label.toLowerCase()}
          </option>

          {options.map(
            (option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ),
          )}
        </select>

        <ChevronDown
          size={13}
          strokeWidth={1.3}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/35"
        />
      </div>
    </div>
  );
}

/* ============================================================
   INVENTORY CARD
============================================================ */

function InventoryCard({
  car,
  index,
  cardRef,
}) {
  const image =
    car.images?.[0];

  const price = formatPrice(
    car.price,
    car.currency,
  );

  const mileage =
    new Intl.NumberFormat(
      "en-US",
    ).format(car.mileage || 0);

  return (
    <motion.article
      ref={cardRef}
      layout
      initial={{
        opacity: 0,
        y: 24,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
        delay: Math.min(
          index * 0.05,
          0.2,
        ),
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className="group"
    >
      <Link
        href={`/cars/${car._id}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[#f1f1ef]">
          {image?.url ? (
            <Image
              src={image.url}
              alt={
                image.alt ||
                `${car.make} ${car.model}`
              }
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-black/25">
                No image
                available
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="absolute left-1 top-1 md:left-4 md:top-4">
            <span className="bg-white px-3 py-2 font-montserrat text-[8px] font-medium uppercase tracking-[0.16em] text-black">
              {car.condition}
            </span>
          </div>

          <div className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center bg-white text-black transition-all duration-300 group-hover:bg-black group-hover:text-white md:bottom-4 md:right-4 md:h-10 md:w-10">
            <ArrowUpRight
              size={16}
              strokeWidth={1.3}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>
        </div>

        <div className="border-b border-black/10 py-5 md:py-6">
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              <p className="mb-2 font-montserrat text-[8px] font-medium uppercase tracking-[0.27em] text-black/35">
                {car.make}
              </p>

              <h3 className="font-bebas text-3xl leading-[0.9] tracking-[-0.025em] text-black transition-opacity duration-300 group-hover:opacity-60 md:text-4xl">
                {car.model}
              </h3>
            </div>

            <p className="shrink-0 pt-1 font-montserrat text-[11px] font-medium tracking-[0.02em] text-black md:text-xs">
              {price}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 font-montserrat text-[8px] uppercase tracking-[0.16em] text-black/35">
            <span>
              {car.year}
            </span>

            <span className="h-[3px] w-[3px] rounded-full bg-black/20" />

            <span>
              {mileage}{" "}
              {car.mileageUnit}
            </span>

            <span className="h-[3px] w-[3px] rounded-full bg-black/20" />

            <span>
              {car.transmission}
            </span>

            <span className="h-[3px] w-[3px] rounded-full bg-black/20" />

            <span>
              {car.bodyType}
            </span>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <span className="font-montserrat text-[8px] font-medium uppercase tracking-[0.18em] text-black/35">
              View vehicle
            </span>

            <span className="font-montserrat text-[8px] uppercase tracking-[0.18em] text-black/25">
              {car.stockNumber ||
                "Available"}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

/* ============================================================
   PRICE
============================================================ */

function formatPrice(
  price,
  currency,
) {
  if (
    typeof price !==
    "number"
  ) {
    return "";
  }

  try {
    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency:
          currency ||
          "USD",
        maximumFractionDigits: 0,
      },
    ).format(price);
  } catch {
    return `${currency || "USD"} ${price.toLocaleString()}`;
  }
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState({
  onReset,
}) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center border-t border-black/10 text-center">
      <p className="font-montserrat text-[8px] font-medium uppercase tracking-[0.3em] text-black/30">
        Collection
      </p>

      <h2 className="mt-4 font-bebas text-6xl leading-none tracking-[-0.03em] md:text-8xl">
        No Cars Found
      </h2>

      <p className="mt-5 max-w-md font-montserrat text-[10px] leading-[1.9] tracking-[0.04em] text-black/40 md:text-[11px]">
        We could not find
        vehicles matching
        your current
        selection. Try
        adjusting your
        filters to explore
        more of the
        collection.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="group mt-8 inline-flex cursor-pointer items-center gap-3 bg-black px-6 py-3.5 font-montserrat text-[9px] font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-black/80"
      >
        Clear filters

        <ArrowUpRight
          size={14}
          strokeWidth={1.3}
          className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
        />
      </button>
    </div>
  );
}

/* ============================================================
   INITIAL LOADING
============================================================ */

function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 xl:grid-cols-3">
      {Array.from({
        length: PAGE_SIZE,
      }).map(
        (_, index) => (
          <motion.div
            key={index}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay:
                index *
                0.05,
            }}
          >
            <div className="aspect-[4/3] animate-pulse bg-black/[0.045]" />

            <div className="border-b border-black/10 py-6">
              <div className="h-2 w-16 animate-pulse bg-black/[0.06]" />

              <div className="mt-3 h-8 w-3/4 animate-pulse bg-black/[0.06]" />

              <div className="mt-5 h-2 w-2/3 animate-pulse bg-black/[0.05]" />

              <div className="mt-6 h-2 w-1/3 animate-pulse bg-black/[0.05]" />
            </div>
          </motion.div>
        ),
      )}
    </div>
  );
}

/* ============================================================
   LOAD MORE
============================================================ */

function LoadingMoreIndicator() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-3">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-black/30" />

        <p className="font-montserrat text-[8px] font-medium uppercase tracking-[0.25em] text-black/35">
          Loading more
          vehicles
        </p>

        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-black/30 [animation-delay:150ms]" />

        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-black/30 [animation-delay:300ms]" />
      </div>
    </div>
  );
}

// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import {
//   ArrowUpRight,
//   ChevronDown,
//   Search,
//   SlidersHorizontal,
//   X,
// } from "lucide-react";
// import { AnimatePresence, motion } from "framer-motion";

// const HERO_IMAGE = "/images/inventoryimages/Mercedes-AMG GT.webp";

// const PAGE_SIZE = 6;

// const BODY_TYPES = [
//   "Sedan",
//   "SUV",
//   "Coupe",
//   "Convertible",
//   "Sports",
//   "Hatchback",
//   "Wagon",
//   "Pickup",
//   "Van",
//   "Minivan",
// ];

// const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric", "Plug-in Hybrid"];

// const TRANSMISSIONS = ["Automatic", "Manual", "CVT"];

// const CONDITIONS = ["New", "Used"];

// const MAKES = [
//   "BMW",
//   "Mercedes-Benz",
//   "Toyota",
//   "Porsche",
//   "Audi",
//   "Lexus",
//   "Ford",
//   "Honda",
//   "Nissan",
//   "Land Rover",
// ];

// const SORT_OPTIONS = [
//   {
//     value: "newest",
//     label: "Newest first",
//   },
//   {
//     value: "price-low",
//     label: "Price: Low to High",
//   },
//   {
//     value: "price-high",
//     label: "Price: High to Low",
//   },
//   {
//     value: "year-new",
//     label: "Newest year",
//   },
//   {
//     value: "mileage-low",
//     label: "Lowest mileage",
//   },
// ];

// const DEFAULT_PAGINATION = {
//   page: 1,
//   limit: PAGE_SIZE,
//   total: 0,
//   totalPages: 0,
//   hasNextPage: false,
//   hasPreviousPage: false,
// };

// function normalizeValue(value) {
//   if (Array.isArray(value)) {
//     return value[0] || "";
//   }

//   return value || "";
// }

// export default function CarsBrowser({
//   initialCars,
//   initialPagination,
//   initialFilters,
// }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   /* ======================================================
//       URL VALUES
//   ====================================================== */

//   const urlBodyType = searchParams.get("bodyType") || "";
//   const urlSearch = searchParams.get("search") || "";
//   const urlMake = searchParams.get("make") || "";
//   const urlFuelType = searchParams.get("fuelType") || "";
//   const urlTransmission = searchParams.get("transmission") || "";
//   const urlCondition = searchParams.get("condition") || "";
//   const urlMinPrice = searchParams.get("minPrice") || "";
//   const urlMaxPrice = searchParams.get("maxPrice") || "";
//   const urlMinYear = searchParams.get("minYear") || "";
//   const urlMaxYear = searchParams.get("maxYear") || "";
//   const urlSort = searchParams.get("sort") || "newest";

//   /* ======================================================
//       STATE
//   ====================================================== */

//   const [cars, setCars] = useState(() => initialCars || []);

//   const [pagination, setPagination] = useState(() => ({
//     ...DEFAULT_PAGINATION,
//     ...(initialPagination || {}),
//     limit: PAGE_SIZE,
//   }));

//   const [loading, setLoading] = useState(false);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [error, setError] = useState("");

//   const [search, setSearch] = useState(
//     normalizeValue(initialFilters?.search) || urlSearch,
//   );

//   const [make, setMake] = useState(
//     normalizeValue(initialFilters?.make) || urlMake,
//   );

//   const [bodyType, setBodyType] = useState(
//     normalizeValue(initialFilters?.bodyType) || urlBodyType,
//   );

//   const [fuelType, setFuelType] = useState(
//     normalizeValue(initialFilters?.fuelType) || urlFuelType,
//   );

//   const [transmission, setTransmission] = useState(
//     normalizeValue(initialFilters?.transmission) || urlTransmission,
//   );

//   const [condition, setCondition] = useState(
//     normalizeValue(initialFilters?.condition) || urlCondition,
//   );

//   const [minPrice, setMinPrice] = useState(
//     normalizeValue(initialFilters?.minPrice) || urlMinPrice,
//   );

//   const [maxPrice, setMaxPrice] = useState(
//     normalizeValue(initialFilters?.maxPrice) || urlMaxPrice,
//   );

//   const [minYear, setMinYear] = useState(
//     normalizeValue(initialFilters?.minYear) || urlMinYear,
//   );

//   const [maxYear, setMaxYear] = useState(
//     normalizeValue(initialFilters?.maxYear) || urlMaxYear,
//   );

//   const [sort, setSort] = useState(
//     normalizeValue(initialFilters?.sort) || urlSort || "newest",
//   );

//   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

//   /* ======================================================
//       REFS
//   ====================================================== */

//   const observerRef = useRef(null);
//   const controllerRef = useRef(null);
//   const requestIdRef = useRef(0);
//   const loadingMoreRef = useRef(false);

//   const paginationRef = useRef(pagination);

//   paginationRef.current = pagination;

//   /* ======================================================
//       BUILD API QUERY
//   ====================================================== */

//   const buildParams = useCallback(
//     (overrides = {}, page = 1, includePagination = true) => {
//       const values = {
//         search,
//         make,
//         bodyType,
//         fuelType,
//         transmission,
//         condition,
//         minPrice,
//         maxPrice,
//         minYear,
//         maxYear,
//         sort,
//         ...overrides,
//       };

//       const params = new URLSearchParams();

//       if (values.search?.trim()) {
//         params.set("search", values.search.trim());
//       }

//       if (values.make) {
//         params.set("make", values.make);
//       }

//       if (values.bodyType) {
//         params.set("bodyType", values.bodyType);
//       }

//       if (values.fuelType) {
//         params.set("fuelType", values.fuelType);
//       }

//       if (values.transmission) {
//         params.set("transmission", values.transmission);
//       }

//       if (values.condition) {
//         params.set("condition", values.condition);
//       }

//       if (values.minPrice) {
//         params.set("minPrice", values.minPrice);
//       }

//       if (values.maxPrice) {
//         params.set("maxPrice", values.maxPrice);
//       }

//       if (values.minYear) {
//         params.set("minYear", values.minYear);
//       }

//       if (values.maxYear) {
//         params.set("maxYear", values.maxYear);
//       }

//       if (values.sort) {
//         params.set("sort", values.sort);
//       }

//       if (includePagination) {
//         params.set("page", String(page));
//         params.set("limit", String(PAGE_SIZE));
//       }

//       return params;
//     },
//     [
//       search,
//       make,
//       bodyType,
//       fuelType,
//       transmission,
//       condition,
//       minPrice,
//       maxPrice,
//       minYear,
//       maxYear,
//       sort,
//     ],
//   );

//   /* ======================================================
//       FETCH CARS
//   ====================================================== */

//   const fetchCars = useCallback(
//     async (page = 1, overrides = {}, append = false) => {
//       const isLoadMore = append && page > 1;

//       /* ----------------------------------------------
//           Prevent duplicate load-more requests
//       ---------------------------------------------- */

//       if (isLoadMore) {
//         if (loadingMoreRef.current) {
//           return;
//         }

//         if (!paginationRef.current.hasNextPage) {
//           return;
//         }

//         loadingMoreRef.current = true;
//         setLoadingMore(true);
//       } else {
//         /* --------------------------------------------
//             Cancel previous request
//         -------------------------------------------- */

//         if (controllerRef.current) {
//           controllerRef.current.abort();
//         }

//         controllerRef.current = new AbortController();

//         setLoading(true);
//       }

//       const requestId = ++requestIdRef.current;

//       setError("");

//       try {
//         const params = buildParams(overrides, page, true);

//         const response = await fetch(`/api/cars?${params.toString()}`, {
//           method: "GET",
//           cache: "no-store",
//           signal: controllerRef.current?.signal,
//         });

//         if (!response.ok) {
//           throw new Error("Failed to load inventory");
//         }

//         const result = await response.json();

//         if (!result.success) {
//           throw new Error(result.message || "Failed to load inventory");
//         }

//         /* --------------------------------------------
//             Ignore stale responses
//         -------------------------------------------- */

//         if (requestId !== requestIdRef.current) {
//           return;
//         }

//         const nextCars = result.data?.cars || [];

//         const nextPagination = {
//           ...DEFAULT_PAGINATION,
//           ...(result.data?.pagination || {}),
//           limit: PAGE_SIZE,
//         };

//         /* --------------------------------------------
//             First page = replace
//             Next page = append
//         -------------------------------------------- */

//         if (isLoadMore) {
//           setCars((currentCars) => {
//             const existingIds = new Set(
//               currentCars.map((car) => String(car._id)),
//             );

//             const uniqueCars = nextCars.filter(
//               (car) => !existingIds.has(String(car._id)),
//             );

//             return [...currentCars, ...uniqueCars];
//           });
//         } else {
//           setCars(nextCars);
//         }

//         setPagination(nextPagination);
//         paginationRef.current = nextPagination;

//         /* --------------------------------------------
//             Only sync URL for page 1
//             Page numbers are NOT shown in the URL
//         -------------------------------------------- */

//         if (!isLoadMore) {
//           const urlParams = buildParams(overrides, 1, false);
//           const queryString = urlParams.toString();

//           router.replace(
//             queryString ? `${pathname}?${queryString}` : pathname,
//             {
//               scroll: false,
//             },
//           );
//         }
//       } catch (fetchError) {
//         if (fetchError?.name === "AbortError") {
//           return;
//         }

//         console.error("Cars fetch error:", fetchError);

//         if (requestId === requestIdRef.current) {
//           setError("We couldn't load the inventory. Please try again.");
//         }
//       } finally {
//         if (requestId === requestIdRef.current) {
//           if (isLoadMore) {
//             loadingMoreRef.current = false;
//             setLoadingMore(false);
//           } else {
//             setLoading(false);
//           }
//         }
//       }
//     },
//     [buildParams, pathname, router],
//   );

//   /* ======================================================
//       LAST CAR OBSERVER
//   ====================================================== */

//   const lastCarRef = useCallback(
//     (node) => {
//       /* ----------------------------------------------
//           Remove previous observer
//       ---------------------------------------------- */

//       if (observerRef.current) {
//         observerRef.current.disconnect();
//         observerRef.current = null;
//       }

//       if (!node) {
//         return;
//       }

//       if (loading) {
//         return;
//       }

//       if (loadingMore) {
//         return;
//       }

//       if (!paginationRef.current.hasNextPage) {
//         return;
//       }

//       observerRef.current = new IntersectionObserver(
//         (entries) => {
//           const entry = entries[0];

//           if (!entry?.isIntersecting) {
//             return;
//           }

//           const nextPage = paginationRef.current.page + 1;

//           fetchCars(nextPage, {}, true);
//         },
//         {
//           root: null,
//           rootMargin: "250px 0px",
//           threshold: 0.1,
//         },
//       );

//       observerRef.current.observe(node);
//     },
//     [fetchCars, loading, loadingMore],
//   );

//   /* ======================================================
//       CLEANUP
//   ====================================================== */

//   useEffect(() => {
//     return () => {
//       observerRef.current?.disconnect();
//       controllerRef.current?.abort();
//     };
//   }, []);

//   /* ======================================================
//       SEARCH
//   ====================================================== */

//   function handleSearch(event) {
//     event.preventDefault();

//     const formData = new FormData(event.currentTarget);

//     const nextSearch = String(formData.get("search") || "");

//     setSearch(nextSearch);

//     fetchCars(1, {
//       search: nextSearch,
//     });
//   }

//   /* ======================================================
//       FILTER CHANGE
//   ====================================================== */

//   function handleFilterChange(setter, key, value) {
//     setter(value);

//     fetchCars(1, {
//       [key]: value,
//     });
//   }

//   /* ======================================================
//       RANGE FILTER
//   ====================================================== */

//   function handleRangeChange(setter, key, value) {
//     setter(value);

//     fetchCars(1, {
//       [key]: value,
//     });
//   }

//   /* ======================================================
//       RESET
//   ====================================================== */

//   function resetFilters() {
//     setSearch("");
//     setMake("");
//     setBodyType("");
//     setFuelType("");
//     setTransmission("");
//     setCondition("");
//     setMinPrice("");
//     setMaxPrice("");
//     setMinYear("");
//     setMaxYear("");
//     setSort("newest");

//     fetchCars(1, {
//       search: "",
//       make: "",
//       bodyType: "",
//       fuelType: "",
//       transmission: "",
//       condition: "",
//       minPrice: "",
//       maxPrice: "",
//       minYear: "",
//       maxYear: "",
//       sort: "newest",
//     });
//   }

//   /* ======================================================
//       ACTIVE FILTER COUNT
//   ====================================================== */

//   const activeFilterCount = [
//     make,
//     bodyType,
//     fuelType,
//     transmission,
//     condition,
//     minPrice,
//     maxPrice,
//     minYear,
//     maxYear,
//   ].filter(Boolean).length;

//   return (
//     <>
//       {/* ======================================================
//           01 — HERO
//       ====================================================== */}

//       <section className="relative h-[40dvh] min-h-[320px] overflow-hidden bg-[#e8e8e5] md:min-h-[420px]">
//         <div className="absolute inset-0">
//           <Image
//             src={HERO_IMAGE}
//             alt="Featured vehicle"
//             fill
//             priority
//             sizes="100vw"
//             className="object-cover object-center"
//           />
//         </div>

//         <div className="absolute inset-0 bg-black/25" />

//         <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/5" />

//         <div className="absolute inset-x-0 bottom-0">
//           <div className="mx-auto max-w-[1800px] px-6 pb-10 md:px-10 md:pb-14 lg:px-14 lg:pb-16">
//             <motion.div
//               initial={{
//                 opacity: 0,
//                 y: 25,
//               }}
//               animate={{
//                 opacity: 1,
//                 y: 0,
//               }}
//               transition={{
//                 duration: 0.65,
//                 ease: [0.22, 1, 0.36, 1],
//               }}
//               className="max-w-3xl"
//             >
//               <p className="mb-3 font-montserrat text-[9px] font-medium uppercase tracking-[0.35em] text-white/60 md:text-[10px]">
//                 Our Collection
//               </p>

//               <h1 className="font-bebas text-[clamp(4rem,8vw,8rem)] leading-[0.8] tracking-[-0.045em] text-white">
//                 Find Your Next Car
//               </h1>

//               <p className="mt-5 max-w-xl font-montserrat text-[10px] leading-[1.8] tracking-[0.05em] text-white/60 md:text-[11px]">
//                 Explore our current collection of carefully selected vehicles,
//                 from refined daily drivers to performance-focused machines.
//               </p>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* ======================================================
//           ACTIVE CATEGORY
//       ====================================================== */}

//       {bodyType && (
//         <div className="border-b border-black/10 bg-[#f7f7f5]">
//           <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-5 px-6 py-4 md:px-10 lg:px-14">
//             <div>
//               <p className="font-montserrat text-[8px] uppercase tracking-[0.25em] text-black/35">
//                 Showing category
//               </p>

//               <p className="mt-1 font-bebas text-2xl leading-none">
//                 {bodyType}
//               </p>
//             </div>

//             <button
//               type="button"
//               onClick={resetFilters}
//               className="cursor-pointer font-montserrat text-[8px] font-medium uppercase tracking-[0.16em] text-black/40 underline decoration-black/20 underline-offset-4 transition-colors hover:text-black"
//             >
//               Clear categoryaaaaaaaaaa
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ======================================================
//           02 — SEARCH / INVENTORY HEADER
//       ====================================================== */}

//       <section className="border-b border-black/10 bg-white">
//         <div className="mx-auto max-w-[1800px] px-6 py-8 md:px-10 md:py-10 lg:px-14">
//           <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
//             <div>
//               <p className="font-montserrat text-[9px] font-medium uppercase tracking-[0.3em] text-black/35 md:text-[10px]">
//                 Available vehicles
//               </p>

//               <h2 className="mt-2 font-bebas text-4xl leading-none tracking-[-0.025em] md:text-5xl">
//                 The Collection
//               </h2>
//             </div>

//             <form onSubmit={handleSearch} className="w-full max-w-2xl">
//               <div className="flex border-b border-black/20 pb-2 transition-colors duration-300 focus-within:border-black">
//                 <Search
//                   size={17}
//                   strokeWidth={1.3}
//                   className="mr-3 mt-1 shrink-0 text-black/40"
//                 />

//                 <input
//                   type="text"
//                   name="search"
//                   value={search}
//                   onChange={(event) => setSearch(event.target.value)}
//                   placeholder="Search make, model or stock number"
//                   className="min-w-0 flex-1 bg-transparent font-montserrat text-[11px] text-black outline-none placeholder:text-black/30"
//                 />

//                 <button
//                   type="submit"
//                   className="group ml-4 flex shrink-0 cursor-pointer items-center gap-2 font-montserrat text-[9px] font-medium uppercase tracking-[0.18em] text-black"
//                 >
//                   Search
//                   <ArrowUpRight
//                     size={14}
//                     strokeWidth={1.3}
//                     className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
//                   />
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </section>

//       {/* ======================================================
//           03 — INVENTORY
//       ====================================================== */}

//       <section className="bg-white">
//         <div className="mx-auto max-w-[1800px] px-6 py-10 md:px-10 md:py-12 lg:px-14 lg:py-14">
//           {/* TOP TOOLBAR */}

//           <div className="mb-8 flex items-center justify-between gap-5 border-b border-black/10 pb-5">
//             <div className="flex items-center gap-3">
//               <p className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-black/35">
//                 {pagination.total}{" "}
//                 {pagination.total === 1 ? "vehicle" : "vehicles"} available
//               </p>

//               {loading && cars.length > 0 && (
//                 <span className="font-montserrat text-[8px] uppercase tracking-[0.15em] text-black/30">
//                   Updating...
//                 </span>
//               )}
//             </div>

//             <div className="flex items-center gap-3">
//               {/* MOBILE FILTER BUTTON */}

//               <button
//                 type="button"
//                 onClick={() => setMobileFiltersOpen(true)}
//                 className="flex cursor-pointer items-center gap-2 border border-black/15 px-4 py-2.5 font-montserrat text-[9px] font-medium uppercase tracking-[0.16em] transition-colors duration-300 hover:border-black md:hidden"
//               >
//                 <SlidersHorizontal size={13} strokeWidth={1.3} />
//                 Filters
//                 {activeFilterCount > 0 && (
//                   <span className="flex h-4 min-w-4 items-center justify-center bg-black px-1 text-[7px] text-white">
//                     {activeFilterCount}
//                   </span>
//                 )}
//               </button>

//               {/* SORT */}

//               <div className="relative">
//                 <select
//                   value={sort}
//                   onChange={(event) =>
//                     handleFilterChange(setSort, "sort", event.target.value)
//                   }
//                   className="h-10 cursor-pointer appearance-none border border-black/15 bg-white pl-4 pr-9 font-montserrat text-[9px] font-medium uppercase tracking-[0.14em] text-black outline-none transition-colors duration-300 hover:border-black focus:border-black"
//                 >
//                   {SORT_OPTIONS.map((option) => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>

//                 <ChevronDown
//                   size={13}
//                   strokeWidth={1.3}
//                   className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/40"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="grid gap-10 lg:grid-cols-[230px_1fr] xl:grid-cols-[250px_1fr]">
//             {/* ==================================================
//                 FILTERS
//             ================================================== */}

//             <aside className="hidden md:block">
//               <FilterPanel
//                 make={make}
//                 setMake={setMake}
//                 bodyType={bodyType}
//                 setBodyType={setBodyType}
//                 fuelType={fuelType}
//                 setFuelType={setFuelType}
//                 transmission={transmission}
//                 setTransmission={setTransmission}
//                 condition={condition}
//                 setCondition={setCondition}
//                 minPrice={minPrice}
//                 setMinPrice={setMinPrice}
//                 maxPrice={maxPrice}
//                 setMaxPrice={setMaxPrice}
//                 minYear={minYear}
//                 setMinYear={setMinYear}
//                 maxYear={maxYear}
//                 setMaxYear={setMaxYear}
//                 handleFilterChange={handleFilterChange}
//                 handleRangeChange={handleRangeChange}
//                 resetFilters={resetFilters}
//               />
//             </aside>

//             {/* ==================================================
//                 MOBILE FILTER OVERLAY
//             ================================================== */}

//             <AnimatePresence>
//               {mobileFiltersOpen && (
//                 <>
//                   <motion.div
//                     initial={{
//                       opacity: 0,
//                     }}
//                     animate={{
//                       opacity: 1,
//                     }}
//                     exit={{
//                       opacity: 0,
//                     }}
//                     onClick={() => setMobileFiltersOpen(false)}
//                     className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-[2px] md:hidden"
//                   />

//                   <motion.aside
//                     initial={{
//                       x: "100%",
//                     }}
//                     animate={{
//                       x: 0,
//                     }}
//                     exit={{
//                       x: "100%",
//                     }}
//                     transition={{
//                       duration: 0.4,
//                       ease: [0.22, 1, 0.36, 1],
//                     }}
//                     className="fixed inset-y-0 right-0 z-[100] w-[88%] max-w-sm overflow-y-auto bg-white p-6 md:hidden"
//                   >
//                     <div className="mb-8 flex items-center justify-between border-b border-black/10 pb-5">
//                       <div>
//                         <p className="font-montserrat text-[8px] uppercase tracking-[0.25em] text-black/35">
//                           Refine
//                         </p>

//                         <h2 className="mt-1 font-bebas text-4xl leading-none">
//                           Filters
//                         </h2>
//                       </div>

//                       <button
//                         type="button"
//                         onClick={() => setMobileFiltersOpen(false)}
//                         className="flex h-9 w-9 cursor-pointer items-center justify-center border border-black/15"
//                       >
//                         <X size={16} strokeWidth={1.3} />
//                       </button>
//                     </div>

//                     <FilterPanel
//                       make={make}
//                       setMake={setMake}
//                       bodyType={bodyType}
//                       setBodyType={setBodyType}
//                       fuelType={fuelType}
//                       setFuelType={setFuelType}
//                       transmission={transmission}
//                       setTransmission={setTransmission}
//                       condition={condition}
//                       setCondition={setCondition}
//                       minPrice={minPrice}
//                       setMinPrice={setMinPrice}
//                       maxPrice={maxPrice}
//                       setMaxPrice={setMaxPrice}
//                       minYear={minYear}
//                       setMinYear={setMinYear}
//                       maxYear={maxYear}
//                       setMaxYear={setMaxYear}
//                       handleFilterChange={handleFilterChange}
//                       handleRangeChange={handleRangeChange}
//                       resetFilters={resetFilters}
//                     />

//                     <button
//                       type="button"
//                       onClick={() => setMobileFiltersOpen(false)}
//                       className="mt-8 flex w-full cursor-pointer items-center justify-center gap-3 bg-black py-4 font-montserrat text-[9px] font-medium uppercase tracking-[0.2em] text-white"
//                     >
//                       View vehicles
//                       <ArrowUpRight size={14} strokeWidth={1.3} />
//                     </button>
//                   </motion.aside>
//                 </>
//               )}
//             </AnimatePresence>

//             {/* ==================================================
//                 INVENTORY CONTENT
//             ================================================== */}

//             <div className="min-w-0">
//               {error && (
//                 <div className="mb-8 border border-black/10 bg-black/[0.02] p-5">
//                   <p className="font-montserrat text-[9px] uppercase tracking-[0.16em] text-black/50">
//                     {error}
//                   </p>
//                 </div>
//               )}

//               {/* ==================================================
//                   INITIAL / FILTER LOADING
//               ================================================== */}

//               {loading ? (
//                 <LoadingGrid />
//               ) : cars.length > 0 ? (
//                 <>
//                   <AnimatePresence mode="popLayout">
//                     <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 xl:grid-cols-3">
//                       {cars.map((car, index) => (
//                         <InventoryCard
//                           key={car._id}
//                           car={car}
//                           index={index}
//                           isLast={index === cars.length - 1}
//                           cardRef={
//                             index === cars.length - 1 ? lastCarRef : undefined
//                           }
//                         />
//                       ))}
//                     </div>
//                   </AnimatePresence>

//                   {/* ==================================================
//                       LOAD MORE INDICATOR
//                   ================================================== */}

//                   {loadingMore && <LoadingMoreIndicator />}

//                   {/* ==================================================
//                       END OF COLLECTION
//                   ================================================== */}

//                   {!pagination.hasNextPage && cars.length > 0 && (
//                     <div className="mt-14 border-t border-black/10 pt-7 text-center">
//                       <p className="font-montserrat text-[8px] uppercase tracking-[0.25em] text-black/30">
//                         You&apos;ve reached the end of the collection
//                       </p>
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <EmptyState onReset={resetFilters} />
//               )}
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

// /* ============================================================
//    FILTER PANEL
// ============================================================ */

// function FilterPanel({
//   make,
//   setMake,
//   bodyType,
//   setBodyType,
//   fuelType,
//   setFuelType,
//   transmission,
//   setTransmission,
//   condition,
//   setCondition,
//   minPrice,
//   setMinPrice,
//   maxPrice,
//   setMaxPrice,
//   minYear,
//   setMinYear,
//   maxYear,
//   setMaxYear,
//   handleFilterChange,
//   handleRangeChange,
//   resetFilters,
// }) {
//   return (
//     <div className="border-t border-black/10">
//       <div className="flex items-center justify-between border-b border-black/10 py-5">
//         <div>
//           <p className="font-montserrat text-[8px] uppercase tracking-[0.25em] text-black/30">
//             Refine
//           </p>

//           <h2 className="mt-1 font-bebas text-3xl leading-none">Filters</h2>
//         </div>

//         <button
//           type="button"
//           onClick={resetFilters}
//           className="cursor-pointer font-montserrat text-[8px] font-medium uppercase tracking-[0.16em] text-black/40 underline decoration-black/20 underline-offset-4 transition-colors duration-300 hover:text-black"
//         >
//           Clear all
//         </button>
//       </div>

//       <div className="divide-y divide-black/10">
//         <FilterSelect
//           label="Make"
//           value={make}
//           onChange={(value) => handleFilterChange(setMake, "make", value)}
//           options={MAKES}
//         />

//         <FilterSelect
//           label="Body type"
//           value={bodyType}
//           onChange={(value) =>
//             handleFilterChange(setBodyType, "bodyType", value)
//           }
//           options={BODY_TYPES}
//         />

//         <FilterSelect
//           label="Fuel"
//           value={fuelType}
//           onChange={(value) =>
//             handleFilterChange(setFuelType, "fuelType", value)
//           }
//           options={FUEL_TYPES}
//         />

//         <FilterSelect
//           label="Transmission"
//           value={transmission}
//           onChange={(value) =>
//             handleFilterChange(setTransmission, "transmission", value)
//           }
//           options={TRANSMISSIONS}
//         />

//         <FilterSelect
//           label="Condition"
//           value={condition}
//           onChange={(value) =>
//             handleFilterChange(setCondition, "condition", value)
//           }
//           options={CONDITIONS}
//         />

//         {/* PRICE */}

//         <div className="py-5">
//           <label className="mb-3 block font-montserrat text-[8px] font-medium uppercase tracking-[0.2em] text-black/40">
//             Price
//           </label>

//           <div className="grid grid-cols-2 gap-2">
//             <input
//               type="number"
//               min="0"
//               value={minPrice}
//               onChange={(event) => setMinPrice(event.target.value)}
//               onBlur={(event) =>
//                 handleRangeChange(setMinPrice, "minPrice", event.target.value)
//               }
//               placeholder="Min"
//               className="h-10 w-full border border-black/15 bg-white px-3 font-montserrat text-[10px] outline-none placeholder:text-black/25 focus:border-black"
//             />

//             <input
//               type="number"
//               min="0"
//               value={maxPrice}
//               onChange={(event) => setMaxPrice(event.target.value)}
//               onBlur={(event) =>
//                 handleRangeChange(setMaxPrice, "maxPrice", event.target.value)
//               }
//               placeholder="Max"
//               className="h-10 w-full border border-black/15 bg-white px-3 font-montserrat text-[10px] outline-none placeholder:text-black/25 focus:border-black"
//             />
//           </div>
//         </div>

//         {/* YEAR */}

//         <div className="py-5">
//           <label className="mb-3 block font-montserrat text-[8px] font-medium uppercase tracking-[0.2em] text-black/40">
//             Year
//           </label>

//           <div className="grid grid-cols-2 gap-2">
//             <input
//               type="number"
//               value={minYear}
//               onChange={(event) => setMinYear(event.target.value)}
//               onBlur={(event) =>
//                 handleRangeChange(setMinYear, "minYear", event.target.value)
//               }
//               placeholder="From"
//               className="h-10 w-full border border-black/15 bg-white px-3 font-montserrat text-[10px] outline-none placeholder:text-black/25 focus:border-black"
//             />

//             <input
//               type="number"
//               value={maxYear}
//               onChange={(event) => setMaxYear(event.target.value)}
//               onBlur={(event) =>
//                 handleRangeChange(setMaxYear, "maxYear", event.target.value)
//               }
//               placeholder="To"
//               className="h-10 w-full border border-black/15 bg-white px-3 font-montserrat text-[10px] outline-none placeholder:text-black/25 focus:border-black"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ============================================================
//    FILTER SELECT
// ============================================================ */

// function FilterSelect({ label, value, onChange, options }) {
//   return (
//     <div className="py-5">
//       <label className="mb-3 block font-montserrat text-[8px] font-medium uppercase tracking-[0.2em] text-black/40">
//         {label}
//       </label>

//       <div className="relative">
//         <select
//           value={value}
//           onChange={(event) => onChange(event.target.value)}
//           className="h-10 w-full cursor-pointer appearance-none border border-black/15 bg-white px-3 pr-8 font-montserrat text-[10px] text-black outline-none transition-colors duration-300 hover:border-black focus:border-black"
//         >
//           <option value="">All {label.toLowerCase()}</option>

//           {options.map((option) => (
//             <option key={option} value={option}>
//               {option}
//             </option>
//           ))}
//         </select>

//         <ChevronDown
//           size={13}
//           strokeWidth={1.3}
//           className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/35"
//         />
//       </div>
//     </div>
//   );
// }

// /* ============================================================
//    INVENTORY CARD
// ============================================================ */

// function InventoryCard({ car, index, cardRef }) {
//   const image = car.images?.[0];

//   const price = formatPrice(car.price, car.currency);

//   const mileage = new Intl.NumberFormat("en-US").format(car.mileage || 0);

//   return (
//     <motion.article
//       ref={cardRef}
//       layout
//       initial={{
//         opacity: 0,
//         y: 24,
//       }}
//       animate={{
//         opacity: 1,
//         y: 0,
//       }}
//       transition={{
//         duration: 0.45,
//         delay: Math.min(index * 0.05, 0.2),
//         ease: [0.22, 1, 0.36, 1],
//       }}
//       className="group"
//     >
//       <Link href={`/cars/${car._id}`}>
//         {/* IMAGE */}

//         <div className="relative aspect-[4/3] overflow-hidden bg-[#f1f1ef]">
//           {image?.url ? (
//             <Image
//               src={image.url}
//               alt={image.alt || `${car.make} ${car.model}`}
//               fill
//               sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
//               className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
//             />
//           ) : (
//             <div className="flex h-full items-center justify-center">
//               <span className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-black/25">
//                 No image available
//               </span>
//             </div>
//           )}

//           <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

//           <div className="absolute left-1 top-1 md:left-4 md:top-4">
//             <span className="bg-white px-3 py-2 font-montserrat text-[8px] font-medium uppercase tracking-[0.16em] text-black">
//               {car.condition}
//             </span>
//           </div>

//           <div className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center bg-white text-black transition-all duration-300 group-hover:bg-black group-hover:text-white md:bottom-4 md:right-4 md:h-10 md:w-10">
//             <ArrowUpRight
//               size={16}
//               strokeWidth={1.3}
//               className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
//             />
//           </div>
//         </div>

//         {/* INFORMATION */}

//         <div className="border-b border-black/10 py-5 md:py-6">
//           <div className="flex items-start justify-between gap-5">
//             <div className="min-w-0">
//               <p className="mb-2 font-montserrat text-[8px] font-medium uppercase tracking-[0.27em] text-black/35">
//                 {car.make}
//               </p>

//               <h3 className="font-bebas text-3xl leading-[0.9] tracking-[-0.025em] text-black transition-opacity duration-300 group-hover:opacity-60 md:text-4xl">
//                 {car.model}
//               </h3>
//             </div>

//             <p className="shrink-0 pt-1 font-montserrat text-[11px] font-medium tracking-[0.02em] text-black md:text-xs">
//               {price}
//             </p>
//           </div>

//           <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 font-montserrat text-[8px] uppercase tracking-[0.16em] text-black/35">
//             <span>{car.year}</span>

//             <span className="h-[3px] w-[3px] rounded-full bg-black/20" />

//             <span>
//               {mileage} {car.mileageUnit}
//             </span>

//             <span className="h-[3px] w-[3px] rounded-full bg-black/20" />

//             <span>{car.transmission}</span>

//             <span className="h-[3px] w-[3px] rounded-full bg-black/20" />

//             <span>{car.bodyType}</span>
//           </div>

//           <div className="mt-6 flex items-center justify-between">
//             <span className="font-montserrat text-[8px] font-medium uppercase tracking-[0.18em] text-black/35">
//               View vehicle
//             </span>

//             <span className="font-montserrat text-[8px] uppercase tracking-[0.18em] text-black/25">
//               {car.stockNumber || "Available"}
//             </span>
//           </div>
//         </div>
//       </Link>
//     </motion.article>
//   );
// }

// /* ============================================================
//    PRICE FORMATTER
// ============================================================ */

// function formatPrice(price, currency) {
//   if (typeof price !== "number") {
//     return "";
//   }

//   try {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: currency || "USD",
//       maximumFractionDigits: 0,
//     }).format(price);
//   } catch {
//     return `${currency || "USD"} ${price.toLocaleString()}`;
//   }
// }

// /* ============================================================
//    EMPTY STATE
// ============================================================ */

// function EmptyState({ onReset }) {
//   return (
//     <div className="flex min-h-[420px] flex-col items-center justify-center border-t border-black/10 text-center">
//       <p className="font-montserrat text-[8px] font-medium uppercase tracking-[0.3em] text-black/30">
//         Collection
//       </p>

//       <h2 className="mt-4 font-bebas text-6xl leading-none tracking-[-0.03em] md:text-8xl">
//         No Cars Found
//       </h2>

//       <p className="mt-5 max-w-md font-montserrat text-[10px] leading-[1.9] tracking-[0.04em] text-black/40 md:text-[11px]">
//         We could not find vehicles matching your current selection. Try
//         adjusting your filters to explore more of the collection.
//       </p>

//       <button
//         type="button"
//         onClick={onReset}
//         className="group mt-8 inline-flex cursor-pointer items-center gap-3 bg-black px-6 py-3.5 font-montserrat text-[9px] font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-black/80"
//       >
//         Clear filters
//         <ArrowUpRight
//           size={14}
//           strokeWidth={1.3}
//           className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
//         />
//       </button>
//     </div>
//   );
// }

// /* ============================================================
//    INITIAL LOADING
// ============================================================ */

// function LoadingGrid() {
//   return (
//     <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 xl:grid-cols-3">
//       {Array.from({
//         length: PAGE_SIZE,
//       }).map((_, index) => (
//         <motion.div
//           key={index}
//           initial={{
//             opacity: 0,
//           }}
//           animate={{
//             opacity: 1,
//           }}
//           transition={{
//             delay: index * 0.05,
//           }}
//         >
//           <div className="aspect-[4/3] animate-pulse bg-black/[0.045]" />

//           <div className="border-b border-black/10 py-6">
//             <div className="h-2 w-16 animate-pulse bg-black/[0.06]" />

//             <div className="mt-3 h-8 w-3/4 animate-pulse bg-black/[0.06]" />

//             <div className="mt-5 h-2 w-2/3 animate-pulse bg-black/[0.05]" />

//             <div className="mt-6 h-2 w-1/3 animate-pulse bg-black/[0.05]" />
//           </div>
//         </motion.div>
//       ))}
//     </div>
//   );
// }

// /* ============================================================
//    LOAD MORE INDICATOR
// ============================================================ */

// function LoadingMoreIndicator() {
//   return (
//     <div className="flex items-center justify-center py-12">
//       <div className="flex items-center gap-3">
//         <span className="h-3 w-3 animate-pulse rounded-full bg-black/30" />

//         <p className="font-montserrat text-[8px] font-medium uppercase tracking-[0.25em] text-black/35">
//           Loading more vehicles
//         </p>

//         <span className="h-3 w-3 animate-pulse rounded-full bg-black/30 [animation-delay:150ms]" />

//         <span className="h-3 w-3 animate-pulse rounded-full bg-black/30 [animation-delay:300ms]" />
//       </div>
//     </div>
//   );
// }

// // "use client";

// // import Image from "next/image";
// // import Link from "next/link";
// // // import { useEffect, useState } from "react";
// // import { useState } from "react";
// // import { usePathname, useRouter, useSearchParams } from "next/navigation";
// // import {
// //   ArrowLeft,
// //   ArrowRight,
// //   ArrowUpRight,
// //   ChevronDown,
// //   Search,
// //   SlidersHorizontal,
// //   X,
// // } from "lucide-react";
// // import { AnimatePresence, motion } from "framer-motion";

// // const HERO_IMAGE = "/images/inventoryimages/Mercedes-AMG GT.webp";

// // const BODY_TYPES = [
// //   "Sedan",
// //   "SUV",
// //   "Coupe",
// //   "Convertible",
// //   "Sports",
// //   "Hatchback",
// //   "Wagon",
// //   "Pickup",
// //   "Van",
// //   "Minivan",
// // ];

// // const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric", "Plug-in Hybrid"];

// // const TRANSMISSIONS = ["Automatic", "Manual", "CVT"];

// // const CONDITIONS = ["New", "Used"];

// // const MAKES = [
// //   "BMW",
// //   "Mercedes-Benz",
// //   "Toyota",
// //   "Porsche",
// //   "Audi",
// //   "Lexus",
// //   "Ford",
// //   "Honda",
// //   "Nissan",
// //   "Land Rover",
// // ];

// // const SORT_OPTIONS = [
// //   {
// //     value: "newest",
// //     label: "Newest first",
// //   },
// //   {
// //     value: "price-low",
// //     label: "Price: Low to High",
// //   },
// //   {
// //     value: "price-high",
// //     label: "Price: High to Low",
// //   },
// //   {
// //     value: "year-new",
// //     label: "Newest year",
// //   },
// //   {
// //     value: "mileage-low",
// //     label: "Lowest mileage",
// //   },
// // ];

// // function normalizeValue(value) {
// //   if (Array.isArray(value)) {
// //     return value[0] || "";
// //   }

// //   return value || "";
// // }

// // export default function CarsBrowser({
// //   initialCars,
// //   initialPagination,
// //   initialFilters,
// // }) {
// //   const router = useRouter();
// //   const pathname = usePathname();
// //   const searchParams = useSearchParams();

// //   /* ======================================================
// //       URL VALUES
// //   ====================================================== */

// //   const urlBodyType = searchParams.get("bodyType") || "";
// //   const urlSearch = searchParams.get("search") || "";
// //   const urlMake = searchParams.get("make") || "";
// //   const urlFuelType = searchParams.get("fuelType") || "";
// //   const urlTransmission = searchParams.get("transmission") || "";
// //   const urlCondition = searchParams.get("condition") || "";
// //   const urlMinPrice = searchParams.get("minPrice") || "";
// //   const urlMaxPrice = searchParams.get("maxPrice") || "";
// //   const urlMinYear = searchParams.get("minYear") || "";
// //   const urlMaxYear = searchParams.get("maxYear") || "";
// //   const urlSort = searchParams.get("sort") || "newest";

// //   /* ======================================================
// //       STATE
// //   ====================================================== */

// //   const [cars, setCars] = useState(initialCars || []);

// //   const [pagination, setPagination] = useState(
// //     initialPagination || {
// //       page: 1,
// //       limit: 2,
// //       total: 0,
// //       totalPages: 0,
// //       hasNextPage: false,
// //       hasPreviousPage: false,
// //     },
// //   );

// //   const [loading, setLoading] = useState(false);

// //   const [search, setSearch] = useState(
// //     normalizeValue(initialFilters?.search) || urlSearch,
// //   );

// //   const [make, setMake] = useState(
// //     normalizeValue(initialFilters?.make) || urlMake,
// //   );

// //   const [bodyType, setBodyType] = useState(
// //     normalizeValue(initialFilters?.bodyType) || urlBodyType,
// //   );

// //   const [fuelType, setFuelType] = useState(
// //     normalizeValue(initialFilters?.fuelType) || urlFuelType,
// //   );

// //   const [transmission, setTransmission] = useState(
// //     normalizeValue(initialFilters?.transmission) || urlTransmission,
// //   );

// //   const [condition, setCondition] = useState(
// //     normalizeValue(initialFilters?.condition) || urlCondition,
// //   );

// //   const [minPrice, setMinPrice] = useState(
// //     normalizeValue(initialFilters?.minPrice) || urlMinPrice,
// //   );

// //   const [maxPrice, setMaxPrice] = useState(
// //     normalizeValue(initialFilters?.maxPrice) || urlMaxPrice,
// //   );

// //   const [minYear, setMinYear] = useState(
// //     normalizeValue(initialFilters?.minYear) || urlMinYear,
// //   );

// //   const [maxYear, setMaxYear] = useState(
// //     normalizeValue(initialFilters?.maxYear) || urlMaxYear,
// //   );

// //   const [sort, setSort] = useState(
// //     normalizeValue(initialFilters?.sort) || urlSort || "newest",
// //   );

// //   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

// //   const [error, setError] = useState("");

// //   // useEffect(() => {
// //   //   setSearch(urlSearch);
// //   //   setMake(urlMake);
// //   //   setBodyType(urlBodyType);
// //   //   setFuelType(urlFuelType);
// //   //   setTransmission(urlTransmission);
// //   //   setCondition(urlCondition);
// //   //   setMinPrice(urlMinPrice);
// //   //   setMaxPrice(urlMaxPrice);
// //   //   setMinYear(urlMinYear);
// //   //   setMaxYear(urlMaxYear);
// //   //   setSort(urlSort || "newest");
// //   // }, [
// //   //   urlSearch,
// //   //   urlMake,
// //   //   urlBodyType,
// //   //   urlFuelType,
// //   //   urlTransmission,
// //   //   urlCondition,
// //   //   urlMinPrice,
// //   //   urlMaxPrice,
// //   //   urlMinYear,
// //   //   urlMaxYear,
// //   //   urlSort,
// //   // ]);

// //   /* ======================================================
// //       BUILD API QUERY
// //   ====================================================== */

// //   function buildParams(overrides = {}, page = 1) {
// //     const values = {
// //       search,
// //       make,
// //       bodyType,
// //       fuelType,
// //       transmission,
// //       condition,
// //       minPrice,
// //       maxPrice,
// //       minYear,
// //       maxYear,
// //       sort,
// //       ...overrides,
// //     };

// //     const params = new URLSearchParams();

// //     if (values.search?.trim()) {
// //       params.set("search", values.search.trim());
// //     }

// //     if (values.make) {
// //       params.set("make", values.make);
// //     }

// //     if (values.bodyType) {
// //       params.set("bodyType", values.bodyType);
// //     }

// //     if (values.fuelType) {
// //       params.set("fuelType", values.fuelType);
// //     }

// //     if (values.transmission) {
// //       params.set("transmission", values.transmission);
// //     }

// //     if (values.condition) {
// //       params.set("condition", values.condition);
// //     }

// //     if (values.minPrice) {
// //       params.set("minPrice", values.minPrice);
// //     }

// //     if (values.maxPrice) {
// //       params.set("maxPrice", values.maxPrice);
// //     }

// //     if (values.minYear) {
// //       params.set("minYear", values.minYear);
// //     }

// //     if (values.maxYear) {
// //       params.set("maxYear", values.maxYear);
// //     }

// //     if (values.sort) {
// //       params.set("sort", values.sort);
// //     }

// //     params.set("page", String(page));
// //     params.set("limit", "2");

// //     return params;
// //   }

// //   /* ======================================================
// //       FETCH CARS
// //   ====================================================== */

// //   async function fetchCars(page = 1, overrides = {}) {
// //     try {
// //       setLoading(true);
// //       setError("");

// //       const params = buildParams(overrides, page);

// //       const response = await fetch(`/api/cars?${params.toString()}`, {
// //         method: "GET",
// //         cache: "no-store",
// //       });

// //       if (!response.ok) {
// //         throw new Error("Failed to load inventory");
// //       }

// //       const result = await response.json();

// //       if (!result.success) {
// //         throw new Error(result.message || "Failed to load inventory");
// //       }

// //       setCars(result.data.cars || []);
// //       setPagination(
// //         result.data.pagination || {
// //           page: 1,
// //           limit: 2,
// //           total: 0,
// //           totalPages: 0,
// //           hasNextPage: false,
// //           hasPreviousPage: false,
// //         },
// //       );

// //       const queryString = params.toString();

// //       router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
// //         scroll: false,
// //       });
// //     } catch (fetchError) {
// //       console.error("Cars fetch error:", fetchError);

// //       setError("We couldn't load the inventory. Please try again.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   /* ======================================================
// //       SEARCH
// //   ====================================================== */

// //   // function handleSearch(event) {
// //   //   event.preventDefault();

// //   //   fetchCars(1, {
// //   //     search,
// //   //   });
// //   // }
// // function handleSearch(event) {
// //   event.preventDefault();

// //   const formData = new FormData(event.currentTarget);
// //   const nextSearch = String(formData.get("search") || "");

// //   fetchCars(1, {
// //     search: nextSearch,
// //   });
// // }
// //   /* ======================================================
// //       FILTER CHANGE
// //   ====================================================== */

// //   function handleFilterChange(setter, key, value) {
// //     setter(value);

// //     fetchCars(1, {
// //       [key]: value,
// //     });
// //   }

// //   /* ======================================================
// //       RANGE FILTER
// //   ====================================================== */

// //   function handleRangeChange(setter, key, value) {
// //     setter(value);

// //     fetchCars(1, {
// //       [key]: value,
// //     });
// //   }

// //   /* ======================================================
// //       RESET
// //   ====================================================== */

// //   function resetFilters() {
// //     setSearch("");
// //     setMake("");
// //     setBodyType("");
// //     setFuelType("");
// //     setTransmission("");
// //     setCondition("");
// //     setMinPrice("");
// //     setMaxPrice("");
// //     setMinYear("");
// //     setMaxYear("");
// //     setSort("newest");

// //     fetchCars(1, {
// //       search: "",
// //       make: "",
// //       bodyType: "",
// //       fuelType: "",
// //       transmission: "",
// //       condition: "",
// //       minPrice: "",
// //       maxPrice: "",
// //       minYear: "",
// //       maxYear: "",
// //       sort: "newest",
// //     });
// //   }

// //   /* ======================================================
// //       ACTIVE FILTER COUNT
// //   ====================================================== */

// //   const activeFilterCount = [
// //     make,
// //     bodyType,
// //     fuelType,
// //     transmission,
// //     condition,
// //     minPrice,
// //     maxPrice,
// //     minYear,
// //     maxYear,
// //   ].filter(Boolean).length;

// //   return (
// //     <>
// //       {/* ======================================================
// //           01 — HERO
// //       ====================================================== */}

// //       <section className="relative h-[40dvh] min-h-[320px] overflow-hidden bg-[#e8e8e5] md:min-h-[420px]">
// //         <div className="absolute inset-0">
// //           <Image
// //             src={HERO_IMAGE}
// //             alt="Featured vehicle"
// //             fill
// //             priority
// //             sizes="100vw"
// //             className="object-cover object-center"
// //           />
// //         </div>

// //         <div className="absolute inset-0 bg-black/25" />

// //         <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/5" />

// //         <div className="absolute inset-x-0 bottom-0">
// //           <div className="mx-auto max-w-[1800px] px-6 pb-10 md:px-10 md:pb-14 lg:px-14 lg:pb-16">
// //             <motion.div
// //               initial={{
// //                 opacity: 0,
// //                 y: 25,
// //               }}
// //               animate={{
// //                 opacity: 1,
// //                 y: 0,
// //               }}
// //               transition={{
// //                 duration: 0.65,
// //                 ease: [0.22, 1, 0.36, 1],
// //               }}
// //               className="max-w-3xl"
// //             >
// //               <p className="mb-3 font-montserrat text-[9px] font-medium uppercase tracking-[0.35em] text-white/60 md:text-[10px]">
// //                 Our Collection
// //               </p>

// //               <h1 className="font-bebas text-[clamp(4rem,8vw,8rem)] leading-[0.8] tracking-[-0.045em] text-white">
// //                 Find Your Next Car
// //               </h1>

// //               <p className="mt-5 max-w-xl font-montserrat text-[10px] leading-[1.8] tracking-[0.05em] text-white/60 md:text-[11px]">
// //                 Explore our current collection of carefully selected vehicles,
// //                 from refined daily drivers to performance-focused machines.
// //               </p>
// //             </motion.div>
// //           </div>
// //         </div>
// //       </section>

// //       {/* ======================================================
// //           ACTIVE CATEGORY INDICATOR
// //       ====================================================== */}

// //       {bodyType && (
// //         <div className="border-b border-black/10 bg-[#f7f7f5]">
// //           <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-5 px-6 py-4 md:px-10 lg:px-14">
// //             <div>
// //               <p className="font-montserrat text-[8px] uppercase tracking-[0.25em] text-black/35">
// //                 Showing category
// //               </p>

// //               <p className="mt-1 font-bebas text-2xl leading-none">
// //                 {bodyType}
// //               </p>
// //             </div>

// //             <button
// //               type="button"
// //               onClick={resetFilters}
// //               className="font-montserrat text-[8px] font-medium uppercase tracking-[0.16em] text-black/40 underline decoration-black/20 underline-offset-4 transition-colors hover:text-black"
// //             >
// //               Clear category
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //       {/* ======================================================
// //           02 — SEARCH / INVENTORY HEADER
// //       ====================================================== */}

// //       <section className="border-b border-black/10 bg-white">
// //         <div className="mx-auto max-w-[1800px] px-6 py-8 md:px-10 md:py-10 lg:px-14">
// //           <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
// //             <div>
// //               <p className="font-montserrat text-[9px] font-medium uppercase tracking-[0.3em] text-black/35 md:text-[10px]">
// //                 Available vehicles
// //               </p>

// //               <h2 className="mt-2 font-bebas text-4xl leading-none tracking-[-0.025em] md:text-5xl">
// //                 The Collection
// //               </h2>
// //             </div>

// //             {/* SEARCH */}

// //             <form onSubmit={handleSearch} className="w-full max-w-2xl">
// //               <div className="flex border-b border-black/20 pb-2 transition-colors duration-300 focus-within:border-black">
// //                 <Search
// //                   size={17}
// //                   strokeWidth={1.3}
// //                   className="mr-3 mt-1 shrink-0 text-black/40"
// //                 />

// //                 <input
// //                   type="text"
// //                   value={search}
// //                   onChange={(event) => setSearch(event.target.value)}
// //                   placeholder="Search make, model or stock number"
// //                   className="min-w-0 flex-1 bg-transparent font-montserrat text-[11px] text-black outline-none placeholder:text-black/30"
// //                 />

// //                 <button
// //                   type="submit"
// //                   className="group ml-4 flex shrink-0 cursor-pointer items-center gap-2 font-montserrat text-[9px] font-medium uppercase tracking-[0.18em] text-black"
// //                 >
// //                   Search
// //                   <ArrowUpRight
// //                     size={14}
// //                     strokeWidth={1.3}
// //                     className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
// //                   />
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       </section>

// //       {/* ======================================================
// //           03 — INVENTORY
// //       ====================================================== */}

// //       <section className="bg-white">
// //         <div className="mx-auto max-w-[1800px] px-6 py-10 md:px-10 md:py-12 lg:px-14 lg:py-14">
// //           {/* TOP TOOLBAR */}

// //           <div className="mb-8 flex items-center justify-between gap-5 border-b border-black/10 pb-5">
// //             <div>
// //               <p className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-black/35">
// //                 {pagination.total}{" "}
// //                 {pagination.total === 1 ? "vehicle" : "vehicles"} available
// //               </p>
// //             </div>

// //             <div className="flex items-center gap-3">
// //               {/* MOBILE FILTER BUTTON */}

// //               <button
// //                 type="button"
// //                 onClick={() => setMobileFiltersOpen(true)}
// //                 className="flex cursor-pointer items-center gap-2 border border-black/15 px-4 py-2.5 font-montserrat text-[9px] font-medium uppercase tracking-[0.16em] transition-colors duration-300 hover:border-black md:hidden"
// //               >
// //                 <SlidersHorizontal size={13} strokeWidth={1.3} />
// //                 Filters
// //                 {activeFilterCount > 0 && (
// //                   <span className="flex h-4 min-w-4 items-center justify-center bg-black px-1 text-[7px] text-white">
// //                     {activeFilterCount}
// //                   </span>
// //                 )}
// //               </button>

// //               {/* SORT */}

// //               <div className="relative">
// //                 <select
// //                   value={sort}
// //                   onChange={(event) =>
// //                     handleFilterChange(setSort, "sort", event.target.value)
// //                   }
// //                   className="h-10 cursor-pointer appearance-none border border-black/15 bg-white pl-4 pr-9 font-montserrat text-[9px] font-medium uppercase tracking-[0.14em] text-black outline-none transition-colors duration-300 hover:border-black focus:border-black"
// //                 >
// //                   {SORT_OPTIONS.map((option) => (
// //                     <option key={option.value} value={option.value}>
// //                       {option.label}
// //                     </option>
// //                   ))}
// //                 </select>

// //                 <ChevronDown
// //                   size={13}
// //                   strokeWidth={1.3}
// //                   className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/40"
// //                 />
// //               </div>
// //             </div>
// //           </div>

// //           <div className="grid gap-10 lg:grid-cols-[230px_1fr] xl:grid-cols-[250px_1fr]">
// //             {/* ==================================================
// //                 FILTERS
// //             ================================================== */}

// //             <aside className="hidden md:block">
// //               <FilterPanel
// //                 make={make}
// //                 setMake={setMake}
// //                 bodyType={bodyType}
// //                 setBodyType={setBodyType}
// //                 fuelType={fuelType}
// //                 setFuelType={setFuelType}
// //                 transmission={transmission}
// //                 setTransmission={setTransmission}
// //                 condition={condition}
// //                 setCondition={setCondition}
// //                 minPrice={minPrice}
// //                 setMinPrice={setMinPrice}
// //                 maxPrice={maxPrice}
// //                 setMaxPrice={setMaxPrice}
// //                 minYear={minYear}
// //                 setMinYear={setMinYear}
// //                 maxYear={maxYear}
// //                 setMaxYear={setMaxYear}
// //                 handleFilterChange={handleFilterChange}
// //                 handleRangeChange={handleRangeChange}
// //                 resetFilters={resetFilters}
// //               />
// //             </aside>

// //             {/* ==================================================
// //                 MOBILE FILTER OVERLAY
// //             ================================================== */}

// //             <AnimatePresence>
// //               {mobileFiltersOpen && (
// //                 <>
// //                   <motion.div
// //                     initial={{
// //                       opacity: 0,
// //                     }}
// //                     animate={{
// //                       opacity: 1,
// //                     }}
// //                     exit={{
// //                       opacity: 0,
// //                     }}
// //                     onClick={() => setMobileFiltersOpen(false)}
// //                     className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-[2px] md:hidden"
// //                   />

// //                   <motion.aside
// //                     initial={{
// //                       x: "100%",
// //                     }}
// //                     animate={{
// //                       x: 0,
// //                     }}
// //                     exit={{
// //                       x: "100%",
// //                     }}
// //                     transition={{
// //                       duration: 0.4,
// //                       ease: [0.22, 1, 0.36, 1],
// //                     }}
// //                     className="fixed inset-y-0 right-0 z-[100] w-[88%] max-w-sm overflow-y-auto bg-white p-6 md:hidden"
// //                   >
// //                     <div className="mb-8 flex items-center justify-between border-b border-black/10 pb-5">
// //                       <div>
// //                         <p className="font-montserrat text-[8px] uppercase tracking-[0.25em] text-black/35">
// //                           Refine
// //                         </p>

// //                         <h2 className="mt-1 font-bebas text-4xl leading-none">
// //                           Filters
// //                         </h2>
// //                       </div>

// //                       <button
// //                         type="button"
// //                         onClick={() => setMobileFiltersOpen(false)}
// //                         className="flex h-9 w-9 cursor-pointer items-center justify-center border border-black/15"
// //                       >
// //                         <X size={16} strokeWidth={1.3} />
// //                       </button>
// //                     </div>

// //                     <FilterPanel
// //                       make={make}
// //                       setMake={setMake}
// //                       bodyType={bodyType}
// //                       setBodyType={setBodyType}
// //                       fuelType={fuelType}
// //                       setFuelType={setFuelType}
// //                       transmission={transmission}
// //                       setTransmission={setTransmission}
// //                       condition={condition}
// //                       setCondition={setCondition}
// //                       minPrice={minPrice}
// //                       setMinPrice={setMinPrice}
// //                       maxPrice={maxPrice}
// //                       setMaxPrice={setMaxPrice}
// //                       minYear={minYear}
// //                       setMinYear={setMinYear}
// //                       maxYear={maxYear}
// //                       setMaxYear={setMaxYear}
// //                       handleFilterChange={handleFilterChange}
// //                       handleRangeChange={handleRangeChange}
// //                       resetFilters={resetFilters}
// //                     />

// //                     <button
// //                       type="button"
// //                       onClick={() => setMobileFiltersOpen(false)}
// //                       className="mt-8 flex w-full cursor-pointer items-center justify-center gap-3 bg-black py-4 font-montserrat text-[9px] font-medium uppercase tracking-[0.2em] text-white"
// //                     >
// //                       View vehicles
// //                       <ArrowUpRight size={14} strokeWidth={1.3} />
// //                     </button>
// //                   </motion.aside>
// //                 </>
// //               )}
// //             </AnimatePresence>

// //             {/* ==================================================
// //                 INVENTORY CONTENT
// //             ================================================== */}

// //             <div className="min-w-0">
// //               {error && (
// //                 <div className="mb-8 border border-black/10 bg-black/[0.02] p-5">
// //                   <p className="font-montserrat text-[9px] uppercase tracking-[0.16em] text-black/50">
// //                     {error}
// //                   </p>
// //                 </div>
// //               )}

// //               {loading ? (
// //                 <LoadingGrid />
// //               ) : cars.length > 0 ? (
// //                 <>
// //                   <AnimatePresence mode="popLayout">
// //                     <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 xl:grid-cols-3">
// //                       {cars.map((car, index) => (
// //                         <InventoryCard key={car._id} car={car} index={index} />
// //                       ))}
// //                     </div>
// //                   </AnimatePresence>

// //                   <Pagination
// //                     pagination={pagination}
// //                     onPageChange={fetchCars}
// //                   />
// //                 </>
// //               ) : (
// //                 <EmptyState onReset={resetFilters} />
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </section>
// //     </>
// //   );
// // }

// // /* ============================================================
// //    FILTER PANEL
// // ============================================================ */

// // function FilterPanel({
// //   make,
// //   setMake,
// //   bodyType,
// //   setBodyType,
// //   fuelType,
// //   setFuelType,
// //   transmission,
// //   setTransmission,
// //   condition,
// //   setCondition,
// //   minPrice,
// //   setMinPrice,
// //   maxPrice,
// //   setMaxPrice,
// //   minYear,
// //   setMinYear,
// //   maxYear,
// //   setMaxYear,
// //   handleFilterChange,
// //   handleRangeChange,
// //   resetFilters,
// // }) {
// //   return (
// //     <div className="border-t border-black/10">
// //       <div className="flex items-center justify-between border-b border-black/10 py-5">
// //         <div>
// //           <p className="font-montserrat text-[8px] uppercase tracking-[0.25em] text-black/30">
// //             Refine
// //           </p>

// //           <h2 className="mt-1 font-bebas text-3xl leading-none">Filters</h2>
// //         </div>

// //         <button
// //           type="button"
// //           onClick={resetFilters}
// //           className="cursor-pointer font-montserrat text-[8px] font-medium uppercase tracking-[0.16em] text-black/40 underline decoration-black/20 underline-offset-4 transition-colors duration-300 hover:text-black"
// //         >
// //           Clear all
// //         </button>
// //       </div>

// //       <div className="divide-y divide-black/10">
// //         <FilterSelect
// //           label="Make"
// //           value={make}
// //           onChange={(value) => handleFilterChange(setMake, "make", value)}
// //           options={MAKES}
// //         />

// //         <FilterSelect
// //           label="Body type"
// //           value={bodyType}
// //           onChange={(value) =>
// //             handleFilterChange(setBodyType, "bodyType", value)
// //           }
// //           options={BODY_TYPES}
// //         />

// //         <FilterSelect
// //           label="Fuel"
// //           value={fuelType}
// //           onChange={(value) =>
// //             handleFilterChange(setFuelType, "fuelType", value)
// //           }
// //           options={FUEL_TYPES}
// //         />

// //         <FilterSelect
// //           label="Transmission"
// //           value={transmission}
// //           onChange={(value) =>
// //             handleFilterChange(setTransmission, "transmission", value)
// //           }
// //           options={TRANSMISSIONS}
// //         />

// //         <FilterSelect
// //           label="Condition"
// //           value={condition}
// //           onChange={(value) =>
// //             handleFilterChange(setCondition, "condition", value)
// //           }
// //           options={CONDITIONS}
// //         />

// //         {/* PRICE */}

// //         <div className="py-5">
// //           <label className="mb-3 block font-montserrat text-[8px] font-medium uppercase tracking-[0.2em] text-black/40">
// //             Price
// //           </label>

// //           <div className="grid grid-cols-2 gap-2">
// //             <input
// //               type="number"
// //               min="0"
// //               value={minPrice}
// //               onChange={(event) => setMinPrice(event.target.value)}
// //               onBlur={(event) =>
// //                 handleRangeChange(setMinPrice, "minPrice", event.target.value)
// //               }
// //               placeholder="Min"
// //               className="h-10 w-full border border-black/15 bg-white px-3 font-montserrat text-[10px] outline-none placeholder:text-black/25 focus:border-black"
// //             />

// //             <input
// //               type="number"
// //               min="0"
// //               value={maxPrice}
// //               onChange={(event) => setMaxPrice(event.target.value)}
// //               onBlur={(event) =>
// //                 handleRangeChange(setMaxPrice, "maxPrice", event.target.value)
// //               }
// //               placeholder="Max"
// //               className="h-10 w-full border border-black/15 bg-white px-3 font-montserrat text-[10px] outline-none placeholder:text-black/25 focus:border-black"
// //             />
// //           </div>
// //         </div>

// //         {/* YEAR */}

// //         <div className="py-5">
// //           <label className="mb-3 block font-montserrat text-[8px] font-medium uppercase tracking-[0.2em] text-black/40">
// //             Year
// //           </label>

// //           <div className="grid grid-cols-2 gap-2">
// //             <input
// //               type="number"
// //               value={minYear}
// //               onChange={(event) => setMinYear(event.target.value)}
// //               onBlur={(event) =>
// //                 handleRangeChange(setMinYear, "minYear", event.target.value)
// //               }
// //               placeholder="From"
// //               className="h-10 w-full border border-black/15 bg-white px-3 font-montserrat text-[10px] outline-none placeholder:text-black/25 focus:border-black"
// //             />

// //             <input
// //               type="number"
// //               value={maxYear}
// //               onChange={(event) => setMaxYear(event.target.value)}
// //               onBlur={(event) =>
// //                 handleRangeChange(setMaxYear, "maxYear", event.target.value)
// //               }
// //               placeholder="To"
// //               className="h-10 w-full border border-black/15 bg-white px-3 font-montserrat text-[10px] outline-none placeholder:text-black/25 focus:border-black"
// //             />
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // /* ============================================================
// //    FILTER SELECT
// // ============================================================ */

// // function FilterSelect({ label, value, onChange, options }) {
// //   return (
// //     <div className="py-5">
// //       <label className="mb-3 block font-montserrat text-[8px] font-medium uppercase tracking-[0.2em] text-black/40">
// //         {label}
// //       </label>

// //       <div className="relative">
// //         <select
// //           value={value}
// //           onChange={(event) => onChange(event.target.value)}
// //           className="h-10 w-full cursor-pointer appearance-none border border-black/15 bg-white px-3 pr-8 font-montserrat text-[10px] text-black outline-none transition-colors duration-300 hover:border-black focus:border-black"
// //         >
// //           <option value="">All {label.toLowerCase()}</option>

// //           {options.map((option) => (
// //             <option key={option} value={option}>
// //               {option}
// //             </option>
// //           ))}
// //         </select>

// //         <ChevronDown
// //           size={13}
// //           strokeWidth={1.3}
// //           className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/35"
// //         />
// //       </div>
// //     </div>
// //   );
// // }

// // /* ============================================================
// //    INVENTORY CARD
// // ============================================================ */

// // function InventoryCard({ car, index }) {
// //   const image = car.images?.[0];

// //   const price = formatPrice(car.price, car.currency);

// //   const mileage = new Intl.NumberFormat("en-US").format(car.mileage || 0);

// //   return (
// //     <motion.article
// //       layout
// //       initial={{
// //         opacity: 0,
// //         y: 24,
// //       }}
// //       animate={{
// //         opacity: 1,
// //         y: 0,
// //       }}
// //       transition={{
// //         duration: 0.45,
// //         delay: Math.min(index * 0.05, 0.2),
// //         ease: [0.22, 1, 0.36, 1],
// //       }}
// //       className="group"
// //     >
// //       <Link href={`/cars/${car._id}`}>
// //         {/* IMAGE */}

// //         <div className="relative aspect-[4/3] overflow-hidden bg-[#f1f1ef]">
// //           {image?.url ? (
// //             <Image
// //               src={image.url}
// //               alt={image.alt || `${car.make} ${car.model}`}
// //               fill
// //               sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
// //               className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
// //             />
// //           ) : (
// //             <div className="flex h-full items-center justify-center">
// //               <span className="font-montserrat text-[9px] uppercase tracking-[0.2em] text-black/25">
// //                 No image available
// //               </span>
// //             </div>
// //           )}

// //           <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

// //           <div className="absolute md:left-4  md:top-4 top-1 left-1">
// //             <span className="bg-white px-3 py-2 font-montserrat text-[8px] font-medium uppercase tracking-[0.16em] text-black">
// //               {car.condition}
// //             </span>
// //           </div>

// //           <div className="absolute md:bottom-4 md:right-4 bottom-1 right-1 flex md:h-10 md:w-10 w-6 h-6 items-center justify-center bg-white text-black transition-all duration-300 group-hover:bg-black group-hover:text-white">
// //             <ArrowUpRight
// //               size={16}
// //               strokeWidth={1.3}
// //               className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
// //             />
// //           </div>
// //         </div>

// //         {/* INFORMATION */}

// //         <div className="border-b border-black/10 py-5 md:py-6">
// //           <div className="flex items-start justify-between gap-5">
// //             <div className="min-w-0">
// //               <p className="mb-2 font-montserrat text-[8px] font-medium uppercase tracking-[0.27em] text-black/35">
// //                 {car.make}
// //               </p>

// //               <h3 className="font-bebas text-3xl leading-[0.9] tracking-[-0.025em] text-black transition-opacity duration-300 group-hover:opacity-60 md:text-4xl">
// //                 {car.model}
// //               </h3>
// //             </div>

// //             <p className="shrink-0 pt-1 font-montserrat text-[11px] font-medium tracking-[0.02em] text-black md:text-xs">
// //               {price}
// //             </p>
// //           </div>

// //           <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 font-montserrat text-[8px] uppercase tracking-[0.16em] text-black/35">
// //             <span>{car.year}</span>

// //             <span className="h-[3px] w-[3px] rounded-full bg-black/20" />

// //             <span>
// //               {mileage} {car.mileageUnit}
// //             </span>

// //             <span className="h-[3px] w-[3px] rounded-full bg-black/20" />

// //             <span>{car.transmission}</span>

// //             <span className="h-[3px] w-[3px] rounded-full bg-black/20" />

// //             <span>{car.bodyType}</span>
// //           </div>

// //           <div className="mt-6 flex items-center justify-between">
// //             <span className="font-montserrat text-[8px] font-medium uppercase tracking-[0.18em] text-black/35">
// //               View vehicle
// //             </span>

// //             <span className="font-montserrat text-[8px] uppercase tracking-[0.18em] text-black/25">
// //               {car.stockNumber || "Available"}
// //             </span>
// //           </div>
// //         </div>
// //       </Link>
// //     </motion.article>
// //   );
// // }

// // /* ============================================================
// //    PRICE FORMATTER
// // ============================================================ */

// // function formatPrice(price, currency) {
// //   if (typeof price !== "number") {
// //     return "";
// //   }

// //   try {
// //     return new Intl.NumberFormat("en-US", {
// //       style: "currency",
// //       currency: currency || "USD",
// //       maximumFractionDigits: 0,
// //     }).format(price);
// //   } catch {
// //     return `${currency || "USD"} ${price.toLocaleString()}`;
// //   }
// // }

// // /* ============================================================
// //    PAGINATION
// // ============================================================ */

// // function Pagination({ pagination, onPageChange }) {
// //   if (pagination.totalPages <= 1) {
// //     return null;
// //   }

// //   return (
// //     <div className="mt-14 border-t border-black/10 pt-7">
// //       <div className="flex items-center justify-between">
// //         <button
// //           type="button"
// //           disabled={!pagination.hasPreviousPage}
// //           onClick={() => onPageChange(pagination.page - 1)}
// //           className="group flex cursor-pointer items-center gap-3 font-montserrat text-[8px] font-medium uppercase tracking-[0.2em] text-black transition-opacity duration-300 disabled:cursor-not-allowed disabled:opacity-20"
// //         >
// //           <ArrowLeft
// //             size={14}
// //             strokeWidth={1.2}
// //             className="transition-transform duration-300 group-hover:-translate-x-1"
// //           />
// //           Previous
// //         </button>

// //         <div className="flex items-center gap-3">
// //           <span className="font-montserrat text-[9px] tracking-[0.2em] text-black">
// //             {String(pagination.page).padStart(2, "0")}
// //           </span>

// //           <span className="h-px w-12 bg-black/15" />

// //           <span className="font-montserrat text-[9px] tracking-[0.2em] text-black/25">
// //             {String(pagination.totalPages).padStart(2, "0")}
// //           </span>
// //         </div>

// //         <button
// //           type="button"
// //           disabled={!pagination.hasNextPage}
// //           onClick={() => onPageChange(pagination.page + 1)}
// //           className="group flex cursor-pointer items-center gap-3 font-montserrat text-[8px] font-medium uppercase tracking-[0.2em] text-black transition-opacity duration-300 disabled:cursor-not-allowed disabled:opacity-20"
// //         >
// //           Next
// //           <ArrowRight
// //             size={14}
// //             strokeWidth={1.2}
// //             className="transition-transform duration-300 group-hover:translate-x-1"
// //           />
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // /* ============================================================
// //    EMPTY STATE
// // ============================================================ */

// // function EmptyState({ onReset }) {
// //   return (
// //     <div className="flex min-h-[420px] flex-col items-center justify-center border-t border-black/10 text-center">
// //       <p className="font-montserrat text-[8px] font-medium uppercase tracking-[0.3em] text-black/30">
// //         Collection
// //       </p>

// //       <h2 className="mt-4 font-bebas text-6xl leading-none tracking-[-0.03em] md:text-8xl">
// //         No Cars Found
// //       </h2>

// //       <p className="mt-5 max-w-md font-montserrat text-[10px] leading-[1.9] tracking-[0.04em] text-black/40 md:text-[11px]">
// //         We could not find vehicles matching your current selection. Try
// //         adjusting your filters to explore more of the collection.
// //       </p>

// //       <button
// //         type="button"
// //         onClick={onReset}
// //         className="group mt-8 inline-flex cursor-pointer items-center gap-3 bg-black px-6 py-3.5 font-montserrat text-[9px] font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-black/80"
// //       >
// //         Clear filters
// //         <ArrowUpRight
// //           size={14}
// //           strokeWidth={1.3}
// //           className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
// //         />
// //       </button>
// //     </div>
// //   );
// // }

// // /* ============================================================
// //    LOADING
// // ============================================================ */

// // function LoadingGrid() {
// //   return (
// //     <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 xl:grid-cols-3">
// //       {Array.from({
// //         length: 6,
// //       }).map((_, index) => (
// //         <motion.div
// //           key={index}
// //           initial={{
// //             opacity: 0,
// //           }}
// //           animate={{
// //             opacity: 1,
// //           }}
// //           transition={{
// //             delay: index * 0.05,
// //           }}
// //         >
// //           <div className="aspect-[4/3] animate-pulse bg-black/[0.045]" />

// //           <div className="border-b border-black/10 py-6">
// //             <div className="h-2 w-16 animate-pulse bg-black/[0.06]" />

// //             <div className="mt-3 h-8 w-3/4 animate-pulse bg-black/[0.06]" />

// //             <div className="mt-5 h-2 w-2/3 animate-pulse bg-black/[0.05]" />

// //             <div className="mt-6 h-2 w-1/3 animate-pulse bg-black/[0.05]" />
// //           </div>
// //         </motion.div>
// //       ))}
// //     </div>
// //   );
// // }
