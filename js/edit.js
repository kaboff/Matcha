
      document.querySelectorAll("#menu_left ul > li")[0].style.background = 'brown';
      var nb_input = 0;
      window.alert = function() {};
      var today = new Date();
      'use strict';

      var fadeoutloader = function()
      {
        $('#background_loader').fadeOut(500);
      }

    var change_snap_profile = function(nb)
    {
          $.ajax({
            url : '/profile_snap',
            type : 'POST',
            data : 'success=nice&nb='+nb,
            success : function(data){
              $('.send_done').html(data.message);
              clear_div(nb);
              $('.send_done').show().delay(2000).hide(0);
            }
          });
    }

    var clear_div = function(nb)
    {
      $.when(request()).done(function()
      {
        if (user[0]['user_snap'+nb])
        {
          document.getElementById('idblockimg'+nb).innerHTML = "<img id='snap"+nb+"'src=/images/user_img/"+user[0]['user_snap'+nb]+">";
          document.getElementById('input_clear'+nb).style.display = 'none';
          document.getElementById('input_delete'+nb).style.display = 'inline-block';
          document.getElementById('input_upload'+nb).style.marginRight = '0px';
          document.getElementById('input_upload'+nb).style.color = 'gray';
          document.getElementById('span'+nb).innerHTML = 'Choisissez une image...';
          document.getElementById('input_profile'+nb).style.display = 'inline-block';
          $('#file-'+nb).val("");
        }
        else
        {
          document.getElementById('idblockimg'+nb).innerHTML = "<div style='margin-top: 65px;'>Aucune photo</div>";
          document.getElementById('input_clear'+nb).style.display = 'none';
          document.getElementById('input_delete'+nb).style.display = 'none';
          document.getElementById('input_upload'+nb).style.marginRight = '0px';
          document.getElementById('input_upload'+nb).style.color = 'gray';
          document.getElementById('span'+nb).innerHTML = 'Choisissez une image...';
          document.getElementById('input_profile'+nb).style.display = 'none';
          $('#file-'+nb).val("");
        }
        if (user[0]['user_snap_profile'])
          document.getElementById('user_logo').src = '/images/user_img/'+user[0]['user_snap_profile'];
        else
          document.getElementById('user_logo').src = '/images/skull.jpg';
      });
    }

    var upload_xhr = function (nb) {
      if ($('#file-'+nb).get(0).files[0])
      {
        var fd = new FormData();
        fd.append('uploadingFile', $('#file-'+nb).get(0).files[0]);
        fd.append('id_snap', (nb));
        fd.append('socket_user', user['socket_key']);
     
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/upload");
        xhr.onreadystatechange = function (e) {
          if (xhr.readyState == 4 && xhr.status == 200)
          {
            if (e.target.response == 'false')
            {
              clear_div(nb);
              show_error('Votre image est trop lourde');
            }
            else
            {
              document.getElementById("snap"+nb).src = '/images/user_img/'+xhr.response;
              $('.send_done').html('Votre image a bien été importé.');
              clear_div(nb);
              $('.send_done').show().delay(2000).hide(0);
            }
          }
        }
        xhr.send(fd);
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

function reset_color ()
{
  $('#menu_left li').each(function(i)
  {
    this.style.background = '';
  });
}

function set_button(element) {
  if (element == "basic")
  {
    $.get('edit_basic.ejs', function (template) {
        var func = ejs.compile(template);
        $.ajax({
          url : '/data_from_edit',
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
  else if (element == "snap")
  {
    $.get('edit_snap.ejs', function (template) {
        var func = ejs.compile(template);
        $.ajax({
          url : '/data_from_edit',
          type : 'POST',
          success : function(data){
           var html = func(data.data[0]);
           $('#layout').html(html);
          }
        });
      });
    reset_color();
    hidden_log();
    document.querySelectorAll("#menu_left ul > li")[5].style.background = 'brown';
  }
  else if (element == "me")
  {    
    $.get('edit_me.ejs', function (template) {
        var func = ejs.compile(template);
        $.ajax({
          url : '/data_from_edit',
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
  else if (element == "gout")
  {
    $.get('edit_gout.ejs', function (template) {
        var func = ejs.compile(template);
        $.ajax({
          url : '/data_from_edit',
          type : 'POST',
          success : function(data){
           var html = func(data.data[0]);
           $('#layout').html(html);
          }
        });
      });
    reset_color();
    hidden_log();    document.querySelectorAll("#menu_left ul > li")[2].style.background = 'brown';
  }
  else if (element == "pass")
  {
    $.get('edit_pass.ejs', function (template) {
        var func = ejs.compile(template);
        $.ajax({
          url : '/data_from_edit',
          type : 'POST',
          success : function(data){
           var html = func(data.data[0]);
           $('#layout').html(html);
          }
        });
      });
    reset_color();
    hidden_log();
    document.querySelectorAll("#menu_left ul > li")[3].style.background = 'brown';
  }
  else if (element == "mail")
  {
    $.get('edit_mail.ejs', function (template) {
        var func = ejs.compile(template);
        $.ajax({
          url : '/data_from_edit',
          type : 'POST',
          success : function(data){
           var html = func(data.data[0]);
           $('#layout').html(html);
          }
        });
      });
    reset_color();
    hidden_log();
    document.querySelectorAll("#menu_left ul > li")[4].style.background = 'brown';
  }
}

    function isNumberKey(evt){
      var charCode = (evt.which) ? evt.which : evt.keyCode
      if ((charCode > 31 && (charCode < 45 || charCode > 57)) || !charCode == 8)
          return false;
      return true;
  }

    function my_geocal(){
      $('#background_loading').css('display', 'flex').fadeIn(100);
      $.getJSON("http://ip-api.com/json/?callback=?", function(data) {
          $.getJSON("https://vicopo.selfbuild.fr/code/"+data.zip+"?format=callback", function(city) {
            if (city.cities[0])
              $('#exists_city').val(city.cities[0].city);
              $('#zipcode').val(city.cities[0].code);
          });
      });
      $('#background_loading').fadeOut(500);
    }

    $("#zipcode").keyup(function(data) {
      if (isNumberKey(data))
      {
        if (this.value.length == 5)
        {
          $.getJSON("https://vicopo.selfbuild.fr/code/"+this.value+"?format=callback", function(city) {
            if (city.cities[0])
              $('#exists_city').val(city.cities[0].city);
          });
        }
        else
          $('#exists_city').val('');
      }
    });

    $("#city_begin").change(function(data) {
        $.ajax({
          url : '/request_ajax_city',
          type : 'POST',
          data : 'success=nice&city='+document.getElementById('city_begin').value, 
          success : function(data){
          }
        });
    });
      $("#city_begin option").each(function()
      {
          if ($(this).val() == rows[0]['user_city_begin'])
            $(this).attr("selected","selected");
      });

      var show_error = function (message)
      {
        document.getElementById('msg_error').innerHTML = message;
        document.getElementById('error_hidden').style.display = "block";
      }

      var exist_in_array = function (tabs, element)
      {
        for (var i = 0; i != tabs.length; i++) {
          if (tabs[i] == element)
            return true;
        };
        return false;
      }
      var hidden_log = function ()
      {
        document.getElementById("error_hidden").style.display = "none";
      }

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