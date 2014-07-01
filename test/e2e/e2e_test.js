describe('angularjs homepage', function() {
  it('should greet the named user', function() {
    browser.get('http://127.0.0.1:5000/');

    element.all(by.css('nav ul li')).filter(function(elem) {
      return elem.getText().then(function(text) {
        return text === 'Current standings';
      });
    }).then(function(filteredElements) {
      //  switch to current standings view
      filteredElements[0].click().then(function(){
        element(by.css('#board-view h2')).then(function(elem){
          elem.getText().then(function(text){
            expect(text).toEqual("Board");
          });
        });
      });
    }).then(function() {
        element.all(by.css("#board-view tbody tr")).then(function(items){
          expect(items.length).toEqual(11);
        });
      });
  });
});