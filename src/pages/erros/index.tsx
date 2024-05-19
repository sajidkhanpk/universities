import Error from "components/errors";
import classes from "./styles.module.scss";

const ErrorPage = () => {
  return (
    <div className={classes.Container}>
      <Error />
    </div>
  );
};

export default ErrorPage;
