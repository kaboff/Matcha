$(document).ready(function(){
      $("#inscription").click(function(){
          document.getElementById("error_hidden").style.display = "none";
          var orientation=$("#orientation").val();
          var iam=$("#iam").val();
          var day=$("#day").val();
          var month=$("#month").val();
          var years=$("#years").val();
          $.ajax({
            url : '/',
            type : 'POST',
            data : 'day=' + day + '&month=' + month + '&years=' + years + '&iam=' + iam + '&orientation=' + orientation + '&email=' + $("input[name=email]").val() + '&login=' + $("input[name=login]").val() + '&name=' + $("input[name=name]").val() + '&surname=' + $("input[name=surname]").val() + '&mdp=' + $("input[name=mdp]").val() + '&mdpsure=' + $("input[name=mdpsure]").val(), 
            success : function(data){
              if (data.success)
              {
                var redirectUrl = '/inscription';
                var form = $('<form action="' + redirectUrl + '" method="post">' +
                '<input type="hidden" name="parameter1" value="sample" />' +
                '<input type="hidden" name="parameter2" value="Sample data 2" />' +
                '</form>');
                $('body').append(form);
                $(form).submit();
              }
              else if (!data.success)
              {
                document.getElementById("msg_error").innerHTML = data.message;
                document.getElementById("error_hidden").style.display = "block";
              }
            }
          });
      });
  });

  var connexion = function()
  {
    $.ajax({
            url : '/login',
            type : 'POST',
            data : 'login=' + $("input[name=login_co]").val() + '&pass=' + $("input[name=pass_co]").val(), 
            success : function(data){
              if (data.success)
              {
                var redirectUrl = '/meetal';
                var form = $('<form action="' + redirectUrl + '" method="get"></form>');
                $('body').append(form);
                $(form).submit();
              }
              else if (!data.success)
              {
                document.getElementById("msg_error").innerHTML = data.message;
                document.getElementById("error_hidden").style.display = "block";
              }
            }
          });
  }

  var lost_log = function ()
  {
    document.getElementById("block4").style.display = "block";
    document.getElementById("block4").style.animation = "lost_app 0.5s ease-in-out";
  }

  var hidden_log = function ()
  {
    document.getElementById("error_hidden").style.display = "none";
  }

  var log = function ()
  {
    document.getElementById("complete").style.display = "none";
    document.getElementById('cont_block').style.display = 'none';
    document.getElementById('last_block').style.display = 'none';
    document.getElementById("log_active").style.display = "block";
    document.getElementById("error_hidden").style.display = "none";
  }

  var inscr = function () {
    document.getElementById("complete").style.display = "none";
    document.getElementById('cont_block').style.display = 'block';
    document.getElementById("log_active").style.display = "none";
    document.getElementById('last_block').style.display = 'block';
  }

  var mdp_lost = function (){
    document.getElementById('div_cont_lost').style.display = 'block';
  }
  var hidden_mdp_lost = function (){
    document.getElementById('div_cont_lost').style.display = 'none';
        document.getElementById('div_mdp_lost').innerHTML = "<h3><i>Mot de passe oublié</i></h3><b><i id='not_exist' style='display: none; color: red;'>Cette adresse email n'existe pas.</i></b><br><input type='text' id='input_inscr' name='email-lost' placeholder='Adresse email'></input><br><br><input style='width: 250px; margin-left: calc(50% - 125px);' type='submit' id='send_mdp_lost' onclick='send_lost();' value='Renvoie de mot de passe'><br><input style='width: 150px; margin-left: calc(50% - 75px); background-color: gray;' type='submit' onclick='hidden_mdp_lost();'' value='Retour'>";
     $('#input_inscr').keypress(function(event){
      if (event.keyCode === 10 || event.keyCode === 13) 
        send_lost();
  });
  }


  window.onload = function ()
  {
    var day = document.getElementById("day");
    for (var i = 1; i != 32; i++) {
      day.innerHTML += '<option value='+i+'>'+i+'</option>';
    };
    var years = document.getElementById("years");
    for (var i = 1998; i != 1919; i--) {
      years.innerHTML += '<option value='+i+'>'+i+'</option>';
    };
  };

  $('#login_co, #pass_co').keypress(function(event){
    if (event.keyCode === 10 || event.keyCode === 13) 
      connexion();
  });
  $('#input_inscr').keypress(function(event){
    if (event.keyCode === 10 || event.keyCode === 13) 
      send_lost();
  });

   $("input[name=login]").keyup(function(){
      var str = $('input[name=login]').val();
      if (str.match("^[a-zA-Z0-9]([._](?![._])|[a-zA-Z0-9]){2,10}[a-zA-Z0-9]$"))
        document.getElementsByName("login")[0].style.border = "2px solid green";
      else
        document.getElementsByName("login")[0].style.border = "2px solid red";
  });

    $("input[name=mdp]").keyup(function(){
      var regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,15}$/;
      var str = $('input[name=mdp]').val();
      if (regex.test(str))
        document.getElementsByName("mdp")[0].style.border = "2px solid green";
      else
        document.getElementsByName("mdp")[0].style.border = "2px solid red";
  });
    $("input[name=mdpsure]").keyup(function(){
      var regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,15}$/;
      var str = $('input[name=mdpsure]').val();
      if (regex.test(str))
        document.getElementsByName("mdpsure")[0].style.border = "2px solid green";
      else
        document.getElementsByName("mdpsure")[0].style.border = "2px solid red";
  });
    $("input[name=email]").keyup(function(){
      var regex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
      var str = $('input[name=email]').val();
      if (regex.test(str))
        document.getElementsByName("email")[0].style.border = "2px solid green";
      else
        document.getElementsByName("email")[0].style.border = "2px solid red";
  });

    $("input[name=name]").keyup(function(){
      var regex = /^([a-zàáâãäåçèéêëìíîïðòóôõöøùúûüýÿ](-| |')?){2,20}[a-zàáâãäåçèéêëìíîïðòóôõöøùúûüýÿ]$/i;
      var str = $('input[name=name]').val();
      if (regex.test(str))
        document.getElementsByName("name")[0].style.border = "2px solid green";
      else
        document.getElementsByName("name")[0].style.border = "2px solid red";
  });

    $("input[name=surname]").keyup(function(){
      var regex = /^([a-zàáâãäåçèéêëìíîïðòóôõöøùúûüýÿ](-| |')?){2,20}[a-zàáâãäåçèéêëìíîïðòóôõöøùúûüýÿ]$/i;
      var str = $('input[name=surname]').val();
      if (regex.test(str))
        document.getElementsByName("surname")[0].style.border = "2px solid green";
      else
        document.getElementsByName("surname")[0].style.border = "2px solid red";
  });
      var send_lost = function ()
      {
        $.ajax({
            url : '/mdp_lost',
            type : 'POST',
            data : 'mymail='+$("input[name=email-lost]").val(),
            success : function(data){
              if (data.success)
              {
                document.getElementById('div_mdp_lost').innerHTML = "<br><img style='width: 100px;' src='/images/icon/mail-outgoing.png'><br><br>Un email vous a ete envoyer.<br><br><input style='width: 150px; margin-left: calc(50% - 75px); background-color: gray;' type='submit' onclick='hidden_mdp_lost();' value='Retour'>";
              }
              else              
              {
                document.getElementById('not_exist').style.display = 'block';
              }
            }
          });
      }