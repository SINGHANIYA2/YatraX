// Inline, render-blocking script that sets the correct theme class on
// <html> before React hydrates. This prevents the "flash" of the wrong
// theme on page load / refresh. It reads the saved preference from
// localStorage, and falls back to the OS/browser color-scheme on a
// user's first visit.
const themeInitScript = `
(function () {
  try {
    var stored = window.localStorage.getItem("yatrax-theme");
    var theme = stored;
    if (!theme) {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  } catch (e) {}
})();
`;

export default function ThemeScript() {
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />;
}
