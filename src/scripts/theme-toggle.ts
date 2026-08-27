/**
 * Dark-mode toggle. Cycles between system / dark / light, persists to
 * localStorage, and updates the toggle's icon.
 */

const button = document.querySelector<HTMLButtonElement>(".theme-toggle")
if (button) {
  const icon = button.querySelector<HTMLElement>(".theme-toggle-icon")
  const update = () => {
    const current = document.documentElement.getAttribute("data-theme") ?? "system"
    if (icon) icon.setAttribute("data-state", current)
    button.setAttribute(
      "aria-label",
      current === "dark"
        ? "Switch to light mode"
        : current === "light"
          ? "Switch to system theme"
          : "Switch to dark mode",
    )
  }
  button.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme")
    const next = current === "dark" ? "light" : current === "light" ? null : "dark"
    if (next) {
      document.documentElement.setAttribute("data-theme", next)
      localStorage.setItem("isx-theme", next)
    } else {
      document.documentElement.removeAttribute("data-theme")
      localStorage.removeItem("isx-theme")
    }
    update()
  })
  update()
}
