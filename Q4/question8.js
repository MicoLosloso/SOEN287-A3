function updateDateTime() {

    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var today  = new Date();
    var date = today.toLocaleDateString("en-US", options);

    var hours = String(today.getHours()).padStart(2, '0');
    var minutes = String(today.getMinutes()).padStart(2, '0');
    var seconds = String(today.getSeconds()).padStart(2, '0');

    var time = date + " | " + hours + ":" + minutes + ":" + seconds;

    document.getElementById("currentTime").innerHTML = time;
  }
  
  setInterval(updateDateTime, 1000);
  
  updateDateTime();

  function findValidate(){

    let valid = true;


    let typeValidate = document.querySelector('input[name=pet]:checked');

    if(typeValidate == null){
      alert('Please select a type of pet!');
      valid = false;
    }
    let getAlongValidate = document.querySelector('input[name=getalong]:checked');
    
    if(getAlongValidate == null){
      alert('Please select if pet gets along or not!');
      valid = false;
    }

    let genderValidate = document.querySelector('input[name=gender]:checked');
    if(genderValidate == null){
      alert('Please select a gender!');
      valid = false;
    }

    let breedValidate = document.getElementsByName( "breed[]" );
    let validBreed = false;
    
    for ( let i = 0; i < breedValidate.length; i++ ) {
      if ( breedValidate[i].checked == true ){
        validBreed = true;
        break; 
      }
   
   }

   if (!validBreed) {
    alert("Please select at least one breed!");
}

    if (valid && validBreed){
      alert('Form Submitted Succesfully!');
      
    }
  }

  function giveawayValidate(){

    let giveawayValid = true;

    const name = document.getElementById("fn").value;
    const lastName = document.getElementById("ln").value;

    if (name === '' || lastName === '') {
      giveawayValid = false;
      alert('Please do not leave textboxes empty!');
    }

    const email = document.getElementById("em").value;

    if (!email.match(/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)){
      giveawayValid = false;
      alert('Please enter a valid email!');

    }

    let typeValidate2 = document.querySelector('input[name=givePet]:checked');

    if(typeValidate2 == null){
      alert('Please select a type of pet!');
      giveawayValid  = false;
    }

    let breedValidate2 = document.getElementsByName( "breed2[]" );
    let validBreed2 = false;
    
    for ( let i = 0; i < breedValidate2.length; i++ ) {
      if ( breedValidate2[i].checked == true ){
        validBreed2 = true;
        break; 
      }
   
   }

   if (!validBreed2) {
    alert("Please select at least one breed!");}

    let genderValidate2 = document.querySelector('input[name=giveGender]:checked');
    if(genderValidate2 == null){
      alert('Please select a gender!');
      valid = false;
    }

    let getAlongValidate2 = document.querySelector('input[name=givegetalong]:checked');
    
    if(getAlongValidate2 == null){
      alert('Please select if pet gets along or not!');
      giveawayValid = false;
    }

    let commentsValidate = document.getElementById("ac").value;
    if(commentsValidate.trim() === ""){
      giveawayValid = false;
      alert('Please write some additional comments');
    }



    if (giveawayValid && validBreed2){
      alert('Form Submitted Succesfully!');
      
    }
    }

   

