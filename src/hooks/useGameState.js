import { useState, useCallback } from 'react'
import { characters } from '../data/characters'

/**
 * useGameState
 * Central shared logic for the 4-stage experience.
 *
 * stage:          'landing' | 'selection' | 'story' | 'finale'
 * selectedChar:   The full character object currently in focus (StoryConsole / Finale)
 * collected:      Set of character IDs the player has "witnessed"
 * storyIndex:     Index into characters[] for prev/next navigation in StoryConsole
 */
export function useGameState() {
  const [stage, setStage]             = useState('landing')
  const [selectedChar, setSelectedChar] = useState(null)
  const [collected, setCollected]     = useState(new Set())
  const [storyIndex, setStoryIndex]   = useState(0)

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

  /** Restart from the landing screen */
  const restart = useCallback(() => {
    setStage('landing')
    setSelectedChar(null)
    setCollected(new Set())
    setStoryIndex(0)
  }, [])

  return {
    stage,
    selectedChar,
    collected,
    storyIndex,
    goToSelection,
    selectCharacter,
    collectAndFinish,
    prevCharacter,
    nextCharacter,
    backToSelection,
    restart,
  }
}
