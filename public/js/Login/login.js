//MENU DE FUNCIONES DE INICIO
$(document).ready(function(e){
  $('#login').click(ValidaLogin);
  $(document).keypress(function(event){
      var keycode = (event.keyCode ? event.keyCode : event.which);
      if(keycode == '13'){
          ValidaLogin();
      }
  });
});
//---------------------------------------------------------------------------------
//FUNCION DE VALIDACION DEL LOGIN 
function ValidaLogin(){
    $.ajax({
        url:"/login",
        data:$("#formlogin").serialize(),
        type:'POST',
        datatype:"json",
        beforeSend: function () {
        }, 
        success:function(res){
            if(!res.exito){
                alertify.error(res.msg);
                return;
            }
            if(!res.acceso){
                alertify.error("Usuario o contraseña incorrecto/a.");  //(-_-)
                return;
            }
            window.location.assign(res.redirect);           
        }
    }); 
}
