    if ($( "#redir" ).length) // Si l'element existe alors tu rentre. 
    {
      var count = 4;
      countdown(count);
      $("#redir").html('Une erreur est survenue redirection dans 5');

      function countdown(timer) {
          var intervalID;
          intervalID = setInterval(function () {

              display(timer);
              timer = timer - 1;

              if (timer < 0) {
                  document.location.href="/";
                  clearTimeout(intervalID);
              }
          }, 1000);


      }
      function display(timer) {
        $("#redir").html('Une erreur est survenue redirection dans ' + timer);
      }
  }
  function send_password () {
      $.ajax({
        url : '/new_pass/'+token,
        type : 'POST',
        data : 'pass='+$("input[name=newmdp_lost]").val()+'&confirm='+$("input[name=newconfirm_lost]").val(),
        success : function(data){
          if (data.success)
          {
            $('#change_password').hide();
            $('#send_error').hide();
            $('#send_success').show();
          }
          else              
            $('#send_error').show();
        }
      });
  }

  $("input[name=newmdp_lost], input[name=newconfirm_lost]").keyup(function(){
    var regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,15}$/;
    if (!regex.test($(this).val()))
      $(this).css('border', '3px solid red');
    else
      $(this).css('border', '3px solid green');
  })