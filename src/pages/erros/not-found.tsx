import NotFound from "components/errors/not-found";
import classes from "./styles.module.scss";

const NotFoundPage = () => {
  return (
    <div className={classes.Container}>
      <NotFound />
    </div>
  );
};

export default NotFoundPage;
