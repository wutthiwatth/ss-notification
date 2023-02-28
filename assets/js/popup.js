const text = document.getElementById("notify-text");
const notify = document.getElementById("notify-button");
const reset = document.getElementById("notify-reset");
const notifyOnoff = document.getElementById("notify-onoff");
const notiCount = document.getElementById("notiCount");
const pmCount = document.getElementById("pmCount");

reset.addEventListener("click", () => {
  chrome.runtime.sendMessage("", {
    type: "reset",
  });
});

notify.addEventListener("click", () => {
  chrome.runtime.sendMessage("", {
    type: "notification",
  });
});

chrome.storage.local.get(["noti_count"], (data) => {
  let value = data.noti_count || 0;
  notiCount.innerHTML = value;
});

chrome.storage.local.get(["pm_count"], (data) => {
  let value = data.pm_count || 0;
  pmCount.innerHTML = value;
});

chrome.storage.local.get(["onoff"], (data) => {
  let value = data.onoff || 1;
  if (value) {
    notifyOnoff.setAttribute("checked", "checked");
  }
});

notifyOnoff.addEventListener("click", () => {
  chrome.runtime.sendMessage("", {
    type: "switch",
  });
});
