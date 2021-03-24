//OIDC Client Configuration
Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.INFO;

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

//Helper functions
//Function to redirect page into OneLogin site for external auth
const redirectToLogin = (e) => {
  e.preventDefault();

  mgr
    .signinRedirect()
    .then(function () {
      console.log("signinRedirect done");
    })
    .catch(function (err) {
      console.log(err);
    });
}

//Function for handling the redirection when OneLogin has finished authenticating the user
const processLoginResponse = () => {
  mgr
    .signinRedirectCallback()
    .then(function (user) {
      console.log("signed in", user);

      displayAuthenticatedUser(user);
    })
    .catch(function (err) {
      console.log(err);
      document.getElementById("error").innerHTML =
        `<h3>Error</h3><pre><code>${err}</code></pre>`;
    });

    //Finally we remove the query string to clean up the current URL
    //window.location.href = window.location.href.split("#")[0];
}

//Setting-up logic for the login button
const constructLoginUI = () => {
  document
      .getElementById("login")
      .addEventListener("click", redirectToLogin, false);
};

//Setting-up logic for displaying the logged-in user's email and a logout button
const displayAuthenticatedUser = (user) => {
  document.getElementById("user").innerHTML = `${user.profile.email} <a id="logout" href="" class="btn">LOGOUT</a>`;
    document.getElementById("logout").addEventListener("click", ()=>{mgr.removeUser();});
};

//Main logic
mgr.getUser().then((user) => {
  if (user) {
    displayAuthenticatedUser(user);
  } else {
    constructLoginUI();

    //If there's a querystring with login details in the URL, then we've just came back from OneLogin and are authenticated, so we need to extract the user details from there
    if (window.location.href.indexOf("#") >= 0) {
      processLoginResponse();
    }
  }
});
