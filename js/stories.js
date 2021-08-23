"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <span id="favoriteStarOutline"><i class="far fa-star"></i></span>
        <span id="removeStoryIcon"><i class="fas fa-minus-circle"></i></span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        
      </li>
    `);
}


/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $favoriteStoriesList.hide();
  $allStoriesList.show();
}


// adding a story to API + updating the page to display new storylist
async function submitStory(evt){
  evt.preventDefault();
  console.log(evt);

  //get title, author, url from form
  const title = $("#story-title").val();
  const author = $("#story-author").val();
  const url = $("#story-url").val();

  console.log(title, author, url);

  //call addStory to post the story to the API
  const storySubmission = await storyList.addStory(currentUser, { title, author, url });
  console.log(storySubmission);

  //manage the UI -> hide the story submit form and display the new list of stories
  //$addStoryForm.trigger("reset");
  $addStoryForm.hide();
  putStoriesOnPage();

}

$addStoryForm.on("click", submitStory);


// delete a story:
// https://hack-or-snooze-v3.herokuapp.com/stories/storyId with a DELETE method
$body.on("click", function(e){
  e.preventDefault();
  if (currentUser){
    if (e.target.parentElement.id === "removeStoryIcon"){
      const storyId = e.target.parentElement.parentElement.id;
      storyList.removeStory(currentUser, storyId);
    }
    
  }
  
});






// add user favorites
  $body.on("click", function(e){
    e.preventDefault();
    if (currentUser){
      if (e.target.parentElement.id === "favoriteStarOutline"){
        const storyId = e.target.parentElement.parentElement.id;
        let elem = e.target.parentElement;
        const outlineStarHTML = `<i class="far fa-star"></i>`;
        const filledStarHTML = `<i class="fas fa-star"></i>`;

        if (elem.innerHTML === outlineStarHTML){
          elem.innerHTML = filledStarHTML;
          currentUser.addFavorite(storyId); 
        } else {
          elem.innerHTML = outlineStarHTML;
          currentUser.removeFavorite(storyId);
        }
      }
    }
  });