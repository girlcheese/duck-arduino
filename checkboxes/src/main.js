// build the interface
// script tag in the body so it's got access to the DOM

const axios = require('axios')

//define initial LED array
let ledArray = []
ledArray.length = 128
ledArray.fill(0, 0, 128) // use the fill method to avoid needing longhand assignment of lots of zeroes
console.log(ledArray)

const rowIds = []
const $controls = document.getElementsByClassName('controls')[0]

$controls.addEventListener('click', e => {
  // event handler on body - need to check if the orginal target of the
  // bubbled event has a value, i.e. is a checkbox
  const val = e.target.value
  if (val) {
    // this line gets all the checked values in one lump
    //const $checked = document.querySelectorAll("input:checked");
    // original code only mutates one item at a time which is cleaner
    // so...
    console.log(e.target, e.target.value, e.target.checked)
    let arrayIndex = parseInt(e.target.value, 10)
    ledArray[arrayIndex] = e.target.checked ? 1 : 0 // ternary short-hand assignment
    if (process.env.NODE_ENV === 'development') {
      console.log(ledArray)
    }
    axios
      .post('/api/led', {
        ledData: ledArray,
      })
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.error(error)
      })
  }
})

for (let n = 0; n < 113; n += 16) {
  rowIds.push(n)
}

const addCheckboxesToRow = ($row, idx) => {
  rowIds.forEach(id => {
    const element = document.createElement('input')
    element.value = id + idx
    element.type = 'checkbox'
    $row.appendChild(element)
  })
}

const createRow = idx => {
  const $row = document.createElement('div')
  $row.className = 'row'
  addCheckboxesToRow($row, idx)
  $controls.appendChild($row)
}

for (let r = 0; r < 16; r++) {
  createRow(r)
}
