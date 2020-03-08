/*
The purpose of these functions is test this wizard. (Dont use them!!, I won't do it)
You could implement a more elegant solution. 
**/

function enviar() {
    $(document).ready(function () {
      $('#block2A').removeClass("block2").addClass( "activeblock2" );
      $( "#b2" ).removeClass( "circulo" ).addClass( "activecirculo");
      $('#p').addClass("progreso1");
      $('.icon1').addClass("fa fa-check");
      $('#next1').hide();
      $('#next2').show();
    });
  
  }

  function enviar2() {
    $(document).ready(function () {
      $('#p').addClass("progreso2");
      $('#block3A').removeClass("block3").addClass( "activeblock3");
      $( "#b3" ).removeClass( "circulo" ).addClass( "activecirculo");
      $('.icon2').addClass("fa fa-check");
      $('#next2').hide();
      $('#next3').show();
    });
  }

  function enviar3(){
    $('#p').addClass("progreso3");
    $('.icon3').addClass("fa fa-check");
    $('#block3A').removeClass("block3").addClass( "activeblock3");
    $( "#b3" ).removeClass( "circulo" ).addClass( "activecirculo");
    $('#block4A').removeClass("block4").addClass( "activeblock4");
    $( "#b4" ).removeClass( "circulo" ).addClass( "activecirculo");
    $('#next3').hide();
  }