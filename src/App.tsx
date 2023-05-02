import { useCallback, useEffect, useState } from "react";
import words from "./wordList.json";
import { HangmanDrawing } from "./HangManDrawing";
import { HangmanWord } from "./HangManWord";
import { Keyboard } from "./Keyboard";
import "./index.css";

function App() {
  const [wordToGuess, setWordToGuess] = useState(() => {
    return words[Math.floor(Math.random() * words.length)];
  });

  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  const incorrectLetters = guessedLetters.filter(
    (letter) => !wordToGuess.includes(letter)
  );

  const isLoser = incorrectLetters.length >= 6;
  const isWinner = wordToGuess
    .split("")
    .every((letter) => guessedLetters.includes(letter));

  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (guessedLetters.includes(letter) || isLoser || isWinner) return;

      setGuessedLetters((currentLetters) => [...currentLetters, letter]);
    },
    [guessedLetters, isWinner, isLoser]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      if (!key.match(/^[a-z]$/)) return;

      e.preventDefault();
      addGuessedLetter(key);
    };

    document.addEventListener("keypress", handler);

    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, [guessedLetters]);

  function getWord() {
    return words[Math.floor(Math.random() * words.length)];
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      if (key !== "Enter") return;

      e.preventDefault();
      setGuessedLetters([]);
      setWordToGuess(getWord());
    };

    document.addEventListener("keypress", handler);

    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, []);

  return (
    <main className="main" style={{ display: "flex", height: "100vh" }}>
      <aside
        className="aside"
        style={{
          width: "35%",
          background: "red",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 style={{ fontSize: "4rem", marginTop: "-30rem" }}>Hangman</h1>
        <div style={{ fontSize: "2rem", textAlign: "center" }}>
          <p>
            Click the buttons on screen or press the keys on your keyboard to
            guess the correct letters.
          </p>
        </div>
        <div style={{ fontSize: "2rem", textAlign: "center", height: "3rem" }}>
          {isWinner && "You won! Press enter to try again."}
          {isLoser && "Nice try! Press enter to try again."}
        </div>
      </aside>
      <div
        style={{
          minWidth: "873px",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          margin: "auto",
          alignItems: "center",
        }}
      >
        <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
        <HangmanWord
          reveal={isLoser}
          guessedLetters={guessedLetters}
          wordToGuess={wordToGuess}
        />

        <div style={{ alignSelf: "stretch" }}>
          <Keyboard
            disabled={isWinner || isLoser}
            activeLetters={guessedLetters.filter((letter) =>
              wordToGuess.includes(letter)
            )}
            inactiveLetters={incorrectLetters}
            addGuessedLetter={addGuessedLetter}
          />
        </div>
      </div>
    </main>
  );
}

export default App;
