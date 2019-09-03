function setOffline (checked) {
  if (!('serviceWorker' in navigator)) {
    event.preventDefault();
    return;
  }
  var offlineSwitch = document.getElementById("offline-switch");
  offlineSwitch.className = checked ? "checked" : "";

  if (checked) {
    localStorage.setItem("offline", "true");
    navigator.serviceWorker.register('/sw.js').then(function (registration) {
      console.log('Service Worker registration successful with scope: ', registration.scope);
    }).catch(function (err) {
      var checkbox = document.getElementById("offline-checkbox");
      checkbox.checked = false;
      offlineSwitch.className = "";
    });
  } else {
    localStorage.setItem("offline", "false");
    navigator.serviceWorker.getRegistration("/sw.js").then(function (reg) {
      console.log("Unregistering...");
      return reg.unregister();
    }).then(function (res) {
      console.log("Unregistered", res);
    }).catch(function(error) {
      console.error(error);
    });
  }
}

function updateSwitchFromStorage() {
  var offlineSwitch = document.getElementById("offline-switch");
  var offline = localStorage.getItem("offline");
  offlineSwitch.className = offline === "true" ? "checked" : "";
  var checkbox = document.getElementById("offline-checkbox");
  checkbox.checked = offline === "true" ? true : false;
  if (!offline && ('serviceWorker' in navigator)) {
    // Update the switch if offline is not in localstorage but site is indeed offline
    navigator.serviceWorker.getRegistration("/sw.js").then(function (reg) {
      if (reg) {
        offlineSwitch.className = "checked";
        var checkbox = document.getElementById("offline-checkbox");
        checkbox.checked = true;
        localStorage.setItem("offline", "true");
      }
    });
  }
}

