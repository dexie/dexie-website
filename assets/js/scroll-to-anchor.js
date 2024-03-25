document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    var href = this.getAttribute("href");
    if (href === "#") return;
    var elem = document.querySelector(href);
    if (elem) {
      e.preventDefault();
      elem.scrollIntoView({
        behavior: "smooth",
      });
      history.pushState(null, null, location + href);
    }
  });
});
