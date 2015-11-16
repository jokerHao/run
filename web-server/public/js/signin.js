function statusChangeCallback(response) {
  console.log('statusChangeCallback');
  console.log(response);
  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
  if (response.status === 'connected') {
    // Logged into your app and Facebook.
    onLogin();
  } 
  else if (response.status === 'not_authorized') {
    // The person is logged into Facebook, but not your app.
    document.getElementById('status').innerHTML = 'Please log ' +
      'into this app.';
  } 
  else {
    // The person is not logged into Facebook, so we're not sure if
    // they are logged into this app or not.
    document.getElementById('status').innerHTML = 'Please log ' +
      'into Facebook.';
  }
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

window.fbAsyncInit = function() {
  console.log('fbAsyncInit');
  FB.init({
    appId      : '312247938844229',
    cookie     : true,  // enable cookies to allow the server to access 
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.2' // use version 2.2
  });
};

// Load the SDK asynchronously
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function onLogin() {
  console.log('Welcome!  Fetching your information.... ');
  FB.api('/me', function(response) {
    console.log('Successful login for: ' + response.name);
    console.log(response);

    game.register(response.name, 01, function(err, data){
      if (err) {
        document.getElementById('status').innerHTML = '報名失敗 : ' + response.name + '!';
      }
      else {
        document.getElementById('status').innerHTML = '報名成功 : ' + response.name + '!';
      }
    });
  });
}

function seed (message) {
  FB.api('/me/feed', 'post', {'message': message}, function(response) {
    if (!response || response.error) {
      alert('Error occured');
    } 
    else {
      alert('Post ID: ' + response.id);
    }
  });
}

function getHeadImageUrl (fbid) {
  var link = "http://graph.facebook.com/" + fbid + "/picture";
  return link;
}