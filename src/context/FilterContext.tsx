"use client";

import { createContext, useContext, useState } from "react";

type FilterContextType = {
  search: string;
  setSearch: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
};

const FilterContext = createContext<FilterContextType | null>(null);

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <FilterContext.Provider
      value={{ search, setSearch, selectedCategory, setSelectedCategory }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};
