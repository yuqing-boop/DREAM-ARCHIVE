import { useGameState } from './hooks/useGameState'
import Landing       from './components/stages/Landing'
import IntroVideo    from './components/stages/IntroVideo'
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
    collectedIds,
    goToIntro,
    goToSelection,
    goToLanding,
    selectCharacter,
    collectAndFinish,
    addToCollected,
    prevCharacter,
    nextCharacter,
    backToSelection,
    restart,
  } = useGameState()

  switch (stage) {
    case 'landing':
      return <Landing onStart={goToIntro} />

    case 'intro':
      return (
        <IntroVideo
          onComplete={goToSelection}
          onSkip={goToSelection}
          onHome={goToLanding}
        />
      )

    case 'selection':
      return (
        <SelectionGrid
          onSelect={selectCharacter}
          collected={collected}
          onGoToLanding={goToLanding}
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
          collectedIds={collectedIds}
          onCollect={addToCollected}
        />
      )

    case 'finale':
      return (
        <Finale
          character={selectedChar}
          onBack={backToSelection}
          onRestart={restart}
          collectedIds={collectedIds}
        />
      )

    default:
      return <Landing onStart={goToIntro} />
  }
}
