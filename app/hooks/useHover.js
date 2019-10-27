import React from "react"

//A custom hook is just a function that we're exporting
//You can use useState in a component OR a custom hook
export default function useHover() {
    //custom hook has state, hovering

    const [hovering, setHovering] = React.useState(false)

    const onMouseOver = () => setHovering(true)

    const onMouseOut = () => setHovering(false)

    //what we eant to return is an array
    // w/ first item being hovering stte
    //second being an object iwth mouseOver and mouseOn property

    return [hovering, { onMouseOver, onMouseOut }]

}