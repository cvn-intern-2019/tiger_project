var checkFileExtension = (fileName)=>{
    return (['.jpg','.png'].includes(/[^.]+$/.exec(fileName)));
}
var checkMaxImageSize = (file)=>{
    return (file.size<10*1024*1024);
}

var printError = (err)=>{
    
}



$(document).ready(function(){
    $("#avatar_input").change(e=>{
        let avatar = e.target.files[0];
        if(!checkFileExtension(avatar.fileName)){
            printError("Avatar must be in jpg or png type.")
        };
    });
})