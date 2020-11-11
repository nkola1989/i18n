// inizializzo a vuoto in caso di primo accesso
window.app = !!window.app ? window.app : {};

// classe 
window.app.i18n = {
  current: 'en',
  deafult: 'en',
  browser: 'en',
  translations: {},

  init: function() {
    var self = this;
    // verifico se sul local storage è presente questo db
    var lang = localStorage.getItem('app.i18n.current');
    // in caso di local storage vuoto prendo il valore del browser
    lang = !!lang ? lang : ( navigator.language || navigator.userLanguage );
    // memorizzo la lingua del browser 
    localStorage.setItem('app.i18n.browser', (navigator.language || navigator.userLanguage));
    // imposto la lingua passando come parametro quella di default
    return this.setLanguage(this.deafult)
      .then(function() {
        // se la lingua è diversa da quella di default
        if (lang !== self.deafult) {
          // eseguo tutta la funzione
          return self.setLanguage(lang)
        }
      })
      .then(function() {
        // se ci sono errori imposto quella di default
        return self.current;
      });
  },

  setLanguage: function (lang) {
    var self = this;
    // setto la stringa della lingua
    lang = this.normalizeLanguageCode(lang);
    //cerco la lingua selezionata
    return this.getTranslation(lang)
      .then(function(translation) {
        //imposto come lingua corrente la lingua selezionata
        self.current = lang;
        console.log('setLanguage(): lang:'+lang);
        console.log('setLanguage(): self.translations\n',self.translations);
        //come testo tradotto da mostrare a video parsifico tutto e popolo dentro trasnlations4
        //come primo parametro è tutti i campi di default, come secondo tutti quelli della lingua scelta, se mancano campi li prendo dal default
        self.translations = Object.assign(self.translations, translation.translations);
        console.log('setLanguage(): translation.translations:\n',translation.translations);
      });
  },
  // imposto nel local storage la nuova lingua
  setCurrentLanguage: function(lang) {
    lang = this.normalizeLanguageCode(lang);
    //metto dentro lo storage la lingua
    localStorage.setItem('app.i18n.current', lang);
  
  },

  getTranslation: function (lang){
    var file = '/translations/' + lang + '/' + lang + '.json';
    console.log('Loading language file', file);
    //ottengo dal json il file della traduzione
    return fetch(file)
      .then(function(res){
        //parsifico in json e invio il dato al prossimo then
        return res.json();
      })
      .then(function(res){
        // qui ho la traduzione
        return res;
      })
      .catch(function(err){
        console.error(err);
        return []
      });
  },

  normalizeLanguageCode: function(lang) {
    lang.toLocaleLowerCase();
    if(lang.length > 2){
      //se è più grande lo taglio
      lang = lang.slice(0,2);
    }
    return lang;
  },

  // utilizzo la libreria per gestire i campi dinamici es: Ciao {{utente}} era da molto che non ti facevi vedere
  translate: function(text, data) {
    text = Mustache.render(text, Object.assign(this.translations, data));
    text = Mustache.render(text, data);
    return text;
  }
};

