document.querySelectorAll('a[href]').forEach((anchor) => {
  var href = anchor.getAttribute("href");
  if (href === "#") return;
  if (href.startsWith(location.pathname + '#' || href.startsWith(location.pathname + '/#'))) {
    href = href
      .replace(location.pathname + '/', '')
      .replace(location.pathname, '');
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
