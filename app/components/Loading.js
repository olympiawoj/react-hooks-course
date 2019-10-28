import React from 'react'
import PropTypes from 'prop-types'

const styles = {
  content: {
    fontSize: '35px',
    position: 'absolute',
    left: '0',
    right: '0',
    marginTop: '20px',
    textAlign: 'center',
  }
}

export default function Loading({ text = "Loading", speed = 300 }) {
  const [content, setContent] = React.useState(text)
  //intervals will be side effect
  //depends on text & speed bc both coming from props, add to value array
  //set content based on prev so do functional
  React.useEffect(() => {
    const id = window.setInterval(() => {
      setContent((content) => {
        return content === `${text}...` ? text : text + "."
      })
    })
    //function returned from effect will be invoked when component is removed from the dom
    return () => window.clearInterval(id)
  }, [text, speed])

  return (
    <p style={styles.content}>
      {content}
    </p>
  )
}


Loading.propTypes = {
  text: PropTypes.string,
  speed: PropTypes.number
}

