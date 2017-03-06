      var option = '';
      for (var i = 110; i != 251; i++)
            option += "<option value="+i+">"+i+" cm</option>";
      document.getElementById("edit_taille").innerHTML += option;
      option = '';
      for (var i = 40; i != 201; i++)
            option += "<option value="+i+">"+i+" kilos</option>";
      document.getElementById("edit_poids").innerHTML += option;

      $.ajax({
          url : '/request_database',
          type : 'POST',
          data : 'success=nice', 
          success : function(data){
            user = data.user;
            $('#edit_taille option[value='+user[0].user_size+']').attr("selected", "selected");
            $('#edit_poids option[value='+user[0].user_poid+']').attr("selected", "selected");
            $('#edit_eyes option[value='+user[0].user_eyes+']').attr("selected", "selected");
            $('#edit_hair option[value='+user[0].user_hairs+']').attr("selected", "selected");
            if (user[0].user_biography != '')
              $('#me_desc').val(user[0].user_biography);
          }
      });

      var control_me_information = function ()
      {
        var reg = /^[0-9]{1,10}$/;
        var reg_description = /^([a-zA-Z.,:()àáâãäåçèéêëìíîïðòóôõöøùúûüýÿ](-| |')?){2,100}[a-zàáâãäåçèéêëìíîïðòóôõöøùúûüýÿ.,:()]$/;
        var eyes_array = ['', 'Bleu', 'Vert', 'Jaune', 'Marron', 'Noir', 'Rouge', 'Violet', 'Blanc', 'Orange'];
        var hair_array = ['', 'Bleu', 'Vert', 'Blond', 'Brun', 'Noir', 'Rouge', 'Violet', 'Blanc', 'Chatain', 'Roux'];

        if ($('#edit_taille option:selected').val() != '')
          if ($('#edit_taille option:selected').val() < 110 || $('#edit_taille option:selected').val() > 250 || !reg.test($('#edit_taille option:selected').val()))
              return false;

        if ($('#edit_poids option:selected').val() != '')
          if ($('#edit_poids option:selected').val() < 40 || $('#edit_poids option:selected').val() > 200 || !reg.test($('#edit_poids option:selected').val()))
              return false;

        if (!exist_in_array(eyes_array, $('#edit_eyes option:selected').val()))
          return false;

        if (!exist_in_array(hair_array, $('#edit_hair option:selected').val()))
          return false;

        if (!reg_description.test($('#me_desc').val()) && $('#me_desc').val() != '')
          return false;
        return true;
      }

      $('#send_change_me').click(function(){
          if (control_me_information())
          {
            $.ajax({
              url : '/change_me',
              type : 'POST',
              data : 'success=nice&size='+$('#edit_taille option:selected').val()+'&poid='+$('#edit_poids option:selected').val()+'&eyes='+$('#edit_eyes option:selected').val()+'&hairs='+$('#edit_hair option:selected').val()+'&description=+'+$('#me_desc').val().trim(), 
              success : function(data){
                $('.send_done').show().delay(2000).hide(0);
              }
            });
          }
          else
            show_error('Une erreur est survenue sur un de vos champs.');
      });

      $("#me_desc").keyup(function(){
        var reg_description = /^([a-zA-Z.,:()àáâãäåçèéêëìíîïðòóôõöøùúûüýÿ](-| |')?){2,100}[a-zàáâãäåçèéêëìíîïðòóôõöøùúûüýÿ.,:()]$/;
        if (reg_description.test($('#me_desc').val()) || $('#me_desc').val() == '')
          $("#me_desc").css('border', 'none');
        else
          $("#me_desc").css('border', '3px solid red');
      });