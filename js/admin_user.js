  $(document).ready(function () {
  $('.admin_delete').click(function(){
    var _this = $(this).parent().parent();
    $.ajax({
        url : '/admin_delete/'+$(this).parent().next().next().html(),
        type : 'POST',
        success : function(data){
          if (data.success)
            _this.remove();
        }
    });    
  });

  $('.admin_set').click(function(){
    var _this = $(this);
    $.ajax({
        url : '/admin_set/'+$(this).parent().next().next().html(),
        type : 'POST',
        success : function(data){
          if (data.success)
            _this.prev().remove();
            _this.parent().prepend('Master');
            _this.remove();
        }
    });    
  });
});