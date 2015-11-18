var MFB = {};

MFB.statusChangeCallback = function (response) {
  console.log('statusChangeCallback');
  console.log(response);
  if (response.status === 'connected') {
      MFB.onLogin();
  } 
  else if (response.status === 'not_authorized') {
      // document.getElementById('status').innerHTML = 'Please log ' + ' into this app.';
  } 
  else {
      // document.getElementById('status').innerHTML = 'Please log ' + 'into Facebook.';
  }
};

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
MFB.checkLoginState = function () {
    FB.getLoginStatus(function(response) {
        MFB.statusChangeCallback(response);
    });
}

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
    FB.api('/me/feed', 'post', {
        'message': message
    }, function(response) {
        if (!response || response.error) {
            alert('Error occured');
        } else {
            alert('Post ID: ' + response.id);
        }
    });
}

MFB.getHeadImageUrl = function (fbid) {
    var link = "http://graph.facebook.com/" + fbid + "/picture";
    return link;
}

MFB.seedUI = function () {
    var publish = {
        // display: 'iframe',
        method: 'feed',
        picture: 'http://i.ytimg.com/vi/AaOuMOOsUzs/maxresdefault.jpg',
        link: 'https://www.facebook.com/ScottishLeaderTW/?fref=ts',
        name: '仕高利達!',
        caption: 'SCOTTISH LEADER',
        description: '怎麼搭都好吃'
    };
    FB.ui(publish, null);
}

window.fbAsyncInit = function() {
    console.log('fbAsyncInit');
    FB.init({
        appId: '312247938844229',
        cookie: true, // enable cookies to allow the server to access 
        xfbml: true, // parse social plugins on this page
        version: 'v2.2' // use version 2.2
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


