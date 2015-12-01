var MFB = {};

MFB.getLoginStatus = function (next) {
    FB.getLoginStatus(function(response) {
      console.log('getLoginStatus');
      console.log(response);
      if (response.status === 'connected') {
          next();
      } 
      else if (response.status === 'not_authorized') {
          // document.getElementById('status').innerHTML = 'Please log ' + ' into this app.';
      } 
      else {
          // document.getElementById('status').innerHTML = 'Please log ' + 'into Facebook.';
      }
    });
};

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
MFB.onLogin = function () {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
        console.log('Successful login for: ' + response.name);
        console.log(response);
        game.register(response.name, 01, function(err, data) {
            if (err) {
                document.getElementById('status').innerHTML = '報名失敗 : ' + response.name + '!';
            } else {
                document.getElementById('status').innerHTML = '報名成功 : ' + response.name + '!';
            }
        });
    });
}



MFB.seed = function (message) {
    FB.getLoginStatus(function(response) {
      console.log('getLoginStatus');
      console.log(response);
      if (response.status === 'connected') {
        FB.api('/me/feed', 'post', {'message': message}, function(response) {
            if (!response || response.error) {
                alert('Error occured');
            } 
            else {
                alert('Post ID: ' + response.id);
            }
        });
      } 
      else if (response.status === 'not_authorized') {
          // document.getElementById('status').innerHTML = 'Please log ' + ' into this app.';
      } 
      else {
          // document.getElementById('status').innerHTML = 'Please log ' + 'into Facebook.';
      }
    });
}

MFB.getHeadImageUrl = function (fbid) {
    var link = "http://graph.facebook.com/" + fbid + "/picture";
    return link;
}

MFB.seedUI = function (callback) {
    var publish = {
        // display: 'iframe',
        method: 'feed',
        picture: 'http://52.11.186.93:3000/images/logo.jpg',
        link: 'https://developers.facebook.com/docs/',
        name: '仕高利達 怎麼搭都好吃',
        caption: 'SCOTTISH LEADER',
        description: '挑戰最高1500元歡樂加菜金!!'
    };
    FB.ui(publish, callback);
}

window.fbAsyncInit = function() {
    console.log('fbAsyncInit');
    FB.init({
        appId: '414925542034341',

        // test
        // appId : '312247938844229',

        cookie: true, // enable cookies to allow the server to access 
        xfbml: true, // parse social plugins on this page
        version: 'v2.5' // use version 2.2
    });
};

// Load the SDK asynchronously
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/zh_TW/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


