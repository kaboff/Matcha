var array_edit = [1, 1, 1, 1];

    $("input[name=edit_myname]").keyup(function(){
      var regex = /^([a-zàáâãäåçèéêëìíîïðòóôõöøùúûüýÿ](-| |')?){2,20}[a-zàáâãäåçèéêëìíîïðòóôõöøùúûüýÿ]$/i;
      var str = $('input[name=edit_myname]').val();
      if (regex.test(str))
      {
        $("input[name=edit_myname]").css('border', 'none');
        array_edit[0] = 1;
      }
      else
      {
        $("input[name=edit_myname]").css('border', '4px solid red');
        array_edit[0] = 0;
      }
    });

    $("input[name=edit_mysurname]").keyup(function(){
      var regex = /^([a-zàáâãäåçèéêëìíîïðòóôõöøùúûüýÿ](-| |')?){2,20}[a-zàáâãäåçèéêëìíîïðòóôõöøùúûüýÿ]$/i;
      var str = $('input[name=edit_mysurname]').val();
      if (regex.test(str))
      {
        $("input[name=edit_mysurname]").css('border', 'none');
        array_edit[1] = 1;
      }
      else
      {
        $("input[name=edit_mysurname]").css('border', '4px solid red');
        array_edit[1] = 0;
      }
  });

  $('#send_change').click(function(){
    $('#background_loading').css('display', 'flex').fadeIn(100);
      var success = true;
      var save_city;
      for (var i = 0; i != array_edit.length; i++)
      {
            if (!array_edit[i])
                  success = false;
      }
      if (success)
      {
            if ($("#exists_city").val() != '')
            {
              $.getJSON("https://vicopo.selfbuild.fr/ville/"+$('#exists_city').val()+"?format=callback", function(city) {
                  if (city.cities[0])
                  {
                    $.getJSON("https://vicopo.selfbuild.fr/code/"+$('#zipcode').val()+"?format=callback", function(city) {
                      if (city.cities[0])
                      {
                        $.ajax({
                          url : '/change_basic',
                          type : 'POST',
                          data : 'success=nice&name='+$("input[name=edit_myname]").val()+'&surname='+$("input[name=edit_mysurname]").val()+'&city='+$("#zipcode").val(), 
                          success : function(data){
                            $('.send_done').show().delay(2000).hide(0);
                          }
                        });
                      }
                      else
                        show_error('Une erreur est survenue sur un de vos champs.');
                    });
                  }
                  else
                    show_error('Une erreur est survenue sur un de vos champs.');
              });
            }
            else if ($('#zipcode').val() == rows[0]['user_city'])
            {
              $.ajax({
                url : '/change_basic',
                type : 'POST',
                data : 'success=nice&login='+$("input[name=edit_mylogin]").val()+'&name='+$("input[name=edit_myname]").val()+'&surname='+$("input[name=edit_mysurname]").val()+'&city='+$("#zipcode").val(), 
                success : function(data){
                  $('.send_done').show().delay(2000).hide(0);
                }
              });
            }
            else
              show_error('Une erreur est survenue sur un de vos champs.');
      }
      else
        show_error('Une erreur est survenue sur un de vos champs.');
      $('#background_loading').fadeOut(500);
  });