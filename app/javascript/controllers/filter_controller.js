import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["requestNotice", "filterText", "person", "requestPersonId", "requestName",
                    "requestDrink", "addPersonName", "requestPersonId1", "addPersonButton", "button" ]
  
  connect() {
    console.log("filter_controller connected", this.element)
  }

  //--------------------------------------------------------------
  // Test function - invoked by pressing the request filter button
  requestFilter() {
    console.log("filter button pressed", this.element)
    this.doFilter()
  }

  //--------------------------------------------------------------
  // invoked when the content of the filter Text field changes.
  // it then invokes doFilter()
  changeFilterText() {
    const textElement = this.filterTextTarget
    //console.log("text changed in filterTextField", textElement.value)
    this.doFilter()
  }
  //--------------------------------------------------------------
  // select person and put details in ordering section
  selectPerson(){
    //console.log("selectPerson called")
    //clear the flash notice html div field
    if( this.hasRequestNoticeTarget){
      this.requestNoticeTarget.innerText = ""
    }
    // make sure there are people to process
    // get the element that made this call
    const personNode = event.currentTarget
    // get a array of all the nodes (tr) containing each person
    const allPeople  =  this.personTargets;
    console.log(allPeople);
    // step through each person, resetting previous selection
    [...allPeople].forEach(node=>{
      node.classList.remove('text-black', 'font-extrabold');
      node.classList.add('text-white');
    });
    // show what is selected by changing text colour
    personNode.parentNode.classList.remove("text-white");
    personNode.parentNode.classList.add("text-black", 'font-extrabold');

    // data attributes are held in the parent element (tr)
    const personParentNode = personNode.parentNode
    const textPersonDrink = personParentNode.getAttribute("data_order_drink")
    // copy attributes, held in target's parent,
    // for this person into the request order fields. 
    this.requestPersonIdTarget.value = personParentNode.getAttribute("data_person_id")
    this.requestNameTarget.value = personParentNode.getAttribute("data_name")
    this.requestDrinkTarget.value = personParentNode.getAttribute("data_order_drink")   
    // reset buttons
    this.initialiseButtons()
  }
  //---------------------------------------------------------------
  // Filters all the people by name 
  // input: the text field
  // operation: 1. shows or hides the table row dependant on
  //               if the text field text can be found in the name.
  //            2. Can only add a person if a person's name does 
  //               not already exist.
  //               Sets canAddName = FALSE if anyone has a name 
  //               exactly matches the search script. 
  //               Otherwise, set to TRUE.
  //                 
  doFilter(){
    //console.log("filter function requested", this.element)
    
    // initialise canAddName - default to prevent adding a person
    let canAddName = true
    // get the text to use as the filter
    const filterText = this.filterTextTarget.value.trim().toLowerCase()
    // get the button that need to be displayed or hidden - addPersonName
    const addPersonButton = this.addPersonButtonTarget

    // ensure there are people on the page
    if(this.hasPersonTarget) {
      // As there are people, set canAddName to allow adding another
      // person unless we find an exact match.
      canAddName = true

      // get a array of all the nodes (tr) containing each person
      const allPeople  =  this.personTargets;
      console.log(allPeople);

      const allButtons  =  this.buttonTargets;
      console.log(allButtons);
  
      // step through each person, hiding or showing tr based on a filter match
      [...allPeople].forEach(node=>{
        if (node.getAttribute('data_name').toLowerCase().includes(filterText)) {
          node.style.display = ''
        } else {
          node.style.display = 'none'
        }
        // Check if this person is an exact match
         if(canAddName){
          if(node.getAttribute('data_name').toLowerCase().trim().normalize() === filterText.normalize()){
            canAddName = false
          }
        }
      });
      if(canAddName){
        this.addPersonNameTarget.value = this.filterTextTarget.value.trim()
        addPersonButton.hidden = false
      }else{
        this.addPersonNameTarget.value = ""
        addPersonButton.hidden = true
      }
    }
  };

  //-------------------------------------------------------------------------------------------------------------------------------
  // This sorting code is taken from
  //   https://stackoverflow.com/questions/69809178/what-is-the-most-efficient-way-to-sort-dom-elements-based-on-values-in-an-array
  //-------------------------------------------------------------------------------------------------------------------------------
  // Sorts the people (table rows) by name order
  doSort(){
    console.log("sort function called", this.element)

    if(this.hasPersonTarget) {
      const allPeople  =  this.personTargets;
      const peopleContainer = allPeople[0].parentNode;    

      // create hash: node id => node (person element)
      const peopleElements = {};
      [...allPeople].forEach(node=>{
        peopleElements[node.id] = node;
      });
      
      // get all the hash keys, then sort them by person
      // name which is held in the tr data attribute
      const ids = Object.keys(peopleElements)
      ids.sort((a,b) => {
        return peopleElements[a].getAttribute('data_name').localeCompare(peopleElements[b].getAttribute('data_name'))
      })

      // repopulate the people container with everyone in correct order
      // nb when appending, the original is removed from the people container.
      ids.forEach(id=>{
        const node = peopleElements[id];
        peopleContainer.append(node);
      });
    };
  }

  //***************************************************************************************************************************** */
  //-------------------------------------------------------------------------------------------------------------------------------
  // Managing the drink selection buttons
  // Copied from old version
  //-------------------------------------------------------------------------------------------------------------------------------

  // For drink buttons, deselect all drink buttons.
  // and hide the options
  initialiseButtons() {
    console.log("initialiseButtons called.");

    // build an array of all buttons
    const allButtons  =  this.buttonTargets;
    // initialise the display of the buttons.
    [...allButtons].forEach(node=>{
      //if(node.classList.contains("text-black")){
      //  node.classList.remove("text-black");
        node.classList.add("text-white");
      //}
      if(node.getAttribute("data-category") != "Drink"){
        //console.log("attribute", node.getAttribute("data-category"));
        node.parentNode.classList.add("hidden");
        node.classList.add("hidden");
      }
    });
  }
  // Called when a "drink" button is selected.
  selectDrinkButton(){
    console.log("selectDrinkButton called.");

    this.initialiseButtons();

    // Now determine what button was pressed.
    const buttonNode = event.currentTarget;
    // show it
    buttonNode.classList.remove("text-white");
    console.log(buttonNode);
    // what else should be displayed.

    // If a drink button was displayed, then determine what
    // options need to be displayed with it.
    if(buttonNode.getAttribute("data-category") == "Drink"){
      // now determine what option buttons need to be enabled
      const enableButtons = buttonNode.getAttribute("data-enable").split(", ");
      [...enableButtons].forEach(button=>{
        console.log("enable:" + button);
        document.getElementById(button).parentNode.classList.remove("hidden");
        document.getElementById(button).classList.remove("hidden");
      });
    }  
    this.makeDrinkDescription();
  }  

  // Called when a "drink option" button is selected.
  selectOptionButton(){
    console.log("selectOptionButton called.");
    // Now determine what button was pressed.
    const buttonNode = event.currentTarget;
    // check if this button is already selected?
    // if so, remember so you can deselect it later.
    var buttonSelected = false;
    if(!buttonNode.classList.contains("text-white")){
      console.log("already selected.");
      buttonSelected = true;
    }
    // what actions should be taken.
    // start by getting the option group this button belongs to
    const optionGroup = buttonNode.parentNode;
    const buttonGroup = optionGroup.getElementsByTagName("button");
    // start by deselecting all button in this group
    [...buttonGroup].forEach(button=>{
      button.classList.add("text-white");
    })
    // select this button unless it was already selected,
    // then deselect it; else select it.
    if(buttonSelected == true){
      buttonNode.classList.add("text-white");
    }else{
      buttonNode.classList.remove("text-white");
    }
    this.makeDrinkDescription();
  }

  // make the full drink description to be placed
  // in the drink ordering field.
  makeDrinkDescription(){
    console.log("makeDrinkDescription called");
    var description = "";
    // build an array of all buttons
    const allButtons  =  this.buttonTargets;
    // concatenate selected button names
    [...allButtons].forEach(node=>{
      if(!node.classList.contains("text-white")){
        description = description + node.innerText + " ";
      }
    });
    //place into the field ready for ordering drinks
    this.requestDrinkTarget.value = description.trim()
  }

}
