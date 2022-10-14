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
    // testing hands
    player.hand[0].value = '3'
    player.hand[0].suit = 'CLUBS'
    player.hand[0].numValue = 3

    player.hand[1].value = 'ACE'
    player.hand[1].suit = 'CLUBS'
    player.hand[1].numValue = 14

    player.hand[2].value = 'JACK'
    player.hand[2].suit = 'CLUBS'
    player.hand[2].numValue = 11

    player.hand[3].value = '5'
    player.hand[3].suit = 'CLUBS'
    player.hand[3].numValue = 5

    player.hand[4].value = '7'
    player.hand[4].suit = 'CLUBS'
    player.hand[4].numValue = 7

    let sortedHandByValue = player.hand.sort(function(a,b){   // sort for four of a kind
        if (a.numValue > b.numValue) return 1;
        if (a.numValue < b.numValue) return -1;
        if (a.suit < b.suit) return 1;
        if (a.suit> b.suit) return -1;
    }) 
    console.log(sortedHandByValue)
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
    //check for straight flush TESTED: PASS ***BUG: loops reaches undefined when trying to compare the last card to the next card --->> fixed**** 
    function checkStraightFlush(player){
        let consecCount = 0 
        for (let i =0; i<player.hand.length-1; i++){
            if(((player.hand[i].numValue)+1 === player.hand[i+1].numValue) && (player.hand[i].suit === player.hand[i+1].suit)){
                consecCount += 1
            } 
        }
        if((player.hand[player.hand.length-1].numValue === player.hand[player.hand.length-2].numValue-1) && (player.hand[player.hand.length-1].suit === player.hand[player.hand.length-2].suit)){
            consecCount+=1
            }
        if (consecCount >= 4){               // four comparisons covers five cards
            player.winningHand.straightFlush = true
        }
    }
    //check for 4 of a kind  TESTED:PASS
    function checkFourOfAKind(player){
        let fourKindCount = 0
        for (let i=0;i<sortedHandByValue.length-1;i++){
            if((sortedHandByValue[i].value===sortedHandByValue[i+1].value) && (sortedHandByValue[i].suit != sortedHandByValue[i+1].suit)){
                fourKindCount +=1
                if (fourKindCount >=3){                       //three comparisons covers four cards
                    player.winningHand.fourOfAKind = true
                }
            } else{
                fourKindCount = 0
            }
        }
        if((sortedHandByValue[sortedHandByValue.length-1].value === sortedHandByValue[sortedHandByValue.length-2].value) && (sortedHandByValue[sortedHandByValue.length-1].suit != sortedHandByValue[sortedHandByValue.length-2].suit)){
            fourKindCount +=1
        }   
    }
    // check for full house TESTED:PASS
    function checkFullHouse(player){
        let firstTwoKind = false 
        let secondThreeKind = false
        let firstThreeKind = false
        let secondTwoKind = false 
        if((sortedHandByValue[0].value === sortedHandByValue[1].value) && (sortedHandByValue[0].suit != sortedHandByValue[1].suit)){
            firstTwoKind = true
        }
        if((sortedHandByValue[3].value === sortedHandByValue[4].value) && (sortedHandByValue[3].suit != sortedHandByValue[4].suit)){
            secondTwoKind = true
        }
        if(((sortedHandByValue[0].value === sortedHandByValue[1].value) && (sortedHandByValue[1].value === sortedHandByValue[2].value)) && ((sortedHandByValue[0].suit != sortedHandByValue[1].suit) && (sortedHandByValue[1].suit != sortedHandByValue[2].suit))){
            firstThreeKind = true
        }
        if(((sortedHandByValue[2].value === sortedHandByValue[3].value) &&(sortedHandByValue[3].value === sortedHandByValue[4].value)) && ((sortedHandByValue[2].suit != sortedHandByValue[3].suit) && (sortedHandByValue[3].suit != sortedHandByValue[4].suit))){
            secondThreeKind = true
        }
        if ((firstTwoKind == true && secondThreeKind ==true) || (firstThreeKind == true && secondTwoKind == true)){
            player.winningHand.fullHouse = true
        }
    }
    function checkFlush(player){
        if((sortedHandByValue[0].suit === sortedHandByValue[1].suit)&&(sortedHandByValue[1].suit === sortedHandByValue[2].suit)&&(sortedHandByValue[2].suit === sortedHandByValue[3].suit)&&(sortedHandByValue[3].suit === sortedHandByValue[4].suit)){
            player.winningHand.flush = true
        }
    }
    // execute all winning hand functions
    checkRoyalFlush(player)
    checkStraightFlush(player)
    checkFourOfAKind(player)
    checkFullHouse(player)
    checkFlush(player)
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
        updateWinHand(player1)
        updateWinHand(player2)
        console.log(player1)
        console.log(player2)

    })
    .catch(err =>{
        console.log(`error ${err}`)
}) 
}

