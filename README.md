# onelogin-pages-test
Testing if it's feasible to have a pure-frontend site with onelogin authorization working on github pages.

1. You must first go to onelogin.com and create a developer account, for this you will have to provide an organization name. This organization name is used for logging into the administration site and will be needed for configuring your login code in `main.js` under `ONELOGIN_SUBDOMAIN`. As this PoC was commissioned by the IRC, I created "the-irc-dev", so my admin site is `https://the-irc-dev.onelogin.com`.
2. After logged into the admin site in onelogin.com, go to the `Users` section and create a new test user, be sure to set it's `username` and `email` fields
3. Then go to the `Applications` section and add a new "OpenId Connect (OIDC)" application, add it's name and save it to create it. Then go to the `Configuration` tab and set the `Login Url` to "http://localhost:5000" (assuming that's where your dev server will be running, for example with `npx serve`). In that same section also add a line for "http://localhost:5000/oauth/callback", "http://localhost:5000/" and "http://localhost:5000" (all URLs should be without double quotes).
4. In the `SSO` tab, within the Application section, copy your Client ID and paste it in `main.js` under `ONELOGIN_CLIENT_ID`. Ensure that `Application Type` is set to "Web" and `Token Endpoint` to "POST".
5. Under the `Users` tab of the Application, select your test user and save.
6. Serve this project locally and try authenticating by clicking on the "LOGIN" link (you may now use the "forgot password" link within the login page to generate the test user's password if you haven't done so by other means).
7. If this test was successful, then you may want to deploy the project on github pages. You must first note that each Application can only have one valid login URL, so you must either switch it (and it's Redirect URI's) from "http://localhost:5000" to your published site (in my case, "https://zippolag.github.io/onelogin-pages-test"), or create and set-up a new Application and ensure that the code you've committed and pushed into the branch you're using for the public page has it's `ONELOGIN_CLIENT_ID` (and that you've give access to the User!). Trying to log into an Application from a URL that doesn't match it's allowed `Login Url` will fail, so you can't have a local development server and a public page working at the same time for the same Application.

## Troubleshooting
. `End-user does not have access to this application`:

1. Check your admin account to ensure you have given access to your application to the test user you're trying to login with.
2. Enter "yoursubdomain.onelogin.com/login2" in your browser and see if you're already logged-in with an different user that's not the test user (this may be the case if you're using the same browser for accessing the OneLogin admin than for opening your test page, you can either give your real user account access to the app, or use a private tab or another browser to open your test page)
