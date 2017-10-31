/* Highlight all headings that has an ID with to enable linking to a
 certain header - the same way as github wiki works.
*/
[].slice.call(document.body.querySelectorAll("h1,h2,h3,h4,h5"))
.filter(header => header.id)
.forEach(function (header){
  var linkAnchor = document.createElement('a');
  linkAnchor.href = "#" + header.id;
  linkAnchor.className = "anchorlink";
  var linkIcon = document.createElement('i');
  linkIcon.className = "fa fa-link";
  linkIcon["aria-hidden"] = true;
  linkAnchor.appendChild(linkIcon);
  header.insertBefore(linkAnchor, header.firstChild);
  header.className = (header.className || "") + " anchorable";
});
