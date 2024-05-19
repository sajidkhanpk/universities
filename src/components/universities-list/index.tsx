import { useNavigate } from "react-router-dom";
import classes from "./styles.module.scss";
import Icon from "components/icons";
import { University } from "models/university";
import { useState } from "react";

interface UniversitiesListProps {
  universities: University[];
  onDelete?: (university: University) => void;
}

const UniversitiesList = ({
  universities,
  onDelete = () => {},
}: UniversitiesListProps) => {
  return (
    <ul className={classes.List}>
      {universities.map((university) => {
        return (
          <ListItem
            key={university.name}
            university={university}
            onDelete={onDelete}
          />
        );
      })}
    </ul>
  );
};

interface ListItemProps {
  university: University;
  onDelete: (university: University) => void;
}

function ListItem({ university, onDelete }: ListItemProps) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);

  function goTo(url: string) {
    navigate(url);
  }

  function cancelDelete(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsDeleting(false);
  }

  function startDelete(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();

    if (!isDeleting) {
      setIsDeleting(true);
    } else delteItem();
  }

  function delteItem() {
    setDeleteConfirmed(true);
    setTimeout(() => {
      onDelete(university);
    }, 250);
  }

  return (
    <li
      data-testid="university-list-item"
      className={`${classes.ListItem} ${
        deleteConfirmed ? classes.DeletingListItem : ""
      }`}
      onClick={() => goTo(`/${university.name.replace(/\s/g, "-")}`)}
    >
      <div className={classes.HeadingBox}>
        <h2 className={classes.UniversityName}>
          {!isDeleting ? university.name : "Deleting"}
        </h2>
        {isDeleting && (
          <button className={classes.CancelDeleteBtn} onClick={cancelDelete}>
            <Icon icon="cancel" />
          </button>
        )}
      </div>
      <button
        data-testid="university-delete-btn"
        className={`${classes.DeleteBtn} ${
          isDeleting ? classes.ActiveDeleteBtn : ""
        }`}
        onClick={startDelete}
      >
        {!isDeleting && <Icon icon="trash" />}
        {isDeleting && <Icon icon="complete" />}
      </button>
    </li>
  );
}

export default UniversitiesList;
