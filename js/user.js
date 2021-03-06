"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */

async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // grab the username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // User.login retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.login(username, password);

  $loginForm.trigger("reset");

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();
}

$loginForm.on("click", login);

/** Handle signup form submission. */

async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // User.signup retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.signup(username, password, name);

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();

  $signupForm.trigger("reset");
}

$signupForm.on("submit", signup);

/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");

  $allStoriesList.show();

  updateNavOnLogin();
}


//show created time/list of favorites
function showUserProfileInfo(){
    const userMarkup = $(`
      <li>Username: "${currentUser.username}"</li>
      <li>Created At: "${currentUser.createdAt}"</li>
      `);
    $userProfileInfoUl.append(userMarkup);
    showUserFavorites();
  }


function showUserFavorites(){
  if(currentUser.favorites.length >= 1){
    $favoriteStoriesList.empty();
    // loop through favorite stories and generate HTML for them
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoriteStoriesList.append($story);
    }
    $favoriteStoriesList.show();
  } else {
    console.log("no favorites");
  }
}

function hideUserProfileInfo(){
  $favoriteStoriesList.hide();
}



function showUserOwnStories(){
  if(currentUser.ownStories.length >= 1){
    $ownStoriesList.empty();
    // loop through own stories and generate HTML for them - include edit and remove icons
    for (let story of currentUser.ownStories) {
      const $story = generateOwnStoryMarkup(story);
      $ownStoriesList.append($story);
    }
    $ownStoriesList.show();
  } else {
    $ownStoriesList.append(`<h4>Submit Your First Story</h4>`)
    $addStoryForm.show();
  }
}