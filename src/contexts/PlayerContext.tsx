import { Children, createContext, ReactNode, useContext } from 'react';
import { useState } from 'react'

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;

};

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
    playNext: () => void;
    playPrevious: () => void;
    setPlayingState: (state: boolean) => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    hasNext: boolean;
    hasPrevious: boolean;
    clearPlayerState: () => void;

};

export const PlayerContext = createContext({} as PlayerContextData)

type PlayerContextProviderProps = {
    children: ReactNode

}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setPlaying] = useState(false)
    const [isLooping, setIsLooping] = useState(false)
    const [isShuffling, setIsShuffling] = useState(false)


    function play(episode: Episode) {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setPlaying(true)
    }

    function playList(list: Episode[], index: number) {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setPlaying(true);

    }

    function togglePlay() {
        setPlaying(!isPlaying)

    }

    function toggleLoop() {
        setIsLooping(!isLooping);

    }
    function toggleShuffle() {
        setIsShuffling(!isShuffling);

    }

    function setPlayingState(state: boolean) {
        setPlaying(state);
    }

    function clearPlayerState() {
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
    }



    const hasPrevious = currentEpisodeIndex > 0
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length

    function playNext() {
        if (isShuffling) {
            const nextRamdomEpisodeIndex = Math.floor(Math.random() * episodeList.length)

            setCurrentEpisodeIndex(nextRamdomEpisodeIndex);

        } else if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        }
    }

    function playPrevious() {
        if (hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
        }
    }



    return (
        <PlayerContext.Provider
            value={{
                episodeList,
                currentEpisodeIndex,
                play,
                playList,
                isPlaying,
                isLooping,
                isShuffling,
                playNext,
                playPrevious,
                togglePlay,
                setPlayingState,
                hasPrevious,
                hasNext,
                toggleLoop,
                toggleShuffle,
                clearPlayerState

            }}>
            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayerContext)
}