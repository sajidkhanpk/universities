import UniversityDetails from "components/university-details";
import { University } from "models/university";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UniversityServices } from "services/university-services";
import classes from "./university.module.scss";
import Icon from "components/icons";
import ErrorPage from "pages/erros";
import NotFoundPage from "pages/erros/not-found";

const UniversityDetailsPage = () => {
  let { universityName = "" } = useParams();
  const [isLoading, setisLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [university, setUniversity] = useState<University | null>(null);

  // hooks
  const navigate = useNavigate();

  function goBack() {
    navigate("..");
  }

  useEffect(() => {
    UniversityServices.getUniversityDetails({
      universityName,
      onSuccess: (university) => {
        setUniversity(university);
        setisLoading(false);
        setError(null);
        setNotFound(false);
      },

      onNotFound: () => {
        setisLoading(false);
        setNotFound(true);
        setError(null);
      },
      onError: (err) => {
        setNotFound(false);
        setError(err);
        setisLoading(false);
      },
    });
  }, []);

  if (isLoading) {
    return (
      <div className={`${classes.Container} ${classes.Loading}`}>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (error) {
    return <ErrorPage />;
  }

  if (notFound) {
    return <NotFoundPage />;
  }

  return (
    <div className={classes.Container}>
      <button className={classes.BackBtn} onClick={goBack}>
        <Icon icon="arrow-left" /> <span>Go back</span>
      </button>
      <UniversityDetails university={university!} />
    </div>
  );
};

export default UniversityDetailsPage;
