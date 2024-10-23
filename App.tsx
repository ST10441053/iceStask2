import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

const generateArithmeticProblem = () => {
  const num1 = Math.floor(Math.random() * 100);
  const num2 = Math.floor(Math.random() * 100);
  const operations = ['+', '-', '*'];
  const operation = operations[Math.floor(Math.random() * operations.length)];

  return {
    question: `What is ${num1} ${operation} ${num2}?`,
    answer: eval(`${num1} ${operation} ${num2}`), // Caution: eval is used for simplicity, but it's not safe for production use
  };
};

// Home screen with a star button
const HomeScreen = ({ navigation }: { navigation: any }) => {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <TouchableOpacity style={styles.starButton} onPress={() => navigation.navigate('Training')}>
          <Text style={styles.btnText}>⭐ Start Training</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
  );
};


const TrainingScreen = ({ navigation }: { navigation: any }) => {
  const [problem, setProblem] = useState(generateArithmeticProblem());
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [fadeAnim] = useState(new Animated.Value(0));  // Animation

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigation.navigate('Result', { score });
    }
  }, [timeLeft, navigation, score]);

  const checkAnswer = () => {
    if (parseInt(userAnswer) === problem.answer) {
      setScore(score + 1);
    }
    setProblem(generateArithmeticProblem());
    setUserAnswer('');
    setTimeLeft(10); // Reset timer for each question
  };

  const startTraining = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Text style={styles.problemText}>{problem.question}</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={userAnswer}
          onChangeText={setUserAnswer}
          placeholder="Enter your answer"
        />

        <TouchableOpacity style={styles.btnC} onPress={checkAnswer}>
          <Text style={styles.btnText}>Submit Answer</Text>
        </TouchableOpacity>

        <Text style={styles.btnText}>Time left: {timeLeft}s</Text>
        

        {/* Start Training Animation */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <TouchableOpacity style={styles.btnS} onPress={checkAnswer}>
            <Text style={styles.btnText}>Continue Training</Text>
          </TouchableOpacity>
        </Animated.View>
        <TouchableOpacity style={styles.btnST} onPress={startTraining}>
          <Text style={styles.btnText}>Start Training</Text>
        </TouchableOpacity>
        
      </View>
    </SafeAreaProvider>
  );
};

const ResultScreen = ({ route, navigation }: { route: any, navigation: any }) => {
  const { score } = route.params;

  const getFeedback = () => {
    if (score > 5) return "Great Job!";
    else if (score > 2) return "Good effort!";
    else return "Keep practicing!";
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Text style={styles.resultText}>Final Score: {score}</Text>
        <Text style={styles.resultText}>{getFeedback()}</Text>
        <TouchableOpacity style={styles.btnC} onPress={() => navigation.navigate('Training')}>
          <Text style={styles.btnText}>Start Again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
  );
};
<Stack.Navigator initialRouteName="Home">
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="Training" component={TrainingScreen} />
  <Stack.Screen name="Result" component={ResultScreen} />
</Stack.Navigator>

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Training" component={TrainingScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
  
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7ede2',
    padding: 16,
  },
  problemText: {
    fontSize: 30,
    marginTop: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 75,
    backgroundColor: '#fff',
    elevation: 15,
    fontSize: 30,
    width: '80%',
    textAlign: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  btnC: {
    height: 50,
    borderRadius: 15,
    backgroundColor: '#90e0ef',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  btnS: {
    height: 50,
    borderRadius: 15,
    backgroundColor: '#90e0ef',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  btnST: {
    height: 50,
    borderRadius: 15,
    backgroundColor: '#90e0ef',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  btnText: {
    color: '#000',
    fontSize: 24,
    
  },
  starButton: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: '#ffd700', // Gold color for star button
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
