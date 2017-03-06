
    function profile_1( __this ){
        if ($(__this).parent().is("a"))
        {
          $_this = $(__this);
          var split_get = window.location.pathname.split('/')[2];
          if (split_get.slice(-1) == "#")
            split_get = split_get.slice(-1);
          $.ajax({
              url : '/unlike/'+split_get,
              type : 'POST',
              success : function(data){
                location.reload();
              }
          });
        }
    }
    function profile_2( __this ){
        if ($(__this).parent().is("a"))
        {
          $_this = $(__this);
          var split_get = window.location.pathname.split('/')[2];
          if (split_get.slice(-1) == "#")
            split_get = split_get.slice(-1);
          $.ajax({
              url : '/like/'+split_get,
              type : 'POST',
              success : function(data){
                location.reload();
              }
          });
        }
    }
    function profile_3( __this ){
        if ($(__this).parent().is("a"))
        {
          $_this = $(__this);
          var split_get = window.location.pathname.split('/')[2];
          while (split_get.slice(-1) == "#")
            split_get = split_get.slice(-1);
          $.ajax({
              url : '/dislike/'+split_get,
              type : 'POST',
              success : function(data){
                $_this.css('color', 'red');
                $_this.parent().prev().remove();
                $_this.parent().replaceWith($_this);
              }
          });
        }
    }
    function isEmpty( el ){
      return !$.trim(el.html())
    }
    function Capitalize(chaine){
            return chaine.substr(0,1).toUpperCase() + chaine.substr(1,chaine.length).toLowerCase();        
    }

    var code_to_city = function(code) {
     $.getJSON("https://vicopo.selfbuild.fr/code/"+code+"?format=callback", function(city) {
            if (city.cities[0])
              $('figure + h2').html($('figure + h2').html() + "<h3>" + Capitalize(city.cities[0].city.toLowerCase()) + "</h3>")
        });
    }

      var echo_city = function ()
      {
        if (user[0]['user_city'])
          code_to_city(request_user[0]['user_city']);
        else
        {
          $.getJSON("http://ip-api.com/json/?callback=?", function(data) {
            code_to_city(data.zip);
          });
        }
      }

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
          if (request_user[0]['user_snap_profile'])
            $('#img_profil').attr('src', "/images/user_img/"+request_user[0]['user_snap_profile']);
          else
            $('#img_profil').attr('src', '/images/skull.jpg');
          $('figure + h2').html(request_user[0].user_login);
          if (request_user[0]['user_sex'] == 1)
            $('figure + h2').html("<span class='icon-woman'></span> " + $('figure + h2').html() + " - " + request_user[0].birth + " ans");
          else if (request_user[0]['user_sex'] == 2)
            $('figure + h2').html("<span class='icon-man'></span> " + $('figure + h2').html() + " - " + request_user[0].birth + " ans");
          echo_city();
      });

      $(".navbar li").click(function(){
        var num = $(".navbar li").index(this);
        $(this).children('a').addClass('navbar_hover').parent().siblings().children('a').removeClass('navbar_hover');
        $('.cont_user_bottom').children('div').hide();
        $('.cont_user_bottom').children('div:nth-child(' + (num + 1) + ')').show();
      });

      $(document).ready(function() {
        $('.ion-alert-circled').click(function(){
          _this = $(this);
          var split_get = window.location.pathname.split('/')[2];
          while (split_get.slice(-1) == "#")
            split_get = split_get.slice(-1);
            $.ajax({
                url : '/report_send/'+split_get,
                type : 'POST',
                data : 'success=nice', 
                success : function(data){
                  if (data.success)
                  {
                    _this.remove();
                    $('.send_done').html('Vous avez bien report cette utilisateur.').show().delay(2000).hide();
                  }
                }
            });
        });
        $('.ion-minus-circled').click(function(){
            if (confirm("Voulez vous bloquer cette utilisateur ?")) 
            {
              _this = $(this);
              var split_get = window.location.pathname.split('/')[2];
              while (split_get.slice(-1) == "#")
                split_get = split_get.slice(-1);
              $.ajax({
                  url : '/bloque_send/'+split_get,
                  type : 'POST',
                  success : function(data){
                    if (data.success)
                      window.location.replace('/');
                  }
              });
            }
          });

        if (isEmpty($('.cont_music')))
            $('.cont_music').html('Non renseigné');

        $('#img_profil').click(function(){
          if ($('div').hasClass('img_big'))
            $('.background_gray').show();
        });

        $('.arrow_cross').click(function()
        {
          $('.background_gray').hide();
        });

        $('.arrow_right').click(function(){ 
          $('.img_block').removeClass('img_block').next().addClass('img_block');
          $('.arrow_left').addClass('arrow_block');
          if (!$('.img_block').next().is('.img_big'))
            $('.arrow_right').removeClass('arrow_block');
        });

        $('.arrow_left').click(function(){ 
          $('.img_block').removeClass('img_block').prev().addClass('img_block');
          $('.arrow_right').addClass('arrow_block');
          if (!$('.img_block').prev().is('.img_big'))
            $('.arrow_left').removeClass('arrow_block');
        });

        if ($('.img_big').length != 1)
          $('.arrow_right').addClass('arrow_block');
      });
