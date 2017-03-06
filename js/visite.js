    $(document).ready(function() {
      if ($('.flipper').length)
      { 
        $.ajax({
              url : '/see_visite',
              type : 'POST',
              success : function(data){
              }
        });
      }
      else
        $('.top-choice').next().append("<h3 style='margin-top: 200px;'>Vous n'avez aucune visite...</h3>");
    });

    $('.front .ion-arrow-return-right').click(function()
    {
      $(this).parent().parent().addClass("flip").delay(5000).queue(function(next){
        $(this).removeClass("flip");
        next();
      });
    });

    $('.front .ion-arrow-shrink').click(function()
    {
      $(this).next().next().next().next().next().next().children().removeClass('full_img');
      $(this).next().next().next().next().next().next().next().show();
      $(this).hide().next().show().next().show();
    });

    $('.front .ion-arrow-expand').click(function()
    {
      $(this).next().next().next().next().next().children().addClass('full_img');
      $(this).next().next().next().next().next().next().hide();
      $(this).next().hide();
      $(this).prev().show();
      $(this).hide();
    });
