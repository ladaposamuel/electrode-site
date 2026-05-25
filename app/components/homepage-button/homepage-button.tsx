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
      className={`${styles.button} flex items-center hover:text-neutral-700 dark:hover:text-neutral-200 transition-all`}
      rel="noopener noreferrer"
      target="_blank"
      href={href}
    >
      {children}
    </a>
  );
};

export default HomepageButton;
