//Inner (protected) site configs:
const BASE_INNER_SITE = "raw-site/index.htm";

//OIDC Client Configuration
Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.INFO;

//TODO: handle with config files
//http://localhost:5000 - "63903120-6f09-0139-86c4-0a1faab64165185719"
//https://github.com/ZippoLag/onelogin-pages-test - "b2afa500-5a9e-0139-e6b4-0668c6da8869185719"

const ONELOGIN_CLIENT_ID = "b2afa500-5a9e-0139-e6b4-0668c6da8869185719";
const ONELOGIN_SUBDOMAIN = "the-irc-dev";

var settings = {
  authority: "https://" + ONELOGIN_SUBDOMAIN + ".onelogin.com/oidc/2",
  client_id: ONELOGIN_CLIENT_ID,
  redirect_uri: window.location.href.split("#")[0].split("?")[0],
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
    document.getElementById("logout").addEventListener("click", ()=>{
      mgr.removeUser();
      window.location.href = window.location.href.split("#")[0].split("?")[0]
    });

    let innerUrl = window.location.href.includes('?innerUrl=') ? window.location.href.split('?innerUrl=')[1] : BASE_INNER_SITE;
    renderPage(innerUrl);
};

const renderPage = (url) => {
  document.getElementById("content").innerHTML = `<iframe id="iframe-site" src="${url}" style='width: 100%; height: 100%; border: none; overflow: hidden;'></iframe>`;

  var frame = document.getElementById('iframe-site');
  iframeURLChange(frame, function (iFrameUrl) {
    if(iFrameUrl){
      let baseUrl = window.location.href.split('#')[0].split('?innerUrl=')[0];
      let newUrl = baseUrl + '?innerUrl=' + iFrameUrl.split(baseUrl)[1];

      if(window.location.href !== newUrl){
        window.location.href = newUrl;
      }
    }
});
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
