   document.querySelectorAll("#menu_left ul > li")[0].style.background = 'brown';

  var fadeoutloader = function()
  {
    $('#background_loader').fadeOut(500);
  }

  var hidden_log = function ()
  {
    document.getElementById("error_hidden").style.display = "none";
  }

  function reset_color ()
  {
    $('#menu_left li').each(function(i)
    {
      this.style.background = '';
    });
  }

 $('#menu_left li').click(function(){
    if ($(this).children().attr('name') == "report")
    {
      $.get('admin_report.ejs', function (template) {
          var func = ejs.compile(template);
          $.ajax({
            async: true,
            url : '/data_from_admin',
            type : 'POST',
            success : function(data){
             var html = func(data.data[0]);
             $('#layout').html(html);
            }
          });
        });
      reset_color();
      hidden_log();
      document.querySelectorAll("#menu_left ul > li")[0].style.background = 'brown';
    }
    else if ($(this).children().attr('name') == "list_user")
    {
      $.get('admin_user.ejs', function (template) {
          var func = ejs.compile(template);
          $.ajax({
            async: true,
            url : '/data_from_admin',
            type : 'POST',
            success : function(data){
             var html = func(data.data[0]);
             $('#layout').html(html);
            }
          });
        });
      reset_color();
      hidden_log();
      document.querySelectorAll("#menu_left ul > li")[1].style.background = 'brown';
    }
 });


      $('.show_menu_left').click(function()
      {
        $('#menu_left').css({
          left: '0',
          width: '100%'
        });
      });

      $('.hide_menu_left').click(function()
      {
        $('#menu_left').css({
          left: 'calc(0px - 300px)',
          width: '300px'
        });
      });

     $(window).resize(function() {
        
      if ($(window).width() < 950) {
        $('.hide_menu_left').show();
        $('#menu_left').css({
          left: 'calc(0px - 300px)',
          width: '300px'
        });
      }
      else
      {
        $('.hide_menu_left').hide();
        $('#menu_left').css({
          left: '0',
          width: '300px'
        });
      }
    });

