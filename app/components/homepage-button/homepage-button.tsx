import styles from "./homepage-button.module.scss";

export const HomepageButton = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <a
      className={styles.button}
      rel="noopener noreferrer"
      target="_blank"
      href={href}
    >
      {children}
    </a>
  );
};

export default HomepageButton;
