let stickers
let selected = []
let searchPrompt = ""
let cardsHidden = true
let cardCount = 0;
let placedStickerCount = 0
let availableStickers = []
let tickets = 0
let usingTickets = true

const search = document.getElementById("search")

search.addEventListener('input', (event) => {
    searchPrompt = event.target.value
    doStuff()
})

async function fetchStickers() {
    const response = await fetch('./stickers.json')
        .then(response => {
            return response.json()
        })
        .then(data => {
            stickers = data
        })
    return response
}

function getTickets(value) {
    tickets += value
    document.getElementById("ticketCounter").innerHTML = tickets
}

function toggleSticker(id) {
    var index = selected.indexOf(id)
    if (index !== -1) {
        selected.splice(index, 1)
    }
    else {
        selected.push(id)
    }
}

async function doStuff() {
    await fetchStickers()
    var buttons = document.getElementById("buttons")
    buttons.innerHTML = ""
    
    stickers.data.forEach(item => {
        if ((item.Name.toLowerCase()).includes(searchPrompt.toLowerCase())) {
            const checkbox = document.createElement("input")
            checkbox.type = "checkbox"
            checkbox.id = item.Name
            checkbox.addEventListener("change", function () {
                toggleSticker(this.id)
            })
            if (selected.indexOf(checkbox.id) >= 0) checkbox.checked = true
            const label = document.createElement("label")
            label.htmlFor = checkbox.id
            label.textContent = item.Name
            const br = document.createElement("br")
            buttons.appendChild(checkbox)
            buttons.appendChild(label)
            buttons.appendChild(br)
        }
    })
}

function done() {
    if (selected.length < 3) return
    usingTickets = document.getElementById("useTickets").checked
    document.getElementById("toRemove").remove()

    const arrow = document.createElement("button")
    arrow.innerHTML = ">"
    arrow.style.position = "fixed"
    arrow.style.zIndex = "1000"
    arrow.onclick = function () {
        const cards = document.getElementById("cards")
        if (cardsHidden) {
            arrow.innerHTML = "<"
        }
        else {
            arrow.innerHTML = ">"
        }
        cards.classList.toggle("active")
        cardsHidden = !cardsHidden
    }
    document.body.appendChild(arrow)

    if (usingTickets) {
        const template = document.getElementById("ticketTemplate");
        const clone = template.content.cloneNode(true);
        document.body.appendChild(clone)
    }
    

    const shuffled = selected.sort(() => 0.5 - Math.random());
    let chosen = shuffled.slice(0, 3);
    const stuff = document.createElement("div")
    stuff.style.paddingLeft = "26px"
    stuff.id = "stickerlist"

    stickers.data.forEach(item => { 
        if (chosen.includes(item.Name)) {
            const nameDiv = document.createElement("div")
            nameDiv.innerHTML = item.Name
            stuff.appendChild(nameDiv)
            item.Abilities.forEach(ability => {
                availableStickers.push(ability.text)
                const abilityDiv = document.createElement("div")
                abilityDiv.innerHTML = `<button onclick="addSticker('ability', '${ability.Text}', '${availableStickers.length}', '${ability.Cost}')">` + ability.Cost + "</button>" + " - " + ability.Text
                abilityDiv.id = `sticker-${availableStickers.length}`
                const br = document.createElement("br")
                stuff.appendChild(br)
                stuff.appendChild(abilityDiv)
            })
            
            item.Stats.forEach(stat => {
                availableStickers.push(stat.text)
                const statDiv = document.createElement("div")
                statDiv.innerHTML = `<button onclick="addSticker('stat', '${stat.Text}', '${availableStickers.length}', '${stat.Cost}')">` + stat.Cost + "</button>" + " - " + stat.Text
                statDiv.id = `sticker-${availableStickers.length}`
                const br = document.createElement("br")
                stuff.appendChild(br)
                stuff.appendChild(statDiv)
                
            })
            const middle = document.createElement("div")
            middle.innerHTML = "▂▂▂▂▂▂▂▂▂▂"
            stuff.appendChild(middle)
            const br = document.createElement("br")
            stuff.appendChild(br)
        }
    })

    document.body.appendChild(stuff)
}

function addSticker(type, text, stickerID, ticketCost) {
    if (tickets < ticketCost && usingTickets) return
    document.getElementById(`sticker-${stickerID}`).style.color = "gray"
    placedStickerCount++
    if (cardCount == 1) {
        if (usingTickets) getTickets(-ticketCost)
        const card = document.getElementById("card-1")
        if (type == "ability") {
            const ability = card.querySelector(".abilities")
            ability.innerHTML += `<div id="placedSticker-${placedStickerCount}" onclick="removeSticker('${placedStickerCount}', '${stickerID}')">` + text + "<br><br></div>"
        }
        else {
            const stat = card.querySelector(".stat")
            stat.innerHTML = `<div id="placedSticker-${placedStickerCount}" onclick="removeSticker('${placedStickerCount}', '${stickerID}')">` + text + "</div>"
        }
    }
    else {
        const choiceMenu = document.getElementById("choiceMenu")
        choiceMenu.classList.toggle("active")
        const choices = document.getElementById("choices")
        const names = getCardNames()
        names.forEach((item, index) => { 
            const button = document.createElement("button")
            button.innerHTML = item
            button.classList.add("choicesButton")
            button.onclick = function () {
                if (usingTickets) getTickets(-ticketCost)
                const card = document.getElementById(`card-${index + 1}`)
                if (type == "ability") {
                    const ability = card.querySelector(".abilities")
                    ability.innerHTML += `<div id="placedSticker-${placedStickerCount}" onclick="removeSticker('${placedStickerCount}', '${stickerID}')">` + text + "<br><br></div>"
                }
                else {
                    const stat = card.querySelector(".stat")
                    stat.innerHTML = `<div id="placedSticker-${placedStickerCount}" onclick="removeSticker('${placedStickerCount}', '${stickerID}')">` + text + "</div>"
                }
                cancel()
            }
            choices.appendChild(button)
            const br = document.createElement("br")
            choices.appendChild(br)
        })
    }
}

function addCard() {
    const container = document.getElementById("container");
    const template = document.getElementById("cardTemplate");

    const clone = template.content.cloneNode(true);
    const cardContainer = clone.querySelector(".cardContainer");
    cardCount++;
    cardContainer.id = `card-${cardCount}`;
    cardContainer.querySelector(".card").querySelector(".cardName").value = `Card ${cardCount}`

    container.appendChild(clone);
}

function getCardNames() {
    const names = []
    for (let i = 1; i <= cardCount; i++) {
        const card = document.getElementById(`card-${i}`)
        const text = card.querySelector(".cardName").value
        names.push(text)
    }
    console.log(names)
    return names
}

function cancel() {
    const choice = document.getElementById("choiceMenu")
    choice.classList.toggle("active")
    document.getElementById("choices").innerHTML = ""
}

function removeSticker(id, reset) {
    document.getElementById(`placedSticker-${id}`).remove()
    document.getElementById(`sticker-${reset}`).style.color = "white"
}

function importStickers() {
    selected = []
    var buttons = document.getElementById("buttons")
    var importButton = document.getElementById("import")
    var search = document.getElementById("search")
    buttons.remove()
    search.remove()
    importButton.remove()

    var doneButton = document.getElementById("done")
    doneButton.onclick = function () {
        const textarea = document.getElementById('stickerInput')
        const split = textarea.value.split('\n')
        const valid = []
        split.forEach(item => { 
            stickers.data.forEach(sticker => { 
                if (item == sticker.Name) valid.push(item)
            })
        })
        if (valid.length >= 3) {
            selected = valid
            done()
        }
        else return
    }
    const br = document.createElement("br")
    const textField = document.createElement("textarea")
    textField.id = "stickerInput"
    textField.placeholder = "Enter a list of stickers..."
    textField.style.marginTop = "4px"
    textField.style.width = "80%"
    textField.style.height = "200px"

    const toRemove = document.getElementById("toRemove")

    toRemove.appendChild(br)
    toRemove.appendChild(textField)
}

doStuff()
addCard()