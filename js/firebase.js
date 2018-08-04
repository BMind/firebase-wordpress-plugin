(function( $ ) {
  'use strict';

  if(typeof window.firebaseOptions !== 'undefined'){

    // Initialize FirebaseApp
    if (!firebase.apps.length) {
        firebase.initializeApp(window.firebaseOptions);
    }

    $(document).ready(function(){
      init();
      // Check user state
      checkUserState().then(loggedin => {
          if(loggedin){
              $('.firebase-show').show();
              $('#firebase-signout').show();              
              $('.firebase-show-when-not-login').hide();
              showGreetings();
          } else {
              $('.firebase-show').hide();
              $('#firebase-signout').hide();
              $('.firebase-show-when-not-login').show();
          }
      })

      // Firebase login
      $("#firebase-form-submit").click(function(event){
        event.preventDefault();
        let data = $('#firebase-login-form :input').serializeArray();
        let email = data[0].value;
        let password = data[1].value;

        // start login into firebase
        if(email !== '' && password !== ''){
            firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                $('.firebase-show').show();
                $('#firebase-signout').show();
                $('p#firebase-login-error').hide();
                $('.firebase-show-when-not-login').hide();
                showGreetings();
            })
            .catch( error => {
                console.log(error.message);
                $('p#firebase-login-error').text(error.message);
            })
        } else {
            $('p#firebase-login-error').text('Your email or password is missing!');
        }
      });

      // Sign out action
      $('#firebase-signout').on('click', e => {
          e.preventDefault();
          firebase.auth().signOut()
          .then(() => {
              $('.firebase-show').hide();
              $('#firebase-signout').hide();
              $('p#firebase-login-error').hide();
              $('.firebase-show-when-not-login').show();
          })
          .catch(error => console.log(error))
      })

      function checkUserState(){
          return new Promise((resolve, reject) => {
              return firebase.auth().onAuthStateChanged(function (user) {
                  if (user) {
                      // User is signed in.
                      resolve(true);
                  } else {
                      // User is signed out.
                      resolve(false);
                  }
              });
          })
      }

      function showGreetings() {
          let userName = '';
          firebase.auth().onAuthStateChanged(function (user) {
              if (user) {
                  // User is signed in.
                  if(user.displayName === null){
                    $('#firebase-user').text(`Greetings, ${user.email}!`);
                  } else {
                    $('#firebase-user').text(`Greetings, ${user.displayName}!`);
                  }

              } else {
                $('#firebase-user').hide();
              }
          })
      }

      function init() {
        $('.firebase-show').hide();
        $('#firebase-signout').hide();
        $('.firebase-show-when-not-login').hide();
      }
    })
  } else {
    console.warn('Please enter your Firebase settings!');
  }
})( jQuery )
