import classes from "./styles.module.scss";
import { University } from "models/university";

const UniversityDetails = ({ university }: { university: University }) => {
  function getDetails(key: keyof University) {
    if (university[key]) return university[key];
    return "N/A";
  }

  return (
    <div className={classes.Card}>
      <h2 data-testid="university-name" className={classes.UniversityName}>
        {university.name}
      </h2>
      <h3 className={classes.SectionTitle}>Location:</h3>
      <ul className={classes.Location}>
        <li>
          <p>
            <span>Country: </span>
            {getDetails("country")}
          </p>
        </li>
        <li>
          <p>
            <span>State: </span>
            {getDetails("stateProvince")}
          </p>
        </li>
        <li>
          <p>
            <span>Code: </span>
            {getDetails("alphaTwoCode")}
          </p>
        </li>
      </ul>
      <h3 className={classes.SectionTitle}>Domains:</h3>
      <ul className={classes.Domains}>
        {university.domains.map((domain: string) => {
          return <li key={domain}>{domain}</li>;
        })}
        {university.domains.length === 0 && "No domains."}
      </ul>
      <h3 className={classes.SectionTitle}>Web Pages:</h3>
      <ul className={classes.webPages}>
        {university.webPages.map((webPage: string) => {
          return (
            <li key={webPage}>
              <a href={webPage}>{webPage}</a>
            </li>
          );
        })}
        {university.webPages.length === 0 && "No Web pages."}
      </ul>
    </div>
  );
};

export default UniversityDetails;
