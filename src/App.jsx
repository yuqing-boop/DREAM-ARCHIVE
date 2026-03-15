import { useGameState } from './hooks/useGameState'
import Landing       from './components/stages/Landing'
import SelectionGrid from './components/stages/SelectionGrid'
import StoryConsole  from './components/stages/StoryConsole'
import Finale        from './components/stages/Finale'

/**
 * App — Central Stage Switcher
 * Owns the shared useGameState and passes the right props to each stage.
 * Stage flow: landing → selection → story → finale
 */
export default function App() {
  const {
    stage,
    selectedChar,
    collected,
    goToSelection,
    selectCharacter,
    collectAndFinish,
    prevCharacter,
    nextCharacter,
    backToSelection,
    restart,
  } = useGameState()

  switch (stage) {
    case 'landing':
      return <Landing onStart={goToSelection} />

    case 'selection':
      return (
        <SelectionGrid
          onSelect={selectCharacter}
          collected={collected}
        />
      )

    case 'story':
      return (
        <StoryConsole
          character={selectedChar}
          onBack={backToSelection}
          onVerdict={collectAndFinish}
          onPrev={prevCharacter}
          onNext={nextCharacter}
        />
      )

    case 'finale':
      return (
        <Finale
          character={selectedChar}
          onBack={backToSelection}
          onRestart={restart}
        />
      )

    default:
      return <Landing onStart={goToSelection} />
  }
}
