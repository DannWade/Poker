
fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
.then(res => res.json())
.then(data =>{  
    console.log(data)
    localStorage.setItem('deckID',data.deck_id)     
})
.catch(err =>{
    console.log(`error ${err}`)
}) 

document.querySelector('button').addEventListener('click', deal)

function deal (click){

    fetch(`https://www.deckofcardsapi.com/api/deck/${localStorage.getItem('deckID')}/draw/?count=2`)
    .then(res => res.json())
    .then(data =>{  
        console.log(data)       
    })
    .catch(err =>{
        console.log(`error ${err}`)
}) 
}