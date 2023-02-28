chrome.runtime.onMessage.addListener(async (data) => {
  if (data.type === "notification") {
    getNoti();
  }
  if (data.type === "reset") {
    chrome.action.setBadgeText({ text: "" });
  }
  if (data.type === "switch") {
    const value = await chrome.storage.local.get("onoff");
    const newValue = value === 1 ? 0 : 1;
    await chrome.storage.local.set({ onoff: !value.onoff });
  }
});

chrome.notifications.onClicked.addListener(function(notificationId) {
  chrome.tabs.create({url: notificationId});
});  

chrome.runtime.onInstalled.addListener(() => {
  getNoti();
  chrome.storage.local.set({ onoff: 1 });
  chrome.contextMenus.create({
    id: "ssNotify",
    title: "SSNotify!: %s",
    contexts: ["selection"],
  });
});

chrome.alarms.create("Start", { periodInMinutes: 5 });

chrome.alarms.onAlarm.addListener(async function (alarm) {
  await getNoti();
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if ("notify" === info.menuItemId) {
    notify(info.selectionText);
  }
});

const getCookies = () => {
  var tmp = "";
  chrome.cookies.getAll({ domain: "www.soccersuck.com" }, (cookies) => {
    for (var i = 0; i < cookies.length; i++) {
      tmp = tmp + cookies[i].name + "=" + cookies[i].value + "; ";
      chrome.storage.local.set({ ssCookies: tmp });
      delete cookies[i].hostOnly;
      delete cookies[i].session;
      cookies[i].url = "https://www.soccersuck.com";
      try {
        chrome.cookies.set(cookies[i], () => {});
      } catch (e) {
        console.log(e);
      }
    }
  });
};

const getNoti = async () => {
  await getCookies();
  const url = "https://www.soccersuck.com";
  const options = {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  };
  fetch(url, options)
    .then(async (response) => {
      const data = await response.text();
      let noti_count = 0;
      let pm_count = 0;

      const startNoti = data.indexOf("header_noti_count");
      if (startNoti !== -1) {
        const endNoti = data.indexOf("</div>", startNoti);
        noti_count = data.substring(startNoti + 42, endNoti);
        noti_count = !isNaN(noti_count) ? parseInt(noti_count) : 0;
      }

      const startPm = data.indexOf("header_pm_count");
      if (startPm !== -1) {
        const endPm = data.indexOf("</div>", startPm);
        pm_count = data.substring(startPm + 42, endPm);
        pm_count = !isNaN(pm_count) ? parseInt(pm_count) : 0;
      }

      chrome.storage.local.set({ noti_count });
      chrome.storage.local.set({ pm_count });

      const total =
        noti_count + pm_count > 10 ? "10+" : (noti_count + pm_count).toString();
      if (total != "0") {
        chrome.action.setBadgeText({ text: total });
        const data = await chrome.storage.local.get("onoff");
        if (data.onoff === 1) {
          notify("คุณมี " + total + " การแจ้งเตือน");
        }
      }
    })
    .then((data) => {
      // console.log(data);
    });
};

const notify = async (message) => {
  return chrome.notifications.create(
    "https://www.soccersuck.com",
    {
      type: "basic",
      title: "Soccersuck!!",
      message: message,
      iconUrl: "/assets/icons/ss_logo_f_16.png",
    },
    () => {
      console.log("123");
    }
  );
};

