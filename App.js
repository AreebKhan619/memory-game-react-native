import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { deviceHeight, deviceWidth } from './app/common/dimensions';

export default function App() {

  const [placements, setPlacements] = useState(Array(16).fill(null))

  const [first, setFirst] = useState(null)
  const [second, setSecond] = useState(null)

  const [attempts, setAttempts] = useState(0)
  const [matches, setMatches] = useState(0)

  const [matchedIndices, setMatchedIndices] = useState([])

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
    if (second) {
      const doesMatch = (first === second)
      if (doesMatch) setMatches(mat => ++mat)

      setAttempts(att => ++att)

      setTimeout(() => {
        if (first === second) {
          // blacken the paired cards and make them unavailable for press somehow
        }

        clearBoth()
      }, 500);
    }
  }, [second])

  const showCard = (index) => {
    const char = placements[index]
    if (!first) setFirst(char)
    else setSecond(char)
    // setAttempts(att => ++att)
  }

  return (
    <View style={styles.container}>
      {/* <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" /> */}

      <Text>{deviceWidth} x {deviceHeight}</Text>

      <Text>First Card Opened: {first}</Text>
      <Text>Second Card Opened: {second}</Text>

      <View style={styles.gridOutline}>
        {placements.map((el, index) => <Card key={index} index={index} showCard={showCard} char={el} />)}
      </View>

      <Text>Attempts: {attempts}</Text>
      <Text>Matches: {matches}</Text>

    </View>
  );
}


const Card = ({ char, showCard, index }) => {

  const [isPaired, setIsPaired] = useState(false)
  const [visible, setVisible] = useState(false)

  const cardPressHandler = () => {
    setVisible(true)
    showCard(index)
  }

  return (
    <Pressable style={styles.card} onPress={cardPressHandler}>
      {visible ? <Text style={{ fontWeight: "bold" }}>{char}</Text> : <Text>(hidden)</Text>}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
