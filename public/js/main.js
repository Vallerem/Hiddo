
$(document).ready(function() {
  
  /// Make the footer position great again
   var docHeight = $(window).height();
   var footerHeight = $('#footer').height();
   var footerTop = $('#footer').position().top + footerHeight;

   if (footerTop < docHeight) {
    $('#footer').css('margin-top', 10+ (docHeight - footerTop) + 'px');
   }

   // Changes current nav link to active 
   var pathname = window.location.pathname;
   $('.navbar-nav > li > a[href="'+pathname+'"]').parent().addClass('active');

   //Form data handler
   $( "#signup_form" ).submit(function(event) {
    if ($('div.form-check  :checkbox:checked').length <= 0) {
      event.preventDefault();
      $('div .alert-danger').remove();
      $('.avatar_img').prepend('<div class="alert alert-danger" role="alert"><strong>Hey, listen!</strong>  Please, select at least 1 interest.</div>');
      } 
    });

});