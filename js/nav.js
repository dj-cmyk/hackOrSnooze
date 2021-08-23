"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navLinksforLoggedInUsers.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}


/** Show submit story form on click on "submit" */
function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $favoriteStoriesList.hide();
  $addStoryForm.show();
}

$navSubmitStory.on("click", navSubmitClick);


/** Show user profile info and favorite stories */
function navShowUserProfile(evt) {
  hidePageComponents();
  $userProfileInfo.hide();
  showUserProfileInfo();
  $userProfileInfo.show();
}

$navUserProfile.on("click", navShowUserProfile);

function navShowUserStories(evt) {
  hidePageComponents();
  showUserOwnStories();
  $ownStoriesList.show();
}

$navOwnStories.on("click", navShowUserStories);

function navShowFavoriteStories(evt) {
  hidePageComponents();
  showUserFavorites();
  $favoriteStoriesList.show();
}


$navFavoriteStories.on("click", navShowFavoriteStories);