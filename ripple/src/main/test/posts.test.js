/* Contains unit tests for posts.js file */

const postsModule = require('../webapp/posts');
const $ = require('jquery');
require('../__mocks__/localstorage');
const sinon = require('../node_modules/sinon/pkg/sinon.js');

/* Test checks that a user input in a post caption is correctly stored in local storage. */
test('saveCaption: test #1 Save user input for caption area', () => {
  localStorage.clear();
  // Set up our document body
  document.body.innerHTML =
    '<div>' +
    '  <textarea id="modal-caption">This is my caption!!!</textarea>' +
    '</div>';
  postsModule.saveCaption();
  expect(localStorage.getItem("caption")).toBe("This is my caption!!!");
});

/* Test checks that a post element is generated with the correct values. */
test('createPostElement: test #1 create a post element', () => {
  localStorage.clear();
  // Set up our document body
  const testPostElement = document.createElement('div');
  testPostElement.classList = "post";
  var content = `
      <div class="post-subwrapper space-between">
        <div class="post-header">
          <img id="post-avatar" src="/serve?blob-key=userBlobKey" class="post-profile-photo">
          <div class="post-user-business">
            <p class="boldest-text">userName</p>
            <p>businessName</p>
          </div>
        </div>
        <img class="post-share-icon" src="/images/post_share_icon.png">
      </div>
      <img src="/serve?blob-key=postBlobKey" class="post-photo image-resizing">
      <div class="post-line-height"> 
        <div class="post-subwrapper">
          <div class="space-between">
            <p>
              <span class="post-margin-right">
                <img class="heart-icon" src="/images/heart_icon.svg">
              </span>
               482
            </p>
            <p>2 hours ago</p>
          </div>
          <p>
            <span class="boldest-text">userName</span>
            caption
          </p>
          <p class="post-view-all" onclick="viewAllPostComments()"> View all 294 comments</p>
          <p>
            <span class="boldest-text">Sarah Wu</span>
            Love this photo!
          </p>
          <p>
            <span class="boldest-text">Smruthi Balajee</span>
            Wow, I'd really love to visit this place sometime!
          </p>
          <hr class="line-break-lighter">
          <textarea class="post-comments" id="add-comment" placeholder="Commenting publicly..."
              onkeypress="addComment(event)"></textarea>
        </div>
      </div>
  `;
  testPostElement.innerHTML = content;
  var userName = "userName";
  var userBlobKey = "userBlobKey";
  var businessName = "businessName";
  var postBlobKey = "postBlobKey";
  var caption = "caption";
  postElement = postsModule.createPostElement(userName, userBlobKey, businessName, postBlobKey, caption);
  expect(postElement).toEqual(testPostElement);
});