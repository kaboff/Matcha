$('input[name=new_mail]').keyup(function(){
      var regex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
      var str = $('input[name=new_mail]').val();
      if (regex.test(str))
        $('input[name=new_mail]').css('border', '2px solid green');
      else if ($('input[name=new_mail]').val() == '')
      	$('input[name=new_mail]').css('border', '0');
      else
      	$('input[name=new_mail]').css('border', '2px solid red');
});

$('input[name=send_new_mail]').click(function(){
    var regex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    if (regex.test($('input[name=new_mail]').val()))
	{
        $.ajax({
            url : '/new_mail',
            type : 'POST',
            data : 'success=nice&new_mail='+$('input[name=new_mail]').val(), 
            success : function(data){
            	if (data.success)
            	{
            		$('.send_done').html("Un email vous a été envoyé sur l'adresse email indiquer.");
              		$('.send_done').show().delay(2000).hide(0);
            	}
              	else if (!data.success)
              		show_error(data.message);
            }
        });

	}
	else
		show_error('Votre nouvelle adresse email est incorrecte.');
});