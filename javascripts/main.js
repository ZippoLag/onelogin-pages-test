Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.INFO;

//
// OIDC Client Configuration
//
const ONELOGIN_CLIENT_ID = "b2afa500-5a9e-0139-e6b4-0668c6da8869185719";
const ONELOGIN_SUBDOMAIN = "the-irc-dev";

var settings = {
  authority: "https://" + ONELOGIN_SUBDOMAIN + ".onelogin.com/oidc/2",
  client_id: ONELOGIN_CLIENT_ID,
  redirect_uri: window.location.href,
  response_type: "id_token token",
  scope: "openid profile",

  filterProtocolClaims: true,
  loadUserInfo: true,
};
var mgr = new Oidc.UserManager(settings);

mgr.getUser().then((user) => {
  if (user) {
    document.getElementById("user").innerHTML = `${user.profile.email} <a id="logout" href="" class="btn">LOGOUT</a>`;
    document.getElementById("logout").addEventListener("click", ()=>{mgr.removeUser();});
  } else {
    document
      .getElementById("login")
      .addEventListener("click", redirectToLogin, false);

    //
    // Redirect to OneLogin to authenticate the user
    //
    function redirectToLogin(e) {
      e.preventDefault();

      mgr
        .signinRedirect({ state: "some data" })
        .then(function () {
          console.log("signinRedirect done");
        })
        .catch(function (err) {
          console.log(err);
        });
    }

    //
    // Handle the authentication response returned
    // by OneLogin after the user has attempted to authenticate
    //
    function processLoginResponse() {
      mgr
        .signinRedirectCallback()
        .then(function (user) {
          console.log("signed in", user);

          document.getElementById("loginResult").innerHTML =
            "<h3>Success</h3><pre><code>" +
            JSON.stringify(user, null, 2) +
            "</code></pre>";
        })
        .catch(function (err) {
          console.log(err);
          document.getElementById("error").innerHTML =
            "<h3>Error</h3><pre><code>" + err + "</code></pre>";
        });
    }

    //
    // Look out for a authentication response
    // then log it and handle it
    //
    if (window.location.href.indexOf("#") >= 0) {
      processLoginResponse();
    }
  }
});
