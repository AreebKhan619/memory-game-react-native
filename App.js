import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { deviceHeight, deviceWidth } from './app/common/dimensions';

export default function App() {

  const [placements, setPlacements] = useState(Array(16).fill(null))

  const [first, setFirst] = useState(null)
  const [second, setSecond] = useState(null)

  const [attempts, setAttempts] = useState(0)
  const [matches, setMatches] = useState(0)

  const [matchedIndices, setMatchedIndices] = useState([])

  const [isGameWon, setIsGameWon] = useState(false)

  const randomlySorted = (arr = placements.slice()) => {
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
    return arr
  }

  const clearBoth = () => {
    setFirst(null)
    setSecond(null)
  }

  useEffect(() => {
    setPlacements(randomlySorted())
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
        clearBoth()
      }, 500);
    }
  }, [second])

  const showCard = (index) => {
    let _selectionObj = {
      index,
      value: placements[index]
    }
    if (!first) setFirst(_selectionObj)
    else setSecond(_selectionObj)
  }

  if (isGameWon) return <SafeAreaView style={styles.container}><Text style={{ fontWeight: "bold" }}>GAME WON!</Text></SafeAreaView>

  return (
    <SafeAreaView style={styles.container}>
      {/* <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" /> */}

      <Text>{deviceWidth} x {deviceHeight}</Text>

      <Text>First Card Opened: {first?.value}</Text>
      <Text>Second Card Opened: {second?.value}</Text>

      <View style={styles.gridOutline}>
        <CardsContainer
          placements={placements}
          showCard={showCard}
          matchedCardIndices={matchedIndices}
        />
      </View>

      <Text>Attempts: {attempts}</Text>
      <Text>Matches: {matches}</Text>

    </SafeAreaView>
  );
}

const CardsContainer = ({ placements, showCard, matchedCardIndices }) => {
  return (
    <>
      {placements.map((el, index) => <Card key={index} index={index} showCard={showCard}
        isMatched={matchedCardIndices.includes(index)}
        char={el} />)}
    </>
  )
}


const Card = ({ char, showCard, index, isMatched }) => {

  const [isPaired, setIsPaired] = useState(false)
  const [visible, setVisible] = useState(false)

  const cardPressHandler = () => {
    if (isMatched) return;
    setVisible(true)
    showCard(index)
  }

  return (
    <Pressable style={styles.card} onPress={cardPressHandler}>
      {visible ? <Text style={{ fontWeight: "bold" }}>{isMatched ? "Already matched!" : char}</Text> : <Text>(hidden)</Text>}
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
