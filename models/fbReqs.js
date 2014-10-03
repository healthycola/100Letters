var FB = require('fb');

var fbAPI = function(accessToken, callback) { 
    FB.setAccessToken(accessToken);
    FB.api('/me/friends', function (res) {
        if(!res || res.error) {
            console.log(!res ? 'error occurred' : res.error);
            return;
        }
        callback(res.data);
    });
};

module.exports.fbAPI = fbAPI;