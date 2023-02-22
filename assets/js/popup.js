const text = document.getElementById("notify-text");
const notify = document.getElementById("notify-button");
const reset = document.getElementById("notify-reset");

reset.addEventListener("click", () => {
  chrome.storage.local.clear();
  text.value = "";
});

notify.addEventListener("click", () => {
  chrome.runtime.sendMessage("", {
    type: "notification"
  });
});
