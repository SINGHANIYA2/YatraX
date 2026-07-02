const THEME_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("yatrax-theme");
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    root.style.colorScheme = theme;
    root.classList.add("no-transition");
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        root.classList.remove("no-transition");
      });
    });
  } catch (e) {}
})();
`;

export default function ThemeScript() {
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
