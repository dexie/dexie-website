document.querySelectorAll('a[href]').forEach((anchor) => {
  let href = anchor.getAttribute("href");
  if (!/#/.test(href)) return;
  if (href === "#") return;
  let currentPath = location.pathname;
  if (currentPath.endsWith('/')) {
    currentPath = currentPath.slice(0, -1);
  }
  if (href.startsWith(currentPath + '#' || href.startsWith(currentPath + '/#'))) {
    href = href
      .replace(currentPath + '/', '')
      .replace(currentPath, '');
  }
  if (href.startsWith('#')) {
    anchor.addEventListener("click", function (e) {
      var elem = document.querySelector(href);
      if (elem) {
        e.preventDefault();
        elem.scrollIntoView({
          behavior: "smooth",
        });
        history.pushState(null, null, location.href.split('#')[0] + href);
      }
    });
  }
});
