import { Expose } from "class-transformer";

export class University {
  @Expose()
  public readonly name: string;
  @Expose()
  public readonly country: string;
  @Expose({ name: "state-province" })
  public readonly stateProvince: string;
  @Expose({ name: "alpha_two_code" })
  public readonly alphaTwoCode: string;
  @Expose({ name: "web_pages" })
  public readonly webPages: string[];
  @Expose()
  public readonly domains: string[];

  constructor(
    name: string,
    country: string,
    alphaTwoCode: string,
    stateProvince: string,
    webPages: string[],
    domains: string[]
  ) {
    this.name = name;
    this.country = country;
    this.alphaTwoCode = alphaTwoCode;
    this.stateProvince = stateProvince;
    this.webPages = webPages;
    this.domains = domains;
  }
}
