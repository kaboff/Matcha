function htmlEntities(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    $('*[class^="one_user"]').click(function(e){
      _this = $(this); 
      $.ajax({
          url : '/get_message',
          type : 'POST',
          success : function(data){
            if (data.success)
            {
              messages = data.messages;
              for (var i = 0; rows[i]; i++) {
        if (rows[i]['code'] == _this.attr('class').replace('one_user',''))
        {
          if (_this.find(".red_notif_message").length && parseInt(_this.find(".red_notif_message").html()) != 0)
          {
            $('header').find('.red_notif').html(parseInt($('header').find('.red_notif').html()) - parseInt(_this.find(".red_notif_message").html()));
            if ($('header').find('.red_notif').length && $('header').find('.red_notif').html() == 0)
              $('header').find('.red_notif').remove();
            _this.find(".red_notif_message").remove();
            $.ajax({
              url : '/msg_see/'+_this.attr('class').replace('one_user',''),
              type : 'POST',
              success : function(data){
              }
            });
          }
          $('*[class^="chat"]').html('').attr('class', 'chat'+rows[i]['code']);
          $('*[class^="one_user"]').css({
              "filter": "grayscale(100%)",
              "background": ""
          })
          _this.css({
              "filter": "grayscale(0%)",
              "background": "white"
          });
          for (var o = 0; messages[o]; o++) {
            if (rows[i]['user_id'] == messages[o]['action_sender'] && messages[o]['action'] == 'message')
            {
              if (rows[i]['user_snap_profile'])

                $('*[class^="chat"]').append(loading_smiley('<li class="other"><div class="avatar"><img src="/images/user_img/'+rows[i]['user_snap_profile']+'"></div><div class="msg"><p>'+htmlEntities(messages[o]['action_message'])+'</p><time>Envoyé'+messages[o]['time']+'</time></div></li>'));
              else
                $('*[class^="chat"]').append(loading_smiley('<li class="other"><div class="avatar"><img src="/images/skull.jpg"></div><div class="msg"><p>'+htmlEntities(messages[o]['action_message'])+'</p><time>Envoyé'+messages[o]['time']+'</time></div></li>'));
            }
            else if (rows[i]['user_id'] == messages[o]['action_receiver'] && messages[o]['action'] == 'message')
            {
                if (user[0]['user_snap_profile'])
                  $('*[class^="chat"]').append(loading_smiley('<li class="me"><div class="avatar"><img src="/images/user_img/'+user[0]['user_snap_profile']+'"></div><div class="msg"><p>'+htmlEntities(messages[o]['action_message'])+'</p><time>Envoyé'+messages[o]['time']+'</time></div></li>'));
                else
                  $('*[class^="chat"]').append(loading_smiley('<li class="me"><div class="avatar"><img src="/images/skull.jpg"></div><div class="msg"><p>'+htmlEntities(messages[o]['action_message'])+'</p><time>Envoyé'+messages[o]['time']+'</time></div></li>'));
            }
          };
          $('*[class^="chat"]').append('<div class="menu_emojis"></div><input class="chat_input" type="text" placeholder="Votre texte ici"><div class="emojis"></div></div>');
          if (!$('.me').length && !$('.other').length)
            $('*[class^="chat"]').append('<li class="me"><div class="avatar"><img src="/images/skull.png"></div><div class="msg"><p>Vous avez meet avec cette personne, Entamer donc une discussion.</p><time></time></div></li>');
          generate_menu_smiley();
          $('#cont_wrapper').scrollTop($('#cont_wrapper').prop("scrollHeight"));
        }
      };   
            }
          }
      });
      $(".chat_input").focus();
    });

    $(document).on( "keypress", ".chat_input", function(event){
      if (event.keyCode === 10 || event.keyCode === 13) 
      {
        var reg_msg = /^([a-zA-Z0-9.,:()àáâãäåçèéêëìíîïðòóôõöøùúûüýÿ?^|<-](-| |')?){2,100}$/i;
        if ($(".chat_input").val() != '' && reg_msg.test($(".chat_input").val()))
        {
          $.ajax({
              url : '/send_msg',
              type : 'POST',
              data : 'mymsg='+$(".chat_input").val()+'&other='+$('*[class^="chat"]').attr('class').replace('chat',''),
              success : function(data){
                if (data.success)
                {
                  $.when(request()).done(function()
                  {
                    if (user[0]['user_snap_profile'])
                      $('*[class^="chat"]').append(loading_smiley('<li class="me"><div class="avatar"><img src="/images/user_img/'+user[0]['user_snap_profile']+'"></div><div class="msg"><p>'+htmlEntities($(".chat_input").val())+'</p><time>Envoyé a l\'instant</time></div></li>'));
                    else
                      $('*[class^="chat"]').append(loading_smiley('<li class="me"><div class="avatar"><img src="/images/skull.jpg"></div><div class="msg"><p>'+htmlEntities($(".chat_input").val())+'</p><time>Envoyé a l\'instant</time></div></li>'));
                    $(".chat_input").val('');
                    $('#cont_wrapper').scrollTop($('#cont_wrapper').prop("scrollHeight"));
                  });
                }
              }
          });
          if ($('.menu_emojis').is(":visible"))
            $('.menu_emojis').hide();
          }
        }
    });

  String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
  };

  function loading_smiley(data){
    str = data.replaceAll(':)','<img src="/images/smiley/sourire.png">');
    str = str.replaceAll('(love)','<img src="/images/smiley/coeur.png">');
    str = str.replaceAll('|3','<img src="/images/smiley/heart-break.png">');
    str = str.replaceAll(':p','<img src="/images/smiley/langue.png">');
    str = str.replaceAll(':P','<img src="/images/smiley/langue.png">');
    str = str.replaceAll(':x','<img src="/images/smiley/baillon.png">');
    str = str.replaceAll(':X','<img src="/images/smiley/baillon.png">');
    str = str.replaceAll(':\'(','<img src="/images/smiley/cry.png">');
    str = str.replaceAll(':D','<img src="/images/smiley/deouf.png">');
    str = str.replaceAll(':d','<img src="/images/smiley/deouf.png">');
    str = str.replaceAll(':-','<img src="/images/smiley/sans.png">');
    str = str.replaceAll(':o','<img src="/images/smiley/choque.png">');
    str = str.replaceAll(':O','<img src="/images/smiley/choque.png">');
    str = str.replaceAll(':|','<img src="/images/smiley/angry.png">');
    str = str.replaceAll('(b)','<img src="/images/smiley/burger.png">');
    str = str.replaceAll('(p)','<img src="/images/smiley/poo.png">');
    str = str.replaceAll('(l)','<img src="/images/smiley/love.png">');
    str = str.replaceAll('(h)','<img src="/images/smiley/devil.png">');
    str = str.replaceAll('(c)','<img src="/images/smiley/cafe.png">');
    str = str.replaceAll('(g)','<img src="/images/smiley/guitare.png">');
    str = str.replaceAll('(good)','<img src="/images/smiley/good.png">');
    str = str.replaceAll('(bad)','<img src="/images/smiley/bad.png">');
    return (str);
  }

  function generate_menu_smiley(){
    $('.menu_emojis').append('<img src="/images/smiley/sourire.png"><img src="/images/smiley/deouf.png"><img src="/images/smiley/langue.png"><img src="/images/smiley/love.png"><img src="/images/smiley/baillon.png"><img src="/images/smiley/cry.png"><img src="/images/smiley/choque.png"><img src="/images/smiley/angry.png"><img src="/images/smiley/sans.png"><img src="/images/smiley/devil.png"><img src="/images/smiley/coeur.png"><img src="/images/smiley/heart-break.png"><img src="/images/smiley/poo.png"><img src="/images/smiley/burger.png"><img src="/images/smiley/cafe.png"><img src="/images/smiley/guitare.png"><img src="/images/smiley/good.png"><img src="/images/smiley/bad.png">');
  }

  $(document).on("click", ".emojis", function(event){
    if ($('.menu_emojis').is(":visible"))
      $('.menu_emojis').hide();
    else
      $('.menu_emojis').show();
  })

  $(document).on( "click", ".menu_emojis img", function(event){
    if ($(this).attr('src') == '/images/smiley/sourire.png')
      $(".chat_input").val($(".chat_input").val() + ':)');
    else if ($(this).attr('src') == '/images/smiley/deouf.png')
      $(".chat_input").val($(".chat_input").val() + ':D');
    else if ($(this).attr('src') == '/images/smiley/langue.png')
      $(".chat_input").val($(".chat_input").val() + ':p');
    else if ($(this).attr('src') == '/images/smiley/love.png')
      $(".chat_input").val($(".chat_input").val() + '(l)');
    else if ($(this).attr('src') == '/images/smiley/baillon.png')
      $(".chat_input").val($(".chat_input").val() + ':x');
    else if ($(this).attr('src') == '/images/smiley/cry.png')
      $(".chat_input").val($(".chat_input").val() + ':\'(');
    else if ($(this).attr('src') == '/images/smiley/choque.png')
      $(".chat_input").val($(".chat_input").val() + ':o');
    else if ($(this).attr('src') == '/images/smiley/angry.png')
      $(".chat_input").val($(".chat_input").val() + ':|');
    else if ($(this).attr('src') == '/images/smiley/sans.png')
      $(".chat_input").val($(".chat_input").val() + ':-');
    else if ($(this).attr('src') == '/images/smiley/devil.png')
      $(".chat_input").val($(".chat_input").val() + '(h)');
    else if ($(this).attr('src') == '/images/smiley/coeur.png')
      $(".chat_input").val($(".chat_input").val() + '(love)');
    else if ($(this).attr('src') == '/images/smiley/heart-break.png')
      $(".chat_input").val($(".chat_input").val() + '|3');
    else if ($(this).attr('src') == '/images/smiley/poo.png')
      $(".chat_input").val($(".chat_input").val() + '(p)');
    else if ($(this).attr('src') == '/images/smiley/burger.png')
      $(".chat_input").val($(".chat_input").val() + '(b)');
    else if ($(this).attr('src') == '/images/smiley/cafe.png')
      $(".chat_input").val($(".chat_input").val() + '(c)');
    else if ($(this).attr('src') == '/images/smiley/guitare.png')
      $(".chat_input").val($(".chat_input").val() + '(g)');
    else if ($(this).attr('src') == '/images/smiley/good.png')
      $(".chat_input").val($(".chat_input").val() + '(good)');
    else if ($(this).attr('src') == '/images/smiley/bad.png')
      $(".chat_input").val($(".chat_input").val() + '(bad)');
    $(".chat_input").focus();
  })  
