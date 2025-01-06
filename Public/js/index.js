$(document).ready(function(){
    let currentUrl = window.location.pathname;
    
    switch(currentUrl){
        case "/":
            $("#ss1").addClass("active");
            break;
        case "/work":
            $("#ss2").addClass("active");
            break;

        case "/exercise":
        $("#ss3").addClass("active");
        break;

        default:
            alert("You have created new list")

    }
});

$("#addbutton").click(function(){
    $("#addbutton").addClass("clicked");
});