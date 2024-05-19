import sprite from "/svg/sprite.svg";

const Icon = ({ icon }: { icon: string }) => {
  return (
    <svg>
      <use href={`${sprite}#icon-${icon}`} />
    </svg>
  );
};

export default Icon;
