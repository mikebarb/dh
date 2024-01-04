import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["order", "drink", "drinkTemplate", "drinkSection", "showStatus", "statusSection"]
  
  connect() {
    console.log("brewster_controller connected", this.element)
  }

  //--------------------------------------------------------------
  // Called when a status button at top of orders is clicked! 
  // a) sets the status to be shown as data in the header div
  // b) turn the highlighting on or off for this button.
  showStatus(){
    console.log("showStatus called");
    const selectedStatusButton = event.currentTarget; 
    //const statusButtons  =  this.showStatusTargets;
    var selectedStatus = selectedStatusButton.getAttribute("data-status");
    const parentButtons = selectedStatusButton.parentNode;
    var currentShowStatus = parentButtons.getAttribute("data-showStatus"); 
    // chekc if selectedStatus contained in currentShowStatus
    if(currentShowStatus.includes(selectedStatus) ){                          // already selected
      selectedStatusButton.classList.remove("bg-blue-500");                   // then deselect - remove highlight
      selectedStatusButton.classList.add("bg-blue-200");
      var currentShowStatus = currentShowStatus.replace(selectedStatus,'');   // update show string
    }else{                                                                     // new selection
      selectedStatusButton.classList.remove("bg-blue-200");                    // then select - add highlight
      selectedStatusButton.classList.add("bg-blue-500");                   
      var currentShowStatus = currentShowStatus + " " + selectedStatus;   // update show string
    }
    currentShowStatus = currentShowStatus.replace(/\s+/g, ' ');
    currentShowStatus = currentShowStatus.trim();
    parentButtons.setAttribute("data-showStatus", currentShowStatus);          // Now, put this back into the buttons parent 
    
    // Now update the list of orders
    this.hideSelectedDrink()  
  }

  //--------------------------------------------------------------
  // Called when a drink button is clicked! 
  // a) sets or toggles the button
  // b) calls "hideSelectedDrink" to show and hide relevant orders.

  findSelectedDrink() {
    console.log("=== findSelectedDrink called ===");
    // Now determine what button was pressed.
    const selectedEle = event.currentTarget;
    var selectedDrink = selectedEle.getAttribute("data-drink");
    // get what drink is already selected, if any
    const parentEle = selectedEle.parentNode;
    var currentSelectedDrink = parentEle.getAttribute("data-show");
    if(currentSelectedDrink === ""){                           // when nothing set
      parentEle.setAttribute("data-show", selectedDrink);      //simply set to this drink
      selectedEle.classList.add("bg-blue-800");                // and show selected in caller button.
    }else{
      if(selectedDrink === currentSelectedDrink){              // already selected
        parentEle.setAttribute("data-show", "");               //   then toggle off
        selectedEle.classList.remove("bg-blue-800");           //   and so show selected in caller button.
      }else{                                                    // selecting a different drink
        parentEle.setAttribute("data-show", selectedDrink);     //   set to new changed value
        const allDrinks = this.drinkTargets;
        [...allDrinks].forEach(node=>{                          // remove prevous settings
          node.classList.remove("bg-blue-800");
        });
        selectedEle.classList.add("bg-blue-800");               // so show selected in caller button.
      }
    }    
    //var hideDrink = parentEle.getAttribute("data-show");
    // Now hide or show the orders
    this.hideSelectedDrink();
    //this.hideSelectedDrink(hideDrink);
      
  }

  //--------------------------------------------------------------
  // Called to show and hide orders  
  // a) called with parameters
  // 1. hideDrink   = the drink to be hidden, shows everything else
  // 2. flagAlready = this drink is currently set, simple need to reset!
  hideSelectedDrink() {
    console.log("hideSelectedDrink called.")
    const showStatus = this.statusSectionTarget.getAttribute("data-showStatus"); 
    const showDrink = this.drinkSectionTarget.getAttribute("data-show");
    const allOrders  =  this.orderTargets;
    [...allOrders].forEach(node=>{
      // show order if showDrink present (or blank) and showStatus are both present in the order
      // else hide     
      if( ((node.getAttribute("data-drink") == showDrink ) || ("" == showDrink)) &&
          showStatus.includes(node.getAttribute("data-status"))){
        node.classList.remove("hidden");      // display this order
      }else{
        node.classList.add("hidden");         //hide this order
      }
    });
  }

  //--------------------------------------------------------------
  // UPdate the status of an order 
  // - by pressing statua button for that order
  // - this function needs to be called after the turboframe refresh
  getOrders() {
    console.log("=== getOrders called ===")
    var countNew   = 0;
    var countReady = 0;
    var countDone  = 0;
    const newDrinks = {};
    const madeDrinks = {};
    const allOrders  =  this.orderTargets;
    [...allOrders].forEach(node=>{
      var thisDrink = node.getAttribute("data-drink");
      if(node.getAttribute("data-status") == "new"){
        countNew = countNew + 1;
        if(thisDrink in newDrinks){
          newDrinks[thisDrink] = newDrinks[thisDrink] + 1;
        }else{
          newDrinks[thisDrink] = 1
        }
      }
      if(node.getAttribute("data-status") == "ready"){
        countReady = countReady + 1;
        if(!(thisDrink in newDrinks)){
          madeDrinks[thisDrink] = 1;
        }
      }
      if(node.getAttribute("data-status") == "done"){
        countDone = countDone + 1;
      }
    });
    // this section is console logging for troubleshooting.
    console.log("drinks done :", "\t", countDone);
    console.log("drinks ready:", "\t", countReady);
    console.log("drinks new  :", "\t", countNew);
    console.log("Now list of new drinks by type.");

    [...Object.keys(newDrinks).sort()].forEach(itemkey=>{
      console.log(itemkey, "\t", newDrinks[itemkey]);
    });
    console.log("Now list of made drinks that are not in new drinks.");
    [...Object.keys(madeDrinks).sort()].forEach(itemkey=>{
      console.log(itemkey);
    });

    this.makeDrinkEnteries(newDrinks, madeDrinks);
  }

  //--------------------------------------------------------------
  // Create the Drinks to be made list  
  // a) called with parameters
  // 1. hideDrink   = the drink to be hidden, shows everything else
  // 2. flagAlready = this drink is currently set, simple need to reset!
  makeDrinkEnteries(makeDrinks, readyDrinks) {
    console.log("makeDrinkEnteries called");
    //console.log("Now list of made drinks that are not in new drinks.");
    //[...Object.keys(madeDrinks).sort()].forEach(itemkey=>{
    //  console.log(itemkey);
    //});
    const parentEle = this.drinkSectionTarget;
    const drinkDisplay = parentEle.getAttribute("data-show");
    console.log("drinkDisplay: ", drinkDisplay); 
    var headerEle = parentEle.children[0].cloneNode(true);
    const templateEle = this.drinkTemplateTarget;
    parentEle.replaceChildren();
    parentEle.appendChild(headerEle);    
    console.log("------------------------------");

    [...Object.keys(makeDrinks).sort()].forEach(myDrink=>{
      console.log(myDrink, "\t", makeDrinks[myDrink]);
      var drinkEle = templateEle.cloneNode(true); 
      drinkEle.classList.remove("hidden");
      drinkEle.setAttribute("data-brewster-target", "drink")  
      drinkEle.setAttribute("data-drink", myDrink)
      if(myDrink == drinkDisplay){
        drinkEle.classList.add("bg-blue-800");
      }
      console.log(drinkEle);
      var drinkEleChildren = drinkEle.children;
      console.log(drinkEleChildren);
      drinkEleChildren[0].innerText = myDrink;
      drinkEleChildren[1].innerText = makeDrinks[myDrink];
      console.log(drinkEle);
      parentEle.appendChild(drinkEle);
    });
    
    [...Object.keys(readyDrinks).sort()].forEach(myDrink=>{
      console.log(myDrink, "\t", readyDrinks[myDrink]);
      var drinkEle = templateEle.cloneNode(true); 
      drinkEle.classList.remove("hidden");
      drinkEle.setAttribute("data-brewster-target", "drink")  
      drinkEle.setAttribute("data-drink", myDrink)
      if(myDrink == drinkDisplay){
        drinkEle.classList.add("bg-blue-800");
      }
      console.log(drinkEle);
      var drinkEleChildren = drinkEle.children;
      console.log(drinkEleChildren);
      drinkEleChildren[0].innerText = myDrink;
      //drinkEleChildren[1].innerText = manyDrinks[myDrink];
      console.log(drinkEle);
      parentEle.appendChild(drinkEle);
    });


  }
}
