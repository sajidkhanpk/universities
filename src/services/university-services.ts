import axios, { AxiosRequestConfig } from "axios";
import { plainToInstance } from "class-transformer";
import { University } from "models/university";

export enum UniversityStorageKeys {
  UNIVERSITIES = "universities",
}

interface UniversityDetailsProps {
  universityName: string;
  onSuccess: (universities: University) => void;
  onError: (err: Error) => void;
  onNotFound: () => void;
}

interface FetchUniversitiesProps {
  onSuccess: (universities: University[]) => void;
  onError: (err: Error) => void;
  config?: AxiosRequestConfig;
}

/* Class for providing services related to unviersities */
export class UniversityServices {
  static fetchUniversities({
    onSuccess,
    onError,
    config,
  }: FetchUniversitiesProps) {
    axios
      .get<University[]>(`http://universities.hipolabs.com/search`, config)
      .then((res) => {
        let universities = plainToInstance(University, res.data, {
          excludeExtraneousValues: true,
        });

        this.cacheData(UniversityStorageKeys.UNIVERSITIES, universities);

        onSuccess(universities);
      })
      .catch((error) => {
        if (this.hasCache(UniversityStorageKeys.UNIVERSITIES))
          onSuccess(this.getCache(UniversityStorageKeys.UNIVERSITIES));
        else onError(error);
      });
  }

  static hasCache(key: UniversityStorageKeys) {
    return Boolean(localStorage.getItem(key));
  }

  static getCache(key: UniversityStorageKeys) {
    return JSON.parse(localStorage.getItem(key) ?? "");
  }

  static cacheData(key: UniversityStorageKeys, data: any) {
    return localStorage.setItem(key, JSON.stringify(data));
  }

  static getDataFromCache(): University[] {
    if (this.hasCache(UniversityStorageKeys.UNIVERSITIES)) {
      return this.getCache(UniversityStorageKeys.UNIVERSITIES);
    }

    return [];
  }

  static getUniversityDetails({
    universityName,
    onSuccess,
    onError,
    onNotFound,
  }: UniversityDetailsProps) {
    universityName = universityName.replace(/\-/g, " ");

    if (this.hasCache(UniversityStorageKeys.UNIVERSITIES)) {
      const university = this.getCache(UniversityStorageKeys.UNIVERSITIES).find(
        (university: University) => university.name === universityName
      );

      if (university) onSuccess(university);
      else onNotFound();
    } else {
      this.fetchUniversities({
        onSuccess: (universities) => {
          const university = universities.find(
            (university: University) => university.name === universityName
          );
          if (university) onSuccess(university);
          else onNotFound();
        },
        onError,
      });
    }
  }
}
