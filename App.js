import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { deviceHeight, deviceWidth } from './app/common/dimensions';

const INIT_ARRAY = Array(16).fill(null)

export default function App() {

  const [placements, setPlacements] = useState(INIT_ARRAY)

  const [first, setFirst] = useState(null)
  const [second, setSecond] = useState(null)

  const [attempts, setAttempts] = useState(0)
  const [matches, setMatches] = useState(0)

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

    setPlacements(arr)
    setIsGameWon(false)
  }

  const clearBothFn = () => {
    setFirst(null)
    setSecond(null)
  }

  useEffect(() => {
    initialiseGameFn()
  }, [])


  useEffect(() => {
    if (matchedIndices.length && (matchedIndices.length === placements.length)) setIsGameWon(true)
  }, [matchedIndices])


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
          // blacken the paired cards and make them unavailable for press somehow
        }
        clearBothFn()
      }, 500);
    }
  }, [second])

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
      {/* <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" /> */}

      <Text>{deviceWidth} x {deviceHeight}</Text>

      <Text>First Card Opened: {first?.value}</Text>
      <Text>Second Card Opened: {second?.value}</Text>

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

  const cardPressHandler = () => {
    if (isMatched) return;
    showCardFn(index)
  }

  const textReturner = () => {
    if (isMatched) return <Text style={{color: "lightgrey"}}>Already Matched!</Text>
    else if (toShow) return <Text style={{ fontWeight: "bold" }}>{char}</Text>
    else return <Text style={{ fontStyle: "italic" }}>(hidden)</Text>
  }

  return (
    <Pressable style={styles.card} onPress={cardPressHandler}>
        {textReturner()}
    </Pressable>
  )
}

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
