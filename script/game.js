// usando ES6 utilizziamo le async await per una potenza asincrona 
window.addEventListener('load', async () => {

  const data = {
    browser_lang: localStorage.getItem('app.i18n.browser'),
    user: {
      name: 'NomeGiocatore',
      surname: 'EtàGiocatore'
    }
  };

  // Carico la libreria che ho creato e non eseguo tutto il resto del codice fino a quando non è stato caricato 
  await window.app.i18n.init();

  //una volta caricato init() traduco ogni {{nell'html}}
  var elements = document.querySelectorAll('[data-mode="i18n"]');
  elements.forEach(function(el) {
    el.innerHTML = window.app.i18n.translate(el.innerHTML, data);
  });

  /* 
    // COMMON JS
    window.app.i18n.init()
        .then(function() {

          var elements = document.querySelectorAll('[data-mode="i18n"]');
          elements.forEach(function(el) {
            el.innerHTML = window.app.i18n.translate(el.innerHTML, data);
          });
        });
  */

  document.getElementById('btn_select').addEventListener('click', (evt) => {
    //gestisco il refrash del form
    evt.preventDefault();
    //ottengo la lingua selezionata
    var chooseLanguage = document.getElementById("select_language").value.toLocaleLowerCase();
    console.log(chooseLanguage)
    // imposto il nuovo linguaggio
    window.app.i18n.setCurrentLanguage(chooseLanguage);
    // refresh della pagina
    location.reload();
  });
  
});