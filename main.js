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
    // player.hand[0].value = 'ACE'
    // player.hand[0].suit = 'CLUBS'
    // player.hand[0].numValue = 14

    // player.hand[1].value = 'KING'
    // player.hand[1].suit = 'CLUBS'
    // player.hand[1].numValue = 13

    // player.hand[2].value = 'QUEEN'
    // player.hand[2].suit = 'CLUBS'
    // player.hand[2].numValue = 12

    // player.hand[3].value = 'JACK'
    // player.hand[3].suit = 'CLUBS'
    // player.hand[3].numValue = 11

    // player.hand[4].value = '10'
    // player.hand[4].suit = 'HEARTS'
    // player.hand[4].numValue = 10

    let sortedHandByValue = player.hand.sort(function(a,b){   
        if (a.numValue > b.numValue) return 1;
        if (a.numValue < b.numValue) return -1;
        if (a.suit < b.suit) return 1;
        if (a.suit> b.suit) return -1;
    }) 
    console.log(sortedHandByValue)
    //check for royal flush
    function checkRoyalFlush(player){ //TESTED: PASS
        let royalCount = 0
        for(let i=sortedHandByValue.length-1;i>0;i--){
            if ((sortedHandByValue[i].numValue === (10+i))&&(sortedHandByValue[i].suit===sortedHandByValue[i-1].suit)){
                royalCount +=1
               }
        }
        if (royalCount >= 4){
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
    function checkFlush(player){ // TESTED: PASS
        if((sortedHandByValue[0].suit === sortedHandByValue[1].suit)&&(sortedHandByValue[1].suit === sortedHandByValue[2].suit)&&(sortedHandByValue[2].suit === sortedHandByValue[3].suit)&&(sortedHandByValue[3].suit === sortedHandByValue[4].suit)){
            player.winningHand.flush = true
        }
    }
    function checkStraight(player){ // TESTED: PASS
            let straightCount = 0
        for (let i=0;i<sortedHandByValue.length-1;i++){
            if((sortedHandByValue[i].numValue+1 === sortedHandByValue[i+1].numValue)){
                straightCount +=1
            } else{
                straightCount = 0
            }
        }
        if((sortedHandByValue[sortedHandByValue.length-1].numValue === sortedHandByValue[sortedHandByValue.length-2].numValue+1)){
            straightCount +=1
        }   
        if (straightCount >=4){                       //four comparisons covers five cards
            player.winningHand.straight = true
        }
    }
    function checkThreeOfAKind(player){ // TESTED:PASS
        let threeKindCount = 0
        // if((sortedHandByValue[sortedHandByValue.length-1].value === sortedHandByValue[sortedHandByValue.length-2].value)){
        //     threeKindCount +=1 // this segment of code is not needed - double counts values
        // } 
        for (let i=0;i<sortedHandByValue.length-1;i++){
            if((sortedHandByValue[i].value===sortedHandByValue[i+1].value)){
                threeKindCount +=1 
            if (threeKindCount >=2){                       //two comparisons covers three cards
                player.winningHand.threeOfAKind = true
                }  
            } else{
                threeKindCount = 0
            }
        }
    }
    function checkTwoPair(player){ // TESTED: PASS
        let pairCount = 0
        for (let i=0;i<sortedHandByValue.length-1;i++){
            if((sortedHandByValue[i].numValue === sortedHandByValue[i+1].numValue)){
                pairCount +=1
                i+=1
            } else{
                pairCount += 0
            }
        }
        // if((sortedHandByValue[sortedHandByValue.length-1].numValue === sortedHandByValue[sortedHandByValue.length-2].numValue)){
        //     pairCount +=1  // This segment of codes is not needed - double counts last card
        // }   
        if (pairCount >=2){                  
            player.winningHand.twoPair = true
        }
    }
    function checkPair(player){ // TESTED: PASS
        let pairCount = 0
        for (let i=0;i<sortedHandByValue.length-1;i++){
            if((sortedHandByValue[i].numValue === sortedHandByValue[i+1].numValue)){
                pairCount +=1
                i+=1
            } else{
                pairCount += 0
            }
        }  
        if (pairCount >=1){                  
            player.winningHand.pair = true
        }
    }
    function checkHighCard(player){ // TESTED: PASS
        player.winningHand.highCard = sortedHandByValue[sortedHandByValue.length-1].numValue
    }
    // execute all winning hand functions
    checkRoyalFlush(player)
    checkStraightFlush(player)
    checkFourOfAKind(player)
    checkFullHouse(player)
    checkFlush(player)
    checkStraight(player)
    checkThreeOfAKind(player)
    checkTwoPair(player)
    checkPair(player)
    checkHighCard(player)
}

function checkWinner(){  // BUG: cannot handle ties
    let player1Win = false
    let player2Win = false
    if(player1.winningHand.royalFlush === true && player1.winningHand.royalFlush ===false){
        player1Win = true
    }else if(player2.winningHand.royalFlush === true && player2.winningHand.royalFlush ===false){
        player2Win = true
    }else if(player1.winningHand.straightFlush === true && player1.winningHand.straightFlush ===false){
        player1Win = true
    }else if(player2.winningHand.straightFlush === true && player1.winningHand.straightFlush ===false){
        player2Win = true
    }else if(player1.winningHand.fourOfAKind === true && player2.winningHand.fourOfAKind ===false){
        player1Win = true
    } else if(player2.winningHand.fourOfAKind === true && player1.winningHand.fourOfAKind ===false){
        player2Win = true
    } else if(player1.winningHand.fullHouse === true && player2.winningHand.fullHouse ===false){
        player1Win = true
    } else if(player2.winningHand.fullHouse === true && player1.winningHand.fullHouse ===false){
        player2Win = true
    } else if(player1.winningHand.flush === true && player2.winningHand.flush ===false){
        player1Win = true
    } else if(player2.winningHand.flush === true && player1.winningHand.flush ===false){
        player2Win = true
    } else if(player1.winningHand.straight === true && player2.winningHand.straight ===false){
        player1Win = true
    } else if(player2.winningHand.straight === true && player1.winningHand.straight ===false){
        player2Win = true
    } else if(player1.winningHand.threeOfAKind === true && player2.winningHand.threeOfAKind ===false){
        player1Win = true
    } else if(player2.winningHand.threeOfAKind === true && player1.winningHand.threeOfAKind ===false){
        player2Win = true
    } else if(player1.winningHand.twoPair === true && player2.winningHand.twoPair ===false){
        player1Win = true
    } else if(player2.winningHand.twoPair === true && player1.winningHand.twoPair ===false){
        player2Win = true
    } else if(player1.winningHand.pair === true && player2.winningHand.pair ===false){
        player1Win = true
    } else if(player2.winningHand.pair === true && player1.winningHand.pair ===false){
        player2Win = true
    } else if(player1.winningHand.highCard > player2.winningHand.highCard){
        player1Win = true
    } else{
        player2Win = true
    }
    if (player1Win === true){
        alert('player1 wins!')
    } else{
        alert('player2 wins!')
    }
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
        checkWinner()
        console.log(player1)
        console.log(player2)

    })
    .catch(err =>{
        console.log(`error ${err}`)
}) 
}

