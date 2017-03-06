$('input[name=send_rand]').click(function(){
    var regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,15}$/;
    var str = $('input[name=mdp_rand]').val();
    if (regex.test(str))
    {
        $.ajax({
            url : '/pass_random',
            type : 'POST',
            data : 'success=nice&mdp_rand='+$('input[name=mdp_rand]').val(), 
            success : function(data){
                if (data.success)
                {
                    $('.send_done').html('Un email vous a été envoyé.');
                    $('.send_done').show().delay(2000).hide(0);
                    $('input[name=mdp_rand]').val('');
                }
                else if (!data.success)
                    show_error(data.message);
            }
        });
    }
    else
        show_error('Votre mot de passe est incorrect.');
});

$('input[name=send_change_pass]').click(function(){
    var regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,15}$/;
    if (regex.test($('input[name=pass1]').val()) && regex.test($('input[name=pass2]').val()) && regex.test($('input[name=pass3]').val()))
    {
        if ($('input[name=pass1]').val() == $('input[name=pass2]').val())
        {
            $.ajax({
                url : '/new_pass',
                type : 'POST',
                data : 'success=nice&mdp1='+$('input[name=pass1]').val()+'&mdp2='+$('input[name=pass2]').val()+'&mdp3='+$('input[name=pass3]').val(), 
                success : function(data){
                    if (data.success)
                    {
                        $('.send_done').html('Votre mot de passe a bien été changer.');
                        $('.send_done').show().delay(2000).hide(0);
                        $('input[name=pass1]').val('');
                        $('input[name=pass2]').val('');
                        $('input[name=pass3]').val('');
                    }
                    else if (!data.success)
                        show_error('Votre mot de passe est incorrect.');
                }
            });
        }
        else
            show_error('Votre mot de passe est incorrect.');
    }
    else
        show_error('Votre mot de passe est incorrect.');
});