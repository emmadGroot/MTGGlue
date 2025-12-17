let stickers
let selected = []
let searchPrompt = ""
let cardsHidden = true
let cardCount = 0;
let placedStickerCount = 0
let availableStickers = []

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
    if (selected.length >= 3)
    var buttons = document.getElementById("buttons")
    var done = document.getElementById("done")
    var search = document.getElementById("search")
    buttons.remove()
    done.remove()
    search.remove()

    const arrow = document.createElement("button")
    arrow.innerHTML = ">"
    arrow.style.position = "fixed"
    arrow.style.zIndex = "1000"
    arrow.classList.add("button")
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
                abilityDiv.innerHTML = `<button onclick="addSticker('ability', '${ability.Text}', '${availableStickers.length}')">` + ability.Cost + "</button>" + " - " + ability.Text
                abilityDiv.id = `sticker-${availableStickers.length}`
                const br = document.createElement("br")
                stuff.appendChild(br)
                stuff.appendChild(abilityDiv)
            })
            
            item.Stats.forEach(stat => {
                availableStickers.push(stat.text)
                const statDiv = document.createElement("div")
                statDiv.innerHTML = `<button onclick="addSticker('stat', '${stat.Text}', '${availableStickers.length}')">` + stat.Cost + "</button>" + " - " + stat.Text
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

function addSticker(type, text, stickerID) {
    document.getElementById("stickerlist").querySelector(`#sticker-${stickerID}`).style.color = "gray"
    placedStickerCount++
    if (cardCount == 1) {
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
        const choice = document.getElementById("choice")
        choice.classList.toggle("active")
        const choices = choice.querySelector("#choices")
        const names = getCardNames()
        names.forEach((item, index) => { 
            const button = document.createElement("button")
            button.innerHTML = item
            button.classList.add("choicesButton")
            button.onclick = function () {
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
    const choice = document.getElementById("choice")
    choice.classList.toggle("active")
    choice.querySelector("#choices").innerHTML = ""
}

function removeSticker(id, reset) {
    document.getElementById(`placedSticker-${id}`).remove()
    document.getElementById("stickerlist").querySelector(`#sticker-${reset}`).style.color = "white"
}

doStuff()
addCard()