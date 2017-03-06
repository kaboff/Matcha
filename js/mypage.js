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
          code_to_city(user[0]['user_city']);
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
          if (user[0]['user_snap_profile'])
            $('#img_profil').attr('src', "/images/user_img/"+user[0]['user_snap_profile']);
          else
            $('#img_profil').attr('src', '/images/skull.jpg');
          $('figure + h2').html(user[0].user_login);
          if (user[0]['user_sex'] == 1)
            $('figure + h2').html("<span class='icon-woman'></span> " + $('figure + h2').html() + " - " + me.birth + " ans");
          else if (user[0]['user_sex'] == 2)
            $('figure + h2').html("<span class='icon-man'></span> " + $('figure + h2').html() + " - " + me.birth + " ans");
          echo_city();
      });

      $(".navbar li").click(function(){
        var num = $(".navbar li").index(this);
        $(this).children('a').addClass('navbar_hover').parent().siblings().children('a').removeClass('navbar_hover');
        $('.cont_user_bottom').children('div').hide();
        $('.cont_user_bottom').children('div:nth-child(' + (num + 1) + ')').show();
      });

      $(document).ready(function() {
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