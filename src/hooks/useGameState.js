import { useState, useCallback } from 'react'
import { characters } from '../data/characters'

/**
 * useGameState
 * Central shared logic for the 4-stage experience.
 *
 * stage:          'landing' | 'intro' | 'selection' | 'story' | 'finale'
 * selectedChar:   The full character object currently in focus (StoryConsole / Finale)
 * collected:      Set of character IDs the player has "witnessed"
 * storyIndex:     Index into characters[] for prev/next navigation in StoryConsole
 */
export function useGameState() {
  const [stage, setStage]             = useState('landing')
  const [selectedChar, setSelectedChar] = useState(null)
  const [collected, setCollected]     = useState(new Set())
  const [storyIndex, setStoryIndex]   = useState(0)
  const [collectedIds, setCollectedIds] = useState([])

  /** Add a character ID to the asset-collection list (no duplicates) */
  const addToCollected = useCallback((id) => {
    setCollectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }, [])

  /** Move to the intro transition video */
  const goToIntro = useCallback(() => {
    setStage('intro')
  }, [])

  /** Move to the selection grid */
  const goToSelection = useCallback(() => {
    setStage('selection')
  }, [])

  /** Choose a character from the grid — opens StoryConsole */
  const selectCharacter = useCallback((character) => {
    const idx = characters.findIndex((c) => c.id === character.id)
    setStoryIndex(idx >= 0 ? idx : 0)
    setSelectedChar(character)
    setStage('story')
  }, [])

  /** Mark the current character as collected, then proceed to Finale */
  const collectAndFinish = useCallback(() => {
    if (selectedChar) {
      setCollected((prev) => new Set([...prev, selectedChar.id]))
    }
    setStage('finale')
  }, [selectedChar])

  /** Navigate to the previous character without leaving StoryConsole */
  const prevCharacter = useCallback(() => {
    setStoryIndex((i) => {
      const next = (i - 1 + characters.length) % characters.length
      setSelectedChar(characters[next])
      return next
    })
  }, [])

  /** Navigate to the next character without leaving StoryConsole */
  const nextCharacter = useCallback(() => {
    setStoryIndex((i) => {
      const next = (i + 1) % characters.length
      setSelectedChar(characters[next])
      return next
    })
  }, [])

  /** Return to the selection grid from StoryConsole */
  const backToSelection = useCallback(() => {
    setStage('selection')
  }, [])

  /** Return to the landing screen without resetting progress */
  const goToLanding = useCallback(() => {
    setStage('landing')
  }, [])

  /** Restart from the landing screen */
  const restart = useCallback(() => {
    setStage('landing')
    setSelectedChar(null)
    setCollected(new Set())
    setStoryIndex(0)
    setCollectedIds([])
  }, [])

  return {
    stage,
    selectedChar,
    collected,
    collectedIds,
    storyIndex,
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
  }
}
