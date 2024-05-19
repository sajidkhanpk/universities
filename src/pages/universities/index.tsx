import UniversitiesList from "components/universities-list";
import {
  UniversityServices,
  UniversityStorageKeys,
} from "services/university-services";
import { useEffect, useMemo, useState } from "react";
import { University } from "models/university";
import { debounce } from "utils/helpter";
import classes from "./index.module.scss";
import Error from "components/errors";

enum SortOrder {
  ASCENDING = "asc",
  DESCENDING = "desc",
}

const AllUniversitesPage = () => {
  // API states
  const [isLoading, setisLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);

  // Filter and Sort states
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASCENDING);

  // Filter and Sort Universities
  const filteredAndSortedUniversities = useMemo(() => {
    let filteredUniversities = universities;

    // Filter
    if (searchText) {
      filteredUniversities = universities.filter((university) =>
        university.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Sort
    if (sortOrder === "asc") {
      filteredUniversities.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      filteredUniversities.sort((a, b) => b.name.localeCompare(a.name));
    }

    return filteredUniversities;
  }, [universities, searchText, sortOrder]);

  // Delete University
  function deleteHandler(deletingUniversity: University) {
    setUniversities((oldUniversities) => {
      const filteredUniversities = oldUniversities.filter(
        (university) => university !== deletingUniversity
      );

      UniversityServices.cacheData(
        UniversityStorageKeys.UNIVERSITIES,
        filteredUniversities
      );

      return filteredUniversities;
    });
  }

  useEffect(() => {
    UniversityServices.fetchUniversities({
      onSuccess: (data) => {
        setUniversities(data);
        setisLoading(false);
        setError(null);
      },
      onError: (err) => {
        setisLoading(false);
        setError(err);
      },
      config: { params: { country: "United Arab Emirates" } },
    });
  }, []);

  return (
    <div className={classes.Container}>
      <h1 data-testid="heading" className={classes.Heading}>
        Universities
      </h1>
      {isLoading && <h2>Loading...</h2>}
      {error && <Error />}
      {!isLoading && !error && (
        <Filter
          sortOrder={sortOrder}
          onSearchChange={(text) => setSearchText(text)}
          onSortChange={(sortOrder: SortOrder) => setSortOrder(sortOrder)}
        />
      )}
      {!isLoading && !error && (
        <UniversitiesList
          onDelete={deleteHandler}
          universities={filteredAndSortedUniversities}
        />
      )}
    </div>
  );
};

interface FilterProps {
  sortOrder: SortOrder;
  onSearchChange: (text: string) => void;
  onSortChange: (sortOrder: SortOrder) => void;
}

function Filter({ sortOrder, onSearchChange, onSortChange }: FilterProps) {
  const debouncedSearch = debounce(onSearchChange, 250);

  return (
    <div className={classes.FilterBox}>
      <input
        data-testid="search-input"
        type="text"
        placeholder="Search universities"
        onChange={(e) => debouncedSearch(e.target.value)}
      />
      <select
        data-testid="sort-select"
        value={sortOrder}
        onChange={(e) => onSortChange(e.target.value as SortOrder)}
      >
        <option value="" disabled>
          Sort Order
        </option>
        <option value={SortOrder.ASCENDING}>Ascending</option>
        <option value={SortOrder.DESCENDING}>Descending</option>
      </select>
    </div>
  );
}

export default AllUniversitesPage;
