function send(msg,token){
  UrlFetchApp.fetch("https://notify-api.line.me/api/notify", {
    "method"  : "post",
    "payload" : {"message" : msg },
    "headers" : {"Authorization" : "Bearer " + token }
  });
}