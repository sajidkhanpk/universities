import { describe, it, expect, beforeEach, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import mockData from "./mock-data/universities.json";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import UniversityDetails from "components/university-details";
import { University } from "models/university";
import UniversityDetailsPage from "pages/universities/university";
import { UniversityStorageKeys } from "services/university-services";

vi.mock("axios");

describe("University Details page", () => {
  beforeEach(async () => {
    (axios.get as any).mockResolvedValue({
      data: mockData,
    });

    await act(async () =>
      render(
        <BrowserRouter>
          <UniversityDetails university={mockData[0] as University} />
        </BrowserRouter>
      )
    );
  });

  it("should render the university details", async () => {
    const heading = screen.getByText(
      "Mohamed bin Zayed University of Artificial Intelligence (MBZUAI)"
    );
    expect(heading).toBeInTheDocument();
  });
});

describe("Failed network request with cached data", () => {
  beforeEach(async () => {
    (axios.get as any).mockRejectedValueOnce(new Error("Some error"));

    localStorage.setItem(
      UniversityStorageKeys.UNIVERSITIES,
      JSON.stringify(mockData)
    );
  });

  it("should get and display university from the cache if found", async () => {
    vi.mock("react-router-dom", async (importOriginal) => {
      const actual = await importOriginal();
      return {
        ...(actual as any),
        useParams: () => ({ universityName: "American College Of Dubai" }),
      };
    });

    await act(async () =>
      render(
        <BrowserRouter>
          <UniversityDetailsPage />
        </BrowserRouter>
      )
    );

    const heading = screen.getByText("American College Of Dubai");
    expect(heading).toBeInTheDocument();
  });
});

describe("Failed network request with no cached data", () => {
  beforeEach(async () => {
    (axios.get as any).mockRejectedValueOnce(new Error("Some error"));

    localStorage.removeItem(UniversityStorageKeys.UNIVERSITIES);
  });

  it("should display error message", async () => {
    vi.mock("react-router-dom", async (importOriginal) => {
      const actual = await importOriginal();
      return {
        ...(actual as any),
        useParams: () => ({ universityName: "American College Of Dubai" }),
      };
    });

    await act(async () =>
      render(
        <BrowserRouter>
          <UniversityDetailsPage />
        </BrowserRouter>
      )
    );

    const errorMessage = screen.getByTestId("error-message");

    expect(errorMessage).toBeInTheDocument();
  });
});
