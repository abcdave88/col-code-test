$(document).ready(function(){

  //get request to api 
  function getPools(){
    $.ajax({ 
        method: 'GET',
        url: "https://colossusdevtest.herokuapp.com/api/pools.json",
        dataType:  'text' 
    }).success(function (data, jqXHR, textStatus) {
        var pools = JSON.parse(data.slice(5));
        console.log(pools);
        printPools(organisePools(pools));
    }).fail(function (jqXHR, textStatus) {
        console.log(textStatus)
    });
  };

  //iterates over JSON object and picks out required data ready for printing to page
  function organisePools(pools){
    var poolsObj = []; 
    $(pools).each(function(i, val){
      //checking for pools 
      if (val.pools.length > 0){
        $(val.pools).each(function(i, val){
          pool = {  
            name: val.name, 
            type: val.type_code, 
            headlinePrize: val.headline_prize, 
            id: val.id,
            sportCode: val.sport_code 
          }
          poolsObj.push(pool);
        })
      }
      //checking for pools nested futher in the object
      else{
        $(val.groups).each(function(i, val){
          $(val.pools).each(function(i, val){
            pool = {  
              name: val.name, 
              type: val.type_code, 
              headlinePrize: val.headline_prize, 
              id: val.id,
              sportCode: val.sport_code 
            }
            poolsObj.push(pool);
          })
        })
      }
     })
    return poolsObj;
  };

  //prints pools to page
  function printPools(pools){  
    $(pools).each(function(i, val){
      $('.container').append('<div class="col-md-offset-4 col-md-4 items" data-id="'+val.id+'"><h2>'+val.name+'</h2><h3>Bet Type: '+val.type+'</h3><h4>Headline Prize: '+val.headlinePrize+'</h4><div class="legs"></div><button class="btn btn-primary" id="'+val.id+'" type="submit">View more</button></div>')
    })
  }

  //get more info on selected pool
  function getMore(){
    var id = this.id;
     $.ajax({ 
        method: 'GET',
        url: "https://colossusdevtest.herokuapp.com/api/pools/"+id+".json",
        dataType:  'text' 
    }).success(function (data, jqXHR, textStatus) {
        var legs = JSON.parse(data.slice(5));
        printLegs(organiseLegs(legs), id);
    }).fail(function (jqXHR, textStatus) {
        console.log(textStatus)
    });
  }

  //organises leg info ready for print
  function organiseLegs(legs){
  var legObj = []
  var selections = []
   //push event name into obj
    $(legs.legs).each(function(i, val){
      var i = {};
      i.name = val.sport_event.name;
      i.legId = val.id
     $(val.selections).each(function(i, val){
      selections.push(val.name);
     })
     //removes duplicates from our selections array.
      var unique = selections.filter(function(elem, index, self) {
        return index == self.indexOf(elem);
      })
      i.selections = unique;
      legObj.push(i);
    })
   return legObj;
  }

  //prints leg info with checkboxes
  function printLegs(legs, id){
    $(legs).each(function(i, val){
      var legId = val.legId; 
      var el = document.getElementById(id);
      $(el.parentElement.getElementsByClassName('legs')).append('<div id="'+val.legId+'"><p>'+ val.name +'</p>')
       $(val.selections).each(function(i, val){
        $('#'+legId).append('<input type="checkbox" name="option" value="'+val+'">'+val+'')
       })
    })
  }

  //uses event delegation
  $('body').on('click', '.btn', getMore);

  getPools();
});




