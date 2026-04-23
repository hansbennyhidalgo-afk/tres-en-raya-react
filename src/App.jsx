import { useState, useEffect } from "react"


const HUMAN = "❌"
const AI = "⭕"

function App() {
  const [board, setBoard] = useState(() => {
    const saved = localStorage.getItem("board")
    return saved ? JSON.parse(saved) : Array(9).fill(null)
  })

  const [winner, setWinner] = useState(null)

 
  useEffect(() => {
    localStorage.setItem("board", JSON.stringify(board))
  }, [board])

  const checkWinner = (board) => {
    const combos = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ]

    for (const combo of combos) {
      const [a,b,c] = combo
      if (
        board[a] &&
        board[a] === board[b] &&
        board[a] === board[c]
      ) {
        return board[a]
      }
    }

    return null
  }

  
  const getAIMove = (board) => {
    const emptyIndexes = board
      .map((cell, index) => cell === null ? index : null)
      .filter(index => index !== null)

    const randomIndex = Math.floor(Math.random() * emptyIndexes.length)
    return emptyIndexes[randomIndex]
  }

 
  const handleClick = (index) => {
    if (board[index] || winner) return

  
    const newBoard = [...board]
    newBoard[index] = HUMAN
    setBoard(newBoard)

    const newWinner = checkWinner(newBoard)

    if (newWinner) {
      setWinner(newWinner)
      return
    }

    if (!newBoard.includes(null)) {
      setWinner(false)
      return
    }

    
    setTimeout(() => {
      const aiMove = getAIMove(newBoard)
      if (aiMove === undefined) return

      const boardAI = [...newBoard]
      boardAI[aiMove] = AI
      setBoard(boardAI)

      const winnerAI = checkWinner(boardAI)

      if (winnerAI) {
        setWinner(winnerAI)
      } else if (!boardAI.includes(null)) {
        setWinner(false)
      }
    }, 500)
  }

  
  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setWinner(null)
    localStorage.clear()
  }

  return (
    <div style={{
      textAlign: "center",
      minHeight: "100vh",
      background: "linear-gradient(blue, white, red)",
      paddingTop: "20px"
    }}>
      <h1>TRES EN UNO</h1>
      <h2>Aguiluchos🦅 vs Licey🦁</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 100px)",
        gap: "10px",
        justifyContent: "center",
        margin: "20px"
      }}>
        {board.map((value, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            style={{
              width: "100px",
              height: "100px",
              fontSize: "40px",
              cursor: "pointer"
            }}
          >
            {value}
          </button>
        ))}
      </div>

      <button onClick={resetGame} style={{
        padding: "10px 20px",
        fontSize: "16px"
      }}>
        🔄 Reiniciar
      </button>

      {winner !== null && (
        <div style={{ marginTop: "20px" }}>
          <h2>
            {winner === false
              ? "🤝 Empate, se armó el teteo!"
              : winner === HUMAN
                ? "🔥 ¡Ganaste, eres la cabra!"
                : "Licey Campeon 🥳!"
            }
          </h2>
        </div>
      )}
    </div>
  )
}

export default App