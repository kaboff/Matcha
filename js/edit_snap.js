var is_image = function(file, nb)
  {
    var result = false;
    var fileReader = new FileReader();
    fileReader.onloadend = function(e) {
      var arr = (new Uint8Array(e.target.result)).subarray(0, 4);
      var header = "";
      for(var i = 0; i < arr.length; i++) {
         header += arr[i].toString(16);
      }
      if (header == "89504e47") 
        image_or_not(true, file, nb);
      else if (header == "47494638")
        image_or_not(true, file, nb);
      else if (header == "ffd8ffe0")
        image_or_not(true, file, nb);
      else
        image_or_not(false, file, nb);
    };
    fileReader.readAsArrayBuffer(file);
  }

  $('.input_delete').click(function(){
    nb = $(this).attr('id').slice(-1);
    $.ajax({
      url : '/delete_img',
      type : 'POST',
      data : 'success=nice&nb='+nb,
      success : function(){
        clear_div(nb);
      }
    });
  });

  var image_or_not = function(result, selectedFile, nb)
  {
    if (result)
    {
        selectedFile.convertToBase64(function(base64){
            document.getElementById('idblockimg' + nb).innerHTML = "<img id='snap"+nb+"' src=>";
            document.getElementById('snap' + nb).setAttribute('src', base64);
            document.getElementById('input_upload' + nb).style.color = '#8fbc8f';
            document.getElementById('input_upload' + nb).style.marginRight = "50px";
            document.getElementById('input_clear' + nb).style.display = 'inline-block';
            document.getElementById('input_delete' + nb).style.display = 'none';
        });
    }
    else
    {
      clear_div(nb);
      show_error("Votre fichier n'est pas une image valide.");
    }
  }

  $('.inputfile').each( function()
  {
    nb_input++;
    var $input   = $(this),
      $label   = $input.next( 'label' ),
      labelVal = $label.html();

    $input.on('change', function(e)
    {
      var fileName = '';

      if (this.files && this.files.length > 1)
        fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
      else if (e.target.value)
        fileName = e.target.value.split( '\\' ).pop();

      if (fileName)
      {
        while (fileName.length > 35)
          fileName = fileName.substr(0, (fileName.length / 2)) + "...";
        $label.find( 'span' ).html( fileName );
      }
      else
        $label.html( labelVal );
    });

    $input
    .on( 'focus', function(){ $input.addClass( 'has-focus' ); })
    .on( 'blur', function(){ $input.removeClass( 'has-focus' ); });
  });


   File.prototype.convertToBase64 = function(callback){ 
            var reader = new FileReader();
            reader.onload = function(e) {
                 callback(e.target.result)
            };
            reader.onerror = function(e) {
                 callback(null);
            };        
            reader.readAsDataURL(this);
    };

    $("#file-1, #file-2, #file-3 , #file-4 , #file-5").on('change',function(){
      var selectedFile = this.files[0];
      is_image(selectedFile, this.id.slice(-1));
    });

    $("#file-1, #file-2, #file-3 , #file-4 , #file-5").on('click',function(){
      clear_div(this.id.slice(-1));
    });