
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



});