"use client";

import React, { useState } from "react";

interface HeaderSectionProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
}

export default function HeaderSection({ onSearch, isLoading }: HeaderSectionProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery("");
    }
  };

  return (
    <>
      <div className="redirect">
        <a
          href="https://github.com/zakiibnu723/Lively-Weather"
          target="_blank"
          rel="noopener noreferrer"
          className="github"
        >
          <img src="/asset/icons8-github-120.svg" alt="Go to github" />
          <p>View Github</p>
        </a>
      </div>

      <div className="search">
        <form onSubmit={handleSubmit}>
          <input
            className="search-bar"
            type="text"
            placeholder="Search Location"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
          />
          <button className="search-btn" type="submit" disabled={isLoading} aria-label="Search">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              style={{ fill: "rgba(255, 255, 255, 0.621)" }}
            >
              <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path>
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}
