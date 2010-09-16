var tabs = require("tabs");
var simpleStorage = require("simple-storage");

tabs.onReady.add(function(tab){
  var phoneNumberRegex = /(\d{3})\-(\d{3})\-(\d{4})/g;
  var body = tab.contentDocument.body.innerHTML;
  body = body.replace(phoneNumberRegex, '<a class="dialtwilio" href="#">$&</a>');
  tab.contentDocument.body.innerHTML = body;
  tab.contentDocument.addEventListener("click", function(event){
    if (event.target.className == "dialtwilio") {
      initiateCall(event.target.innerHTML);
    }
  }, true);
});

function initiateCall(to) {
  if (!simpleStorage.storage.sid) {
    simpleStorage.storage.sid = tabs.activeTab.contentWindow.prompt("Please enter your Twilio Account Sid.");
  }
  if (!simpleStorage.storage.token) {
    simpleStorage.storage.token = tabs.activeTab.contentWindow.prompt("Please enter your Twilio Auth Token.");
  }
  if (!simpleStorage.storage.from) {
    simpleStorage.storage.from = tabs.activeTab.contentWindow.prompt("Please enter your phone number.");
  }

  require("request").Request({
    url: "https://" + simpleStorage.storage.sid + ":" + simpleStorage.storage.token + "@api.twilio.com/2008-08-01/Accounts/" + simpleStorage.storage.sid + "/Calls",
    content: {
      Caller: simpleStorage.storage.from,
      Called: simpleStorage.storage.from,
      Url: "http://twimlets.com/forward?PhoneNumber=" + to,
    },
    onComplete: function() {
       console.log(this.response.text);
    }
  }).post();
}