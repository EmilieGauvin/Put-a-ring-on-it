import { useEffect, useMemo, useState } from 'react'
import './App.css'
import Experience from './Experience/Experience'

function App() {

  const [gameReady, setGameReady] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  const experience = useMemo(() => {
    const experience = new Experience
    return experience
  })

  useEffect(() => {
    experience.resources.on('ready', () => {
      setGameReady(true)

    })
  }, [])


  const handleClick = () => {
    if (gameReady === true) setGameStarted(true)
  }

  return (
    <>
      <button className={gameStarted === false ? 'start' : 'start hidden'} style={gameReady === false ? { backgroundColor: 'rgba(132, 0, 255, 0.5)' } : { backgroundColor: 'rgba(132, 0, 255, 0.5)' }}
        onClick={handleClick}>DRAW THE PLANET'S RING BY JUMPING FROM ASTEROID TO ASTEROID<br />
        Swipe/drag to revolve around the asteroid.<br />
        Double click/tap to destroy your asteroid and jump.<br />
        Click/tap around to aim for the next asteroid.
      </button>

      <button className={gameStarted === false ? 'refresh hidden' : 'refresh'}
        onClick={() => window.location.reload()}>reset game</button>
    </>
  )
}

export default App
