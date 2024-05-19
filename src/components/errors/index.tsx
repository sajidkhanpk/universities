import classes from "./styles.module.scss";

const Error = () => {
  return (
    <div data-testid="error-message" className={classes.TextContainer}>
      <h1>Something</h1>
      <h2>went wrong</h2>
    </div>
  );
};

export default Error;
