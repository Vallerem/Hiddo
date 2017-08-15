$(document).ready(function() {

  /// Make the footer position great again
  var docHeight = $(window).height();
  var footerHeight = $('#footer').height();
  var footerTop = $('#footer').position().top + footerHeight;

  if (footerTop < docHeight) {
    $('#footer').css('margin-top', 10 + (docHeight - footerTop) + 'px');
  }

  // Changes current nav link to active 
  var pathname = window.location.pathname;
  $('.navbar-nav > li > a[href="' + pathname + '"]').parent().addClass('active');

  // Form data handler for checkboxes on signup
  $("#signup_form").submit(function(event) {
    if ($('span.button-checkbox  :checkbox:checked').length <= 0) {
      event.preventDefault();
      $('div .alert-danger').remove();
      $('.avatar_img').prepend('<div class="alert alert-danger" role="alert"><strong>Hey, listen!</strong>  Please, select at least 1 interest.</div>');
    }
  });

  // Prevents multiple form submits
  $('form.contact-form, form.signup_form').submit(function(){
  $(this).find(':submit').attr('disabled','disabled');
  });

  // Hide Navbar on !focus (click on main/footer div)
  $('main, footer').on('click', function() {
    $('.navbar-collapse').removeClass('show');
  });


  //Checkboxes on Sign up form 
  $('.button-checkbox').each(function() {
    var $widget = $(this),
      $button = $widget.find('button'),
      $checkbox = $widget.find('input:checkbox'),
      color = $button.data('color'),
      settings = {
        on: {
          icon: 'fa fa-check-circle'
        },
        off: {
          icon: 'fa fa-circle-thin'
        }
      };
    $button.on('click', function() {
      $checkbox.prop('checked', !$checkbox.is(':checked'));
      $checkbox.triggerHandler('change');
      updateDisplay();
    });
    $checkbox.on('change', function() {
      updateDisplay();
    });

    function updateDisplay() {
      var isChecked = $checkbox.is(':checked');
      $button.data('state', (isChecked) ? "on" : "off");
      $button.find('.state-icon')
        .removeClass()
        .addClass('state-icon ' + settings[$button.data('state')].icon);
      if (isChecked) {
        $button
          .removeClass('btn-default')
          .addClass('btn-' + color + ' active');
      } else {
        $button
          .removeClass('btn-' + color + ' active')
          .addClass('btn-default');
      }
    }

    function init() {

      updateDisplay();
      if ($button.find('.state-icon').length == 0) {
        $button.prepend('<i class="state-icon ' + settings[$button.data('state')].icon + '"></i> ');
      }
    }
    init();
  });









});