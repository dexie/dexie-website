prismHighlight = (function () {
  var map = new Map();
  function prismHighlight(nodeId, highlights) {
    var node = document.getElementById(nodeId);
    if (!Array.isArray(highlights))
      throw new TypeError("Expecting array as 2nd arg.");
    map.set(node, highlights);
  }
  function wrapTextNode(textNode) {
    var spanNode = document.createElement("span");
    var newTextNode = document.createTextNode(textNode.textContent);
    spanNode.appendChild(newTextNode);
    textNode.parentNode.replaceChild(spanNode, textNode);
    return spanNode;
  }

  function highlight(codeNode, highlighted) {
    //var code = document.querySelector('#update-dbdef-cloud');

    if (!codeNode || !highlighted) return;
    var nodes = codeNode.childNodes;
    var innerText = "";
    var lookup = [];
    var spans = [];
    for (var i = 0; i < nodes.length; ++i) {
      var node = nodes[i];
      var span = node.nodeType === 1 ? node : wrapTextNode(node);
      spans.push(span);
      // 1. record innerText.length
      var startPos = innerText.length;
      // 2. append span.innerText to innerText.
      var text = span.innerText;
      innerText += text;
      // 3. add [pos, end, span] to lookup.
      lookup.push([startPos, startPos + text.length, span, text]);
    }
    // TODO:
    // Free-text search for entries to highlight.
    // when found, lookup the spans it spans over.
    // add them to a Set.
    var spanSet = new Set();
    var newHighlighted = [];
    highlighted.forEach(function (needle) {
      if (needle instanceof RegExp) {
        var results = innerText.match(needle);
        if (results)
          for (let i = 0; i < results.length; ++i) {
            newHighlighted.push(results[i]);
          }
      } else if (typeof needle === "string") {
        newHighlighted.push(needle);
      }
    });
    highlighted = newHighlighted;
    for (var i = 0; i < highlighted.length; ++i) {
      var needle = highlighted[i];
      var startP = 0;
      while (startP >= 0 && startP < innerText.length) {
        var needleStart = innerText.indexOf(needle, startP);
        //if (startP > 0 && needleStart >= 0) debugger;
        startP = needleStart >= 0 ? needleStart + needle.length : -1;
        if (needleStart !== -1) {
          var needleEnd = needleStart + needle.length;
          for (var j = 0; j < lookup.length; ++j) {
            var start = lookup[j][0];
            var end = lookup[j][1];
            var span = lookup[j][2];
            var spanText = lookup[j][3];
            if (needleStart === start && needleEnd === end) {
              // Exact match.
              spanSet.add(span);
            } else if (needleStart < end && needleEnd > start) {
              spanSet.add(span);
              // overlap
              if (needleEnd < end) {
                // Start match but split ends:
                var newEnd = span.cloneNode();
                spans.push(newEnd);
                var splitPos = spanText.length - (end - needleEnd);
                newEnd.innerText = spanText.substr(splitPos);
                span.innerText = spanText.substr(0, splitPos);
                span.parentElement.insertBefore(newEnd, span.nextSibling);
                spanText = span.innerText;
              }
              if (needleStart > start) {
                // End match but split start:
                var newStart = span.cloneNode();
                spans.push(newStart);
                var splitPos = needleStart - start;
                newStart.innerText = spanText.substr(0, splitPos);
                span.innerText = spanText.substr(splitPos);
                span.parentElement.insertBefore(newStart, span);
              }
            }
          }
        }
      }
    }
    // Add opacity: 0.4 to all spans but the highlighted ones.
    for (var i = 0; i < spans.length; ++i) {
      var span = spans[i];
      if (!spanSet.has(span)) {
        span.style.opacity = 0.5;
      } else {
        span.style.textShadow = "0 0 20px #fff";
      }
    }
  }

  prismHighlight.highlight = function () {
    map.forEach((value, key) => {
      highlight(key, value);
    });
  };

  return prismHighlight;
})();
