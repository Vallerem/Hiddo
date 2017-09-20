function resize() {
    if ($(window).width() > 740) {
     $('.li-user-dropdown').addClass('flex-last');
    }
    else {$('.li-user-dropdown').removeClass('flex-last');}
    }
  $(window).resize(resize);
  resize();

  var spotLat, spotLong, lati, longi, arrLength, searchedLength;

  // Makes the last image to show full width 

  if (arrLength !== undefined) {
  if (arrLength % 2 !== 0) {
    $('.searched-spot').last()
    .removeClass('col-md-6')
    .addClass('col-md-12')
  }
}

if (searchedLength !== undefined) {
  if (searchedLength % 2 !== 0) {
    $('.searched-spot').last()
    .removeClass('col-md-6')
    .addClass('col-md-12')
  }
}








$(document).ready(function() {

  // changes the position of the user dropdown
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

  // Invalidates using space bar on login / logout
  $('.main input[type=text], .main input[type=password], #signup_form #username ,      #signup_form #mail, #signup_form #password')
      .on('keypress', function(e) {
        if (e.which == 32)
            return false;
  });
  
  // Form data handler for checkboxes on signup
  $("#signup_form").submit(function(event) {
    if ($('span.button-checkbox  :checkbox:checked').length <= 0) {
      event.preventDefault();
      $('div .alert-danger').remove();
      $('.avatar_img').prepend('<div class="alert alert-danger" role="alert"><strong>Hey, listen!</strong>  Please, select at least 1 interest.</div>');
      $("#signup_form").unbind("submit", preventDefault);
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

  // handler for the new spot form

  $('#spot_form, #update-spot').submit(function(e){
   if ($('#spot-latitude').val() && $('#spot-longitude').val() === "undefined") {
     e.preventDefault()
     $('.no-loc').remove();
     $('.make-spot').prepend(`<p class="alert alert-danger no-loc"> <strong>You need to select a location for your spot</strong></p>`);
   } else {
     $(this).find(':submit').attr('disabled','disabled');
   }
  });
  
  // shows a google maps for the user to search an existing location

  $('#existing-location').click(function(e){
    $('.no-loc').remove();
    $('.existing-loc').removeClass('hidden');
    $('#google_map').addClass('hidden');
    $('.alert-loc-saved').remove();
    $('#save-existing-location').show();
  })

  $('#save-existing-location').click(function(e){
    $('.no-loc').remove();
    $('#spot-latitude').val(spotLat);
    $('#spot-longitude').val(spotLng);
    if (spotLat || spotLng !== undefined) {
      $('.alert-no-loc, .alert-loc-saved').remove();
      $('.existing-loc').prepend(`<p class="alert alert-success alert-loc-saved">Spot location saved near: <strong>${spotName} </strong></p>`);
    } else {
      $('.alert-no-loc').remove();
      $('.existing-loc').prepend(`<p class="alert alert-danger alert-no-loc"> <strong>You must select an existing location first</strong></p>`);
    }
    
  })

  // Gets the current location of the user in the "new-spot" form

 $('#current-location').on('click', function(e){
   $('.alert-loc-saved').remove();
   $('#save-existing-location').hide()
   $(this)
   .empty()
   .prepend('<i class="fa fa-refresh fa-spin"></i> Searching...')
   .prop('disabled', true);
   $('.existing-loc').addClass('hidden');
   $('.no-loc').remove();

 if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function (position) {
    const center = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    console.log('User position: ', center)
      $('#spot-latitude').val(center.lat);
      $('#spot-longitude').val(center.lng);
      $('#current-location')
      .empty()
      .prop('disabled', false)
      .prepend('Use current location')
      $('.use-current-location').append('<p class="alert alert-success alert-loc-saved"><strong>Spot location saved</strong></p>')
      $('#google_map').removeClass('hidden');
      
      function currentLocation() {
      var userLocation = {
        lat: center.lat, 
        lng: center.lng};
      var mapu = new google.maps.Map(
        document.getElementById('google_map'), 
        {
          zoom: 16,
          center: userLocation,
          mapTypeId: 'hybrid'
        }
      );
        var userMarker = new google.maps.Marker({
    position: {
      lat: userLocation.lat, 
      lng: userLocation.lng
    },
    map: mapu,
    label: {
      color: 'white',
      fontWeight: 'bold',
      text: 'You are here',
    },
  }); 
}
  currentLocation();}, function () {
    alert('Error in the geolocation service.');
    });
    } else {
      alert('Browser does not support geolocation.');
    }
  });







  // Update user image (ajax call)
  $('.update-image').on('submit', function(e){
    e.preventDefault()

    let fd = new FormData();    
    fd.append('userfile', $('#newImg')[0].files[0]);

    let data = {
      oldImg: $('#oldImg').val() ,
      newImg: fd
    } 

    $.ajax({
      url: "/avatar-img",
      data: data,
      type: 'POST',
      processData: false,
      contentType: false,
      dataType: "json",
      cache : false,
      success: function (response) {  
        console.log(response);
        $(body).append(response);
      },
      error: function (response) {
        console.log('ERROR updating image');
      }
    }); 
  });

  // Form handler for profile update
  $('#update_user_form').on('click', function(e){
    if ($('#new-password').val().length > 0 
        && $('#current-password').val().length <= 0 ) {
      e.preventDefault()
      $('.alert-pas').remove();
      $('.new-pas').append('<p style="margin-top: 5px;" class="alert-pas alert alert-warning">Enter your current password to update</p>');
    } 
  });

  // Follow   TODO  ///////
    //  console.log(creatorId)
  

  // Displays the map on the show map view
  

  if (spotLat && spotLong !== undefined ) {
    var theSpotMap;

    function showMap() {
        theSpotMap = new google.maps.Map(document.getElementById('show-spot-map'), {
          center: {lat: spotLat, lng: spotLong },
          zoom: 11, 
          mapTypeId: 'roadmap'
        });

      var spotMarkerr = new google.maps.Marker({
        position: {lat: spotLat, lng: spotLong },
        map: theSpotMap,
    }); 
    var iw = new google.maps.InfoWindow({
    content:  `<strong>${locationName}</strong>
     - 
    <em>${locationCountry}</em> <br><br>
    <strong>Latitude</strong>: ${spotLat}<br>
    <strong>Longitude</strong>: ${spotLong}`,
  });
    google.maps.event.addListener(spotMarkerr, "click", function(e) {
    iw.open(theSpotMap, this);
  });
  }
  showMap();
  }
    

  // Displays the map on edit map /////

  if (lati && longi !== undefined ) {
    
    function displayEditMap() {
      var currentMap;
        currentMap = new google.maps.Map(document.getElementById('spot-loc'), {
          center: {lat: lati, lng: longi},
          zoom: 11, 
          mapTypeId: 'roadmap'
        });

      var spotMarker = new google.maps.Marker({
        position: {lat: lati, lng: longi},
        map: currentMap,
        animation: google.maps.Animation.DROP,
    }); 
    var iw = new google.maps.InfoWindow({
    content:  `<strong>${locationName}</strong>
     - 
    <em>${locationCountry}</em> <br><br>
    <strong>Latitude</strong>: ${lati}<br>
    <strong>Longitude</strong>: ${longi}`
  });
    google.maps.event.addListener(spotMarker, "click", function(e) {
    iw.open(currentMap, this);
  });
}
displayEditMap();
}

$('.btn-follow').click( function(){
 $.ajax({
   type: "post",
   url: "/follow",
   data: "data",
   dataType: "dataType",
   success: function (response) {
     
   },
   error: function (response) {
        console.log('ERROR updating image');
      }
 });
})











});