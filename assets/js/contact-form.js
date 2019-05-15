$("#contactForm").validator().on("submit", function (event) {
    if (event.isDefaultPrevented()) {
        // handle the invalid form...
        formError();
        submitMSG(false, "Please fill up the form properly?");
    } else {
        /// everything looks good!
        event.preventDefault();
        var response = grecaptcha.getResponse();
        if (!response) {
            formError();
            submitMSG(false, "You must complete Captcha!");
        } else {
            submitForm();
        }
    }
});


function submitForm(){
    // Initiate Variables With Form Content
    var name = $("#name").val();
    var email = $("#email").val();
    var message = $("#message").val();
    $("#form-submit").prop('disabled', true);
    $('#activity_panel').showLoading();
    $.ajax({
        type: "POST",
        url: "process.php?action=contact",
        data: "name=" + name + "&email=" + email + "&message=" + message + "&captcha=" + grecaptcha.getResponse(),
        success : function(text){
            if (text == "success"){
                formSuccess();
            } else {
                formError();
                submitMSG(false,text);
            }
        }
    });
}

function formSuccess(){
    $("#contactForm")[0].reset();
    grecaptcha.reset();
    submitMSG(true, "Message Submitted!")
}

function formError(){
    $("#contactForm").removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        $(this).removeClass();
    });
}

function submitMSG(valid, msg){
    if(valid){
        var msgClasses = "h3 text-center tada animated text-success";
    } else {
        var msgClasses = "h3 text-center text-danger";
    }
    $('#activity_panel').delay(500).hideLoading();
    $("#msgSubmit").removeClass().addClass(msgClasses).delay(800).text(msg);
    $("#form-submit").prop('disabled', false);
}
