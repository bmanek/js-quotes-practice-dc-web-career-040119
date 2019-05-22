document.addEventListener("DOMContentLoaded", loadPage)
const URL = "http://localhost:3000/quotes"

function loadPage() {
  getQuotes()
  addFormListener()
}

function getQuotes() {
  fetch(URL)
  .then(res => res.json())
  .then(quotes => {
    quotes.forEach(renderQuote)
  })
}

function renderQuote(quote) {

  let li = document.createElement("li")
  li.classList.add("quote-card")

  let block = document.createElement("blockquote")
  block.classList.add("blockquote")
  block.dataset.id = quote.id

  let p = document.createElement("p")
  p.classList.add("mb-0")
  p.innerText = quote.quote

  let footer = document.createElement("footer")
  footer.classList.add("blockquote-footer")
  footer.innerText = quote.author

  let br = document.createElement("br")

  let buttonYay = document.createElement("button")
  buttonYay.innerHTML += `
  <button class='btn-success'>Likes: ${quote.likes}</button>`
  buttonYay.addEventListener("click", increaseLikes)

  let buttonNay = document.createElement("button")
  buttonNay.innerHTML += `
  <button class='btn-danger'>Delete</button>`
  buttonNay.addEventListener("click", deleteQuote)

  // currently this nests buttons inside button tags, instead of just creating
  // buttons. Maybe fix later?

  let ul = document.getElementById("quote-list")

  block.append(p, footer, br, buttonYay, buttonNay)
  li.appendChild(block)
  ul.appendChild(li)

}

function addFormListener() {
  let form = document.getElementById("new-quote-form")
  form.addEventListener("submit", fireForm)
}

function fireForm(e) {
  e.preventDefault()
  let input = document.querySelectorAll("input")

  let quote = input[0].value
  let author = input[1].value
  let likes = 0

  let data = {
    quote: quote,
    author: author,
    likes: 0
  }

  fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(quote => {
    renderQuote(quote)
  })
}

function increaseLikes(e) {
  let likeNum = parseInt(e.target.innerText.split(" ")[1])
  likeNum = ++likeNum
  e.target.innerText = `Likes: ${likeNum}`
  // debugger
  let id = parseInt(e.target.parentElement.parentElement.dataset.id)



  fetch(`${URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({likes: likeNum})

  })
}

function deleteQuote(e) {
  let parent = e.target.parentElement.parentElement.parentElement
  let id = parseInt(e.target.parentElement.parentElement.dataset.id)

  parent.remove()

  fetch(`${URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  })
  .then(res => res.json())
  .then(quote => {
    // debugger
    console.log(`Deleted Quote!`)
  })
}

// BONUS
// Add an edit button to each quote-card that will allow the editing of a quote. (Hint: there is no 'correct' way to do this. You can try creating a hidden form that will only show up when hitting the edit button.)

// Add a sort button on the page that I can toggle on and off that will sort the list of quotes by author name.
