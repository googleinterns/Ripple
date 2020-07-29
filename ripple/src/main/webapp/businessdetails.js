/* When user clicks on a team member, add highlight to that avatar */
$(document).ready(function(){
  $(".bd-avatar").click(function() {
    $(".bd-avatar").removeClass("bd-team-highlight");
    $(this).addClass('bd-team-highlight');
   });
  });