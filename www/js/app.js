// Wait for Cordova to connect with the device
//
document.addEventListener("deviceready",onDeviceReady,false);

// Cordova is ready to be used!
//
function onDeviceReady() {
    $('#take-pic').click(function(){
      getPhoto(navigator.camera.PictureSourceType.PHOTOLIBRARY);
    });
    $('#upload-pic').click(function(){
      uploadPic();
    });
}

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
  // Uncomment to view the base64 encoded image data
  // console.log(imageData);

  // Get image handle
  //
  var smallImage = document.getElementById('smallImage');

  // Unhide image elements
  //
  smallImage.style.display = 'block';

  // Show the captured photo
  // The inline CSS rules are used to resize the image
  //
  smallImage.src = "data:image/jpeg;base64," + imageData;
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
  // Uncomment to view the image file URI
  // console.log(imageURI);


  // Setting the image
  $('#selected-image').attr('src',imageURI);
  $('#upload-pic').removeAttr("disabled");
}

// A button will call this function
//
function getPhoto(source) {
  // Retrieve image file location from specified source
  navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
    destinationType: navigator.camera.DestinationType.FILE_URI,
    sourceType: source });
}

// Called if something bad happens.
//
function onFail(message) {
  alert('Failed because: ' + message);
}

function uploadPic() {
  var imageURI = $('#selected-image').attr('src');
  var options = new FileUploadOptions();
  options.fileKey="file";
  options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
  options.mimeType="image/jpeg";

  navigator.geolocation.getCurrentPosition(function(position) {
    var params = {};
    params.latitude = position.coords.latitude;
    params.longitude = position.coords.longitude;
    params.accuracy = position.coords.accuracy;
    params.timestamp = position.timestamp;

    options.params = params;

    var ft = new FileTransfer();
    ft.upload(imageURI, "http://requestb.in/1145iuo1", win, fail, options);
  },
  function (error) {
    console.log('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
  });
}

function win(r) {
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
}

function fail(error) {
    alert("An error has occurred: Code = " + error.code);
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
}
