var FB = require('fb');

var fbAPI = function(accessToken) { 
    FB.setAccessToken(accessToken);
    FB.api('/me/friends', function (res) {
  if(!res || res.error) {
   console.log(!res ? 'error occurred' : res.error);
   return;
  }
  console.log(res.data[0].name);
});
};

module.exports.fbAPI = fbAPI;