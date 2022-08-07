import render from "../core/render.js";
import List from "./List.js";

export const Item = (props) => {
  const { count } = props

  const handleClick = (props) => {
    props.count = props.count + 1;
    render(List)
  }

  return (
    {
      type: 'li',
      props: {
        children: [
          {
            type: 'button',
            props: {
              textContent: `${count}`,
              onClick: () => {
                handleClick(props)
              },
            }
          }
        ]
      }
    }
  )
}
