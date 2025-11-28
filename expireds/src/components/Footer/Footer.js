export const Footer = () => {
  return (
    <footer className="footer">
      <p>©</p>
      <a href="/">{new Date().getFullYear()} {process.env.NEXT_PUBLIC_BRAND}</a>
    </footer>
  );
};
