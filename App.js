import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { deviceHeight, deviceWidth } from './app/common/dimensions';

const INIT_ARRAY = Array(16).fill(null)
const INIT_ATTEMPTS = 0
const INIT_MATCHES = 0

export default function App() {

  const [placements, setPlacements] = useState(INIT_ARRAY)

  const [first, setFirst] = useState(null)
  const [second, setSecond] = useState(null)

  const [attempts, setAttempts] = useState(INIT_ATTEMPTS)
  const [matches, setMatches] = useState(INIT_MATCHES)

  const [matchedIndices, setMatchedIndices] = useState([])

  const [isGameWon, setIsGameWon] = useState(false)

  const initialiseGameFn = (arr = INIT_ARRAY) => {
    let insertedIndices = [] // will keep track of the occupied indices
    let letters = ["A", "B", "C", "D", "E", "F", "G", "H"] // all the possible letters that are to be inserted

    /**
     * will give a number 'n'; 0 <= n < arr.length
     * @returns Number, 
     */
    const getRandomIndex = () => (Math.floor(Math.random() * arr.length))


    // insert each letter twice at some unoccupied space in the array 
    letters.forEach(letter => {
      for (let j = 0; j < 2; j++) {
        let randomIndex = getRandomIndex()
        while (insertedIndices.includes(randomIndex)) {
          randomIndex = getRandomIndex()
        }
        /* console.log(randomIndex) */
        insertedIndices.push(randomIndex)
        arr[randomIndex] = letter
      }
    })


    setPlacements(arr) // set the newly formed array with letters in random indices in the state
    clearBothFn() // clear the selections
    setAttempts(INIT_ATTEMPTS)
    setMatches(INIT_MATCHES) // clear the counters
    setMatchedIndices([])
    setIsGameWon(false) // clear the game won status (for when the user starts the game again after winning)
  }


  /**
   * clears the `first` and `second` selection of cards
   */
  const clearBothFn = () => {
    setFirst(null)
    setSecond(null)
  }


  /**
   * Code to run during the first commit phase
   */
  useEffect(() => {
    initialiseGameFn()
  }, [])


  useEffect(() => {
    if (matchedIndices.length && (matchedIndices.length === placements.length)) setIsGameWon(true)
  }, [matchedIndices])


  /**
   * code for if the card opened is the second one. Will increment the matches and attempts counter.
   * will also check whether or not the two cards match, subject to which their respective indices are stored in a state variable
   * this will help in a card's rendering to decide whether to show "card already matched" or not
   */
  useEffect(() => {
    if (second) {
      const doesMatch = (first.value === second.value)
      if (doesMatch) setMatches(mat => ++mat)
      setAttempts(att => ++att)

      setTimeout(() => {
        if (doesMatch) {
          let _matchedIdx = matchedIndices.slice()
          _matchedIdx.push(first.index, second.index)
          setMatchedIndices(_matchedIdx)
        }
        clearBothFn()
      }, 500);
    }
  }, [second])


  /**
   * When a hidden card is pressed, this function is used to show the card, and it checks whether it's the first card or the second card
   * @param {Number} index - the index of the card in the array, ranges from 0 to a max of 15
   */
  const showCardFn = (index) => {
    let _selectionObj = {
      index,
      value: placements[index]
    }
    if (!first) setFirst(_selectionObj)
    else if (first.index === index) return;
    else setSecond(_selectionObj)
  }


  if (isGameWon) return <SafeAreaView style={styles.container}><Text style={{ fontWeight: "bold" }}>GAME WON!</Text>
    <Pressable onPress={() => initialiseGameFn()}><Text>Play Again</Text></Pressable>
  </SafeAreaView>

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Memory Game</Text>


      {/* <Text>{deviceWidth} x {deviceHeight}</Text> 
      <Text>First Card Opened: {first?.value}</Text>
      <Text>Second Card Opened: {second?.value}</Text> */}

      <View style={styles.gridOutline}>
        <CardsContainer
          openIndices={[first?.index, second?.index]}
          placements={placements}
          showCardFn={showCardFn}
          matchedCardIndices={matchedIndices}
        />
      </View>

      <Text>Attempts: {attempts}</Text>
      <Text>Matches: {matches}</Text>

    </SafeAreaView>
  );
}

const CardsContainer = ({ placements, showCardFn, matchedCardIndices, openIndices }) => {
  return (
    <>
      {placements.map((el, index) =>
        <Card
          key={index}
          index={index}

          toShow={openIndices.includes(index)}

          showCardFn={showCardFn}
          isMatched={matchedCardIndices.includes(index)}
          char={el}
        />)}
    </>
  )
}


const Card = ({ char, showCardFn, index, isMatched, toShow }) => {


  /**
   * Function that runs first on Card-level. If the card is already matched, then nothing should be done, otherwise the parent component's function will handle it (check `showCardFn` above)
   */
  const cardPressHandler = () => {
    if (isMatched) return;
    showCardFn(index)
  }


  /**
   * @returns <Text> component, the content and style of which varies as per the status of the card.
   * If the card has already been matched, then it will show `Already Matched!`
   * If the card is one of the two cards selected to check for a match, then the card will show the character it contains
   * If neither of the above two conditions are met, it means that the card's character is hidden, and it has not been matched yet
   */
  const textReturner = () => {
    if (isMatched) return <Text style={{ color: "lightgrey" }}>Already Matched!</Text>
    else if (toShow) return <Text style={{ fontWeight: "bold" }}>{char}</Text>
    else return <Text style={{ fontStyle: "italic" }}>(hidden)</Text>
  }

  return (
    <Pressable style={styles.card} onPress={cardPressHandler}>
      {textReturner()}
    </Pressable>
  )
}


/**
 * React Native Stylesheets for styling
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e5e5e5',
    // width: 500,
    width: deviceWidth,
    borderWidth: 1,
    margin: 'auto'
  },
  gridOutline: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    paddingHorizontal: 20,
    maxWidth: 600,
    justifyContent: 'space-between'
  },
  card: {
    width: '24%',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: 'white',

    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 100,
    // shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  }
});
