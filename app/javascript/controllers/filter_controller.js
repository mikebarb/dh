import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["requestNotice", "filterText", "person", "requestPersonId", "requestName", "requestDrink"]
  
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
  // invoked when the content of the filter Text filed changes.
  // it then invokes soFilter()
  changeFilterText() {
    const textElement = this.filterTextTarget
    console.log("text changed in filterTextField", textElement.value)
    this.doFilter()
  }
  //--------------------------------------------------------------
  // select person and put details in ordering section
  selectPerson(){
    console.log("selectPerson called")
    //clear the flash notice html div field
    this.requestNoticeTarget.innerText = ""
    // get the element (td) that made this call
    const personNode = event.currentTarget
    // data attributes are held in the parent element (tr)
    const personParentNode = personNode.parentNode
    const textPersonDrink = personParentNode.getAttribute("data_order_drink")
    // copy attributes, held in target's parent,
    // for this person into the request order fields. 
    this.requestPersonIdTarget.value = personParentNode.getAttribute("data_person_id")
    this.requestNameTarget.value = personParentNode.getAttribute("data_name")
    this.requestDrinkTarget.value = personParentNode.getAttribute("data_order_drink")    
  }
  //---------------------------------------------------------------
  // Filters all the people by name 
  // input: the text field
  // operation: shows or hides the table row dependant on
  //            if the text field text can be found in the name.
  doFilter(){
    console.log("filter function requested", this.element)
    
    // get the text to use as the filter
    const filterText = this.filterTextTarget.value.toLowerCase()
    //console.log("filterTextField: ", filterText)
    
    // ensure there are people on the page
    if(this.hasPersonTarget) {
      // get a array of all the nodes (tr) containing each person
      const allPeople  =  this.personTargets;
      //console.log("list all the People  - allPeople", allPeople);

      // step through each person, hiding or showing tr based on a filter match
      [...allPeople].forEach(node=>{
        //console.log("node: ", node, "name", node.getAttribute('data_name'))
        if (node.getAttribute('data_name').toLowerCase().includes(filterText)) {
          node.style.display = ''
        } else {
          node.style.display = 'none'
        }      
      });
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
      //console.log("list all the People  - allPeople", allPeople);
      const peopleContainer = allPeople[0].parentNode;
      //console.log("list the people container  - peopleContainer", peopleContainer);     

      // create hash: node id => node (person element)
      const peopleElements = {};
      [...allPeople].forEach(node=>{
        //console.log("node: ", node, "name", node.getAttribute('data_name'))
        peopleElements[node.id] = node;
        //console.log("name: ", node.getAttribute('data_name'), node)
      });
      //console.log("peopleElements: ", peopleElements)
      
      // get all the hash keys, then sort them by person
      // name which is held in the tr data attribute
      const ids = Object.keys(peopleElements)
      //console.log("ids: ", ids)
      ids.sort((a,b) => {
        return peopleElements[a].getAttribute('data_name').localeCompare(peopleElements[b].getAttribute('data_name'))
      })
      //console.log("sorted ids: ", ids)

      // repopulate the people container with everyone in correct order
      // nb when appending, the original is removed from the people container.
      ids.forEach(id=>{
        const node = peopleElements[id];
        peopleContainer.append(node);
      });
    };
  }
}
