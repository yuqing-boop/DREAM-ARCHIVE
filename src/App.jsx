import { useGameState } from './hooks/useGameState'
import Landing       from './components/stages/Landing'
import IntroVideo    from './components/stages/IntroVideo'
import SelectionGrid from './components/stages/SelectionGrid'
import StoryConsole  from './components/stages/StoryConsole'
import Finale        from './components/stages/Finale'
import GuideStar     from './components/GuideStar'

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
    selectionCount,
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

  let stageEl
  switch (stage) {
    case 'landing':
      stageEl = <Landing onStart={goToIntro} />
      break

    case 'intro':
      stageEl = (
        <IntroVideo
          onComplete={goToSelection}
          onSkip={goToSelection}
          onHome={goToLanding}
        />
      )
      break

    case 'selection':
      stageEl = (
        <SelectionGrid
          onSelect={selectCharacter}
          collected={collected}
          onGoToLanding={goToLanding}
        />
      )
      break

    case 'story':
      stageEl = (
        <StoryConsole
          character={selectedChar}
          onBack={backToSelection}
          onVerdict={collectAndFinish}
          onPrev={prevCharacter}
          onNext={nextCharacter}
          collectedIds={collectedIds}
          onCollect={addToCollected}
          isTutorialActive={selectionCount <= 2}
        />
      )
      break

    case 'finale':
      stageEl = (
        <Finale
          character={selectedChar}
          onBack={backToSelection}
          onRestart={restart}
          collectedIds={collectedIds}
        />
      )
      break

    default:
      stageEl = <Landing onStart={goToIntro} />
  }

  return (
    <>
      {stageEl}
      <GuideStar />
    </>
  )
}
