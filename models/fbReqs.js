var FB = require('fb');

var fbAPI = function(profileID) { 
    FB.setAccessToken(profileID);
    FB.api('/me', function (res) {
  console.log(profileID);
  if(!res || res.error) {
   console.log(!res ? 'error occurred' : res.error);
   return;
  }
  console.log(res.id);
  console.log(res.name);
});
};

module.exports.fbAPI = fbAPI;