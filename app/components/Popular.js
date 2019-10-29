import React from 'react'
import PropTypes from 'prop-types'
import { fetchPopularRepos } from '../utils/api'
import { FaUser, FaStar, FaCodeBranch, FaExclamationTriangle } from 'react-icons/fa'
import Card from './Card'
import Loading from './Loading'
import Tooltip from './Tooltip'

function LanguagesNav({ selected, onUpdateLanguage }) {
  const languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python']

  return (
    <ul className='flex-center'>
      {languages.map((language) => (
        <li key={language}>
          <button
            className='btn-clear nav-link'
            style={language === selected ? { color: 'rgb(187, 46, 31)' } : null}
            onClick={() => onUpdateLanguage(language)}>
            {language}
          </button>
        </li>
      ))}
    </ul>
  )
}

LanguagesNav.propTypes = {
  selected: PropTypes.string.isRequired,
  onUpdateLanguage: PropTypes.func.isRequired
}

function ReposGrid({ repos }) {
  return (
    <ul className='grid space-around'>
      {repos.map((repo, index) => {
        const { name, owner, html_url, stargazers_count, forks, open_issues } = repo
        const { login, avatar_url } = owner

        return (
          <li key={html_url}>
            <Card
              header={`#${index + 1}`}
              avatar={avatar_url}
              href={html_url}
              name={login}
            >
              <ul className='card-list'>
                <li>
                  <Tooltip text="Github username">
                    <FaUser color='rgb(255, 191, 116)' size={22} />
                    <a href={`https://github.com/${login}`}>
                      {login}
                    </a>
                  </Tooltip>
                </li>
                <li>
                  <FaStar color='rgb(255, 215, 0)' size={22} />
                  {stargazers_count.toLocaleString()} stars
                </li>
                <li>
                  <FaCodeBranch color='rgb(129, 195, 245)' size={22} />
                  {forks.toLocaleString()} forks
                </li>
                <li>
                  <FaExclamationTriangle color='rgb(241, 138, 147)' size={22} />
                  {open_issues.toLocaleString()} open
                </li>
              </ul>
            </Card>
          </li>
        )
      })}
    </ul>
  )
}

ReposGrid.propTypes = {
  repos: PropTypes.array.isRequired
}

function popularReducer(state, action) {
  if (action.type === 'success') {
    return {
      ...state,
      [action.selectedLanguage]: action.repos,
      error: null
    }
  } else if (action.type === 'error') {
    return {
      ...state,
      error: action.error.message,
    }
  } else {
    //if dispatch an action type we're not handling, throw error
    throw new Error("That action type isn't supported")
  }
}

export default function Popular() {
  const [selectedLanguage, setSelectedLanguage] = React.useState("All")

  //repos & error are going to update together, so use useReducer, default value is object with error prop
  //anytime we fetch repos, we're going to stick it on this same object with the error
  const [state, dispatch] = React.useReducer(
    popularReducer, { error: null }
  )
  //keep track of languages fetched without using useRef
  //useRef allows you to add state to your component that won't trigger a re-render and will persist across references, it's reference will never change
  const fetchedLanguages = React.useRef([])

  //fetch popular languages using useEffect, only fetch popular repos if we haven't already
  //fetched popular repos for that specific language
  React.useEffect(() => {
    //if we haven't already fetched selected language, push onto array selected language
    if (fetchedLanguages.current.includes(selectedLanguage) === false) {
      fetchedLanguages.current.push(selectedLanguage)
      //even tho we're modifying current property, object/ref react makes for us wil remain same in memory so won't reinvoke 
      fetchPopularRepos(selectedLanguage)
        .then((repos) => {
          console.log(repos)
          dispatch({ type: "success", selectedLanguage, repos })
        })
        .catch((error) => dispatch({ type: "error", error }))
    }
    //key is ability to manage this 2nd array, repos logic inside of a reducer was helpful, we could just dispatch type of actions that occurred
    //useRef make sure fetchLanguages never changed but we could still keep track of which languages had already fetched
  }, [fetchedLanguages, selectedLanguage])

  const isLoading = () => !state[selectedLanguage] && state.error === null

  return (
    <React.Fragment>
      <LanguagesNav
        selected={selectedLanguage}
        //effect reapplied will take care of itself
        onUpdateLanguage={setSelectedLanguage}
      />

      {isLoading() && <Loading text='Fetching Repos' />}

      {state.error && <p className='center-text error'>{state.error}</p>}

      {state[selectedLanguage] && <ReposGrid repos={state[selectedLanguage]} />}
    </React.Fragment>
  )
}

