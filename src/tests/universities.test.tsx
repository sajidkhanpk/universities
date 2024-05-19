import { describe, it, expect, beforeEach, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import mockData from "./mock-data/universities.json";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import AllUniversitesPage from "pages/universities";
import { UniversityStorageKeys } from "services/university-services";

vi.mock("axios");

describe("Universities List page", () => {
  beforeEach(async () => {
    (axios.get as any).mockResolvedValue({
      data: mockData,
    });

    await act(async () =>
      render(
        <BrowserRouter>
          <AllUniversitesPage />
        </BrowserRouter>
      )
    );
  });

  it("should render the universities list page", async () => {
    const heading = screen.getByTestId("heading");
    expect(heading).toBeInTheDocument();
  });

  it("should render the universities list", async () => {
    const universities = screen.getAllByTestId("university-list-item");
    expect(universities.length).toEqual(37);
  });

  it("should render a search input", () => {
    const searchInput = screen.getByTestId("search-input");
    expect(searchInput).toBeInTheDocument();
  });

  it("should filter the universities list on searching", async () => {
    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "abu" } });

    // wait for debouncing
    await act(async () => new Promise((resolve) => setTimeout(resolve, 250)));

    const universities = screen.getAllByTestId("university-list-item");
    expect(universities.length).toEqual(3);
  });

  it("should decrease the list by deleting a university", async () => {
    const deleteBtns = screen.getAllByTestId("university-delete-btn");
    fireEvent.click(deleteBtns[0]);
    fireEvent.click(deleteBtns[0]);

    // wait for animation to end
    await act(async () => new Promise((resolve) => setTimeout(resolve, 250)));

    const universities = screen.getAllByTestId("university-list-item");
    expect(universities.length).toEqual(36);
  });
});

describe("Failed network request with cached data", () => {
  beforeEach(async () => {
    (axios.get as any).mockRejectedValueOnce(new Error("Some error"));

    await act(async () =>
      render(
        <BrowserRouter>
          <AllUniversitesPage />
        </BrowserRouter>
      )
    );
  });

  it("should get and display data from the cache", async () => {
    const universities = screen.getAllByTestId("university-list-item");
    // One university down due to delete test case
    expect(universities.length).toEqual(36);
  });
});

describe("Failed network request with no cached data", () => {
  beforeEach(async () => {
    (axios.get as any).mockRejectedValueOnce(new Error("Some error"));
    localStorage.removeItem(UniversityStorageKeys.UNIVERSITIES);

    await act(async () =>
      render(
        <BrowserRouter>
          <AllUniversitesPage />
        </BrowserRouter>
      )
    );
  });

  it("should display error when there is no data in cache", () => {
    const errorMessage = screen.getByTestId("error-message");

    expect(errorMessage).toBeInTheDocument();
  });
});
