// player objects
let player1 = {
    name:'Player 1',
    hand:[
        {code:'',suit:'',value:'',numValue:''},
        {code:'',suit:'',value:'',numValue:''},
        {code:'',suit:'',value:'',numValue:''},
        {code:'',suit:'',value:'',numValue:''},
        {code:'',suit:'',value:'',numValue:''},
    ],
    chips:{
        black100:5,
        green25:10,
        red5:20,
    },
    winningHand:{
        royalFlush:false,
        straightFlush:false,
        fourOfAKind:false,
        fullHouse:false,
        flush:false,
        straight:false,
        threeOfAKind:false,
        twoPair:false,
        pair:false,
    },
    valueCounter:{
        'ACE':0,
        'KING':0,
        'QUEEN':0,
        'JACK':0,
        '10':0,
        '9':0,
        '8':0,
        '7':0,
        '6':0,
        '5':0,
        '4':0,
        '3':0,
        '2':0,
        '1':0,
        'SPADES':0,
        'CLUBS':0,
        'DIAMONDS':0,
        'HEARTS':0,
    },
}
let player2 = {
    name:'Player 2',
    hand:[
        {code:'',suit:'',value:'',numValue:''},
        {code:'',suit:'',value:'',numValue:''},
        {code:'',suit:'',value:'',numValue:''},
        {code:'',suit:'',value:'',numValue:''},
        {code:'',suit:'',value:'',numValue:''},
    ],
    chips:{
        black100:5,
        green25:10,
        red5:20,
    },
    winningHand:{
        royalFlush:false,
        straightFlush:false,
        fourOfAKind:false,
        fullHouse:false,
        flush:false,
        straight:false,
        threeOfAKind:false,
        twoPair:false,
        pair:false,
    },
    valueCounter:{
        'ACE':0,
        'KING':0,
        'QUEEN':0,
        'JACK':0,
        '10':0,
        '9':0,
        '8':0,
        '7':0,
        '6':0,
        '5':0,
        '4':0,
        '3':0,
        '2':0,
        '1':0,
        'SPADES':0,
        'CLUBS':0,
        'DIAMONDS':0,
        'HEARTS':0,
    },
}



// fetch deck id
fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
.then(res => res.json())
.then(data =>{  
    // console.log(data)
    localStorage.setItem('deckID',data.deck_id)     
})
.catch(err =>{
    console.log(`error ${err}`)
}) 

// add card values to hand object array
function addCardsToHandArray(data){
    for (let i = 0;i<5;i++){
        player1.hand[i].code = data.cards[i].code
        player1.hand[i].suit = data.cards[i].suit
        player1.hand[i].value = data.cards[i].value
        player1.hand[i].numValue = addNumValue(data.cards[i].value) 
        player2.hand[i].code = data.cards[i+5].code
        player2.hand[i].suit = data.cards[i+5].suit
        player2.hand[i].value = data.cards[i+5].value
        player2.hand[i].numValue = addNumValue(data.cards[i+5].value)
    }
    function addNumValue(value){
        switch(value){
            case 'JACK':
                return 11
                break;
             case 'QUEEN':
                return 12
                break;
            case 'KING':
                return 13
                break;
            case 'ACE':
                return 14
                break;
            default:
              return +value
        }
    }
}

//update hand values
function updateValues(player){
    player.hand.forEach(x=>{
        player.valueCounter[x.value] += 1
        player.valueCounter[x.suit] +=1
    })
}

//update winning hand
function updateWinHand(player){
    let tenU = player.valueCounter['10']
    let jackU = player.valueCounter['JACK']
    let queenU = player.valueCounter['QUEEN']
    let kingU = player.valueCounter['KING']
    let aceU = player.valueCounter['ACE']
    //check for royal flush
    function checkRoyalFlush(player){
        let spadesArray = player.hand.filter(x=>x.suit==='SPADES'&& (x.value==='ACE' || x.value==='KING' || x.value==='QUEEN' || x.value==='JACK' || x.value==='10'))
        let heartsArray = player.hand.filter(x=>x.suit==='HEARTS'&& (x.value==='ACE' || x.value==='KING' || x.value==='QUEEN' || x.value==='JACK' || x.value==='10'))
        let diamondsArray = player.hand.filter(x=>x.suit==='DIAMONDS'&& (x.value==='ACE' || x.value==='KING' || x.value==='QUEEN' || x.value==='JACK' || x.value==='10'))
        let clubsArray = player.hand.filter(x=>x.suit==='CLUBS' && (x.value==='ACE' || x.value==='KING' || x.value==='QUEEN' || x.value==='JACK' || x.value==='10'))
        if ((tenU>0 && jackU>0 && queenU>0 && kingU>0 && aceU>0) && (spadesArray.length >=5 || diamondsArray.length >=5 || heartsArray.length >=5 || clubsArray.length>=5)){ 
            player.winningHand.royalFlush = true
        }
    }
    //check for straight flush



    checkRoyalFlush(player)
}

// ******Start game and get card data*****

document.querySelector('button').addEventListener('click', deal)

function deal (click){
    fetch(`https://www.deckofcardsapi.com/api/deck/${localStorage.getItem('deckID')}/draw/?count=10`)
    .then(res => res.json())
    .then(data =>{  
        // console.log(data)
        //player 1 cards
        document.querySelector('#p1c1').src = data.cards[0].image
        document.querySelector('#p1c2').src = data.cards[1].image 
        document.querySelector('#p1c3').src = data.cards[2].image 
        document.querySelector('#p1c4').src = data.cards[3].image 
        document.querySelector('#p1c5').src = data.cards[4].image
        //player 2 cards
        document.querySelector('#p2c1').src = data.cards[5].image
        document.querySelector('#p2c2').src = data.cards[6].image 
        document.querySelector('#p2c3').src = data.cards[7].image 
        document.querySelector('#p2c4').src = data.cards[8].image 
        document.querySelector('#p2c5').src = data.cards[9].image

        //add card code to hand in object
        addCardsToHandArray(data)
        updateValues(player1)
        updateValues(player2)
        console.log(player1.hand)
        console.log(player2.hand)

    })
    .catch(err =>{
        console.log(`error ${err}`)
}) 
}

