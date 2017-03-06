var availableTags = [];
    var user = '';

    $(window).resize(function() {
      if ($('.ui-front').length)
      {
        $('.ui-front').css({
          left: $('#tags').offset().left,
          top: $('#tags').offset().top + $('#tags').height()
        });
      }
    });

    $(".my_tag").on('click','img',function(){
        $(this).parent().remove();
    });

    $('#tags').keyup(function(event){
      var regex_tag = /^([a-z0-9.,àáâãäåçèéêëìíîïðòóôõöøùúûüýÿ](-| |')?){0,20}[a-z0-9àáâãäåçèéêëìíîïðòóôõöøùúûüýÿ]$/i;
      if (event.keyCode === 10 || event.keyCode === 13) 
      {
        if (regex_tag.test($('#tags').val()))
        { 
          if ($(".my_tag li").length < 10)
          {
            $(".my_tag").append("<li>"+$('#tags').val()+"<img src='/images/icon/cross.png'></li>");
            $('#tags').val('');
          }
        }
        else
          show_error('Une erreur est survenue sur un de vos champs.');
        $('.ui-autocomplete').css('display', 'none');
      }
      else
      {
        if (!regex_tag.test($('#tags').val()))
          $('#tags').css('border', '1px solid red');
        else
          $('#tags').css('border', '1px solid #ddd');
      }
    });

    $( "#tags" ).autocomplete({
      source: function(request, response) {
        var results = $.ui.autocomplete.filter(availableTags, request.term);
        response(results.slice(0, 10));
      },
      messages: {
          noResults: '',
          results: function() {}
      },
      select: function(e, ui) {
        if ($(".my_tag li").length < 10)
        {
          $(".my_tag").append("<li>"+ui.item.value+"<img src='/images/icon/cross.png'></li>");
          this.value = "";
        }
        return false;
      }
    });

      var control_gout_information = function ()
      {
        var reg_gout = /^([a-z0-9.,àáâãäåçèéêëìíîïðòóôõöøùúûüýÿ](-| |')?){1,50}[a-z0-9àáâãäåçèéêëìíîïðòóôõöøùúûüýÿ]$/i;
        var regex_tag = /^([a-z0-9.,àáâãäåçèéêëìíîïðòóôõöøùúûüýÿ](-| |')?){0,20}[a-z0-9àáâãäåçèéêëìíîïðòóôõöøùúûüýÿ]$/i;
        var result = true;

        if ($("input[name=music_1]").val() != '')
          if (!reg_gout.test($("input[name=music_1]").val()))
            return false;
        if ($("input[name=music_2]").val() != '')
          if (!reg_gout.test($("input[name=music_2]").val()))
            return false;
        if ($("input[name=music_3]").val() != '')
          if (!reg_gout.test($("input[name=music_3]").val()))
            return false;
        if ($("input[name=music_4]").val() != '')
          if (!reg_gout.test($("input[name=music_4]").val()))
            return false;
        if ($("input[name=music_5]").val() != '')
          if (!reg_gout.test($("input[name=music_5]").val()))
            return false;

        $('.my_tag > li').each(function()
        {
          if (!regex_tag.test($(this).html().replace("<img src=\"/images/icon/cross.png\">", '')))
            result = false;
        });

        if (result)
          return true;
        else
          return false;
      }

      $('#send_change_gout').click(function(){
          if (control_gout_information())
          {
            var array_tag = '';
            var i = 0;
            $('.my_tag > li').each(function()
            {
              if (i < 10)
              {
                array_tag += $(this).html().replace("<img src=\"/images/icon/cross.png\">", '') + ";";
                i++;
              }
            });
            var tabs_gout = [$("input[name=music_1]").val(), $("input[name=music_2]").val(), $("input[name=music_3]").val(), $("input[name=music_4]").val(), $("input[name=music_5]").val()];
            var all_music = tabs_gout.join(";");
            $.ajax({
              url : '/change_gout',
              type : 'POST',
              data : 'success=nice&music='+all_music+"&tags="+array_tag, 
              success : function(data){
                $('.send_done').show().delay(2000).hide(0);
              }
            });
          }
          else
            show_error('Une erreur est survenue sur un de vos champs.');
      });

      var request_tags = function()
      {
        return $.ajax({
          url : '/tags',
          type : 'POST', 
          success : function(data){
            availableTags = data.all_tags;
          }
        });
      }

      $.when(request_tags()).done(function(){});

      var request = function()
      {
        return $.ajax({
              url : '/request_database',
              type : 'POST',
              data : 'success=nice', 
              success : function(data){
                user = data.user;
              }
        });
      }
      $.when(request()).done(function()
      {
        if (user[0]['user_tags'])
        {
          var split = user[0]['user_tags'].split(';');
          for (var i = 0; split[i]; i++)
          {
            $(".my_tag").append("<li>"+split[i]+"<img src='/images/icon/cross.png'></li>");
          }
        }
      });