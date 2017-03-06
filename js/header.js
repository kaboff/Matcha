 String.prototype.replaceAll = function(target, replacement) {
      return this.split(target).join(replacement);
    };

    function htmlEntities(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

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
      var today = new Date();
      var socket = io();
      socket.on('connect', function () {
        socket.emit('save_user', me['socket_key']);
        socket.on('disconnect', function() {
        });
      });
      socket.on(me['socket_key'], function (id, data, action, msg_array) {
        if (action == 'message')
        {
          if ($('.chat'+id).length)
          {
            if (data['user_snap_profile'])
              $('.chat'+id).append(loading_smiley('<li class="other"><div class="avatar"><img src="/images/user_img/'+data['user_snap_profile']+'"></div><div class="msg"><p>'+htmlEntities(msg_array[4])+'</p><time>Envoyé a l\'instant</time></div></li>'));
            else
              $('.chat'+id).append(loading_smiley('<li class="other"><div class="avatar"><img src="/images/skull.jpg"></div><div class="msg"><p>'+htmlEntities(msg_array[4])+'</p><time>Envoyé a l\'instant</time></div></li>'));
              $('#cont_wrapper').scrollTop($('#cont_wrapper').prop("scrollHeight"));
          }
          else
          {
            if (data['user_snap_profile'])
              $('.new_notif img').attr('src', '/images/user_img/'+data['user_snap_profile']);
            else
              $('.new_notif img').attr('src', '/images/skull.jpg');
            $('.content_notif i a').attr('href', '/profile/'+id);
            if ($('.red_notif').length)
              $('.red_notif').html(parseInt($('.red_notif').html())+1);
            $('.ion-heart span').html(parseInt($('.ion-heart span').html())+1);
            $('.content_notif h2').html(data['user_login'] + ' vous a envoyer un message');
            $('.new_notif').addClass('animation_new_notif').fadeIn().delay(5000).queue(function(next){
              $(this).removeClass("animation_new_notif");
            next();
          });
          }
        }
        else
        {
          if (data['user_snap_profile'])
            $('.new_notif img').attr('src', '/images/user_img/'+data['user_snap_profile']);
          else
            $('.new_notif img').attr('src', '/images/skull.jpg');
          $('.content_notif i a').attr('href', '/profile/'+id);
          if (action == 'visite')
          {
            if ($('.red_notif').length)
              $('.red_notif').html(parseInt($('.red_notif').html())+1);
            $('.ion-eye span').html(parseInt($('.ion-eye span').html())+1);
            $('.content_notif h2').html(data['user_login'] + ' a visité votre profil');
          }
          else if (action == 'like')
          {
            if ($('.red_notif').length)
              $('.red_notif').html(parseInt($('.red_notif').html())+1);
            $('.ion-heart span').html(parseInt($('.ion-heart span').html())+1);
            $('.content_notif h2').html(data['user_login'] + ' vous a meet');
          }
          else if (action == 'unlike')
          {
            if ($('.red_notif').length)
              $('.red_notif').html(parseInt($('.red_notif').html())+1);
            $('.ion-heart span').html(parseInt($('.ion-heart span').html())+1);
            $('.content_notif h2').html(data['user_login'] + ' ne vous meet plus...');
          }
          else if (action == 'match')
          {
            if ($('.red_notif').length)
              $('.red_notif').html(parseInt($('.red_notif').html())+1);
            $('.ion-heart span').html(parseInt($('.ion-heart span').html())+1);
            $('.content_notif h2').html(data['user_login'] + ' SA MATCH !');
          }

          $('.new_notif').addClass('animation_new_notif').fadeIn().delay(5000).queue(function(next){
            $(this).removeClass("animation_new_notif");
            next();
          });
        }
      });

    var user;
    var action_header;

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

    var request_actions = function()
    {
      return $.ajax({
            url : '/request_database_action',
            type : 'POST',
            data : 'success=nice', 
            success : function(data){
              action_header = data.actions;
            }
      });
    }

  $(document).ready(function() {
      if (window.location.pathname != "/meetal")
        $('#background_loader').fadeOut(500);
      $.when(request()).done(function()
      {
          if (user[0]['user_snap_profile'])
            document.getElementById('user_logo').src = "/images/user_img/"+user[0]['user_snap_profile'];
          if (user[0]['user_admin'])
          {
            $('.dropdown-content').prepend('<a href="/admin">Administration</a><a href="#">--------------</a>');
          }
      });
      $.when(request_actions()).done(function()
      {
        if (action_header.visite || action_header.message || action_header.like)
          $('.my_notif').parent().append( "<div class='red_notif'>"+(action_header.visite + action_header.like + action_header.message)+"</div>" );
        $('.notifications_header li.ion-eye span').html(action_header.visite);
        $('.notifications_header li.ion-heart span').html(action_header.like);
        $('.notifications_header li.ion-email span').html(action_header.message);
      });
      $(".my_notif").hover(
        function() {
          $('.notifications_header').show();
        }, function() {
          $('.notifications_header').hide();
        }
      );
  });