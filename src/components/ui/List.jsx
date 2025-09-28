import React from 'react'

const List = ({style, items}) => {
  return (
    <ol className={`pl-5 ${ style = "ordered" ? " list-decimal" : " list-disc"}`}>
      {
        items.map((listItem, i) => {
          return <li key={i} className='my-4'
          dangerouslySetInnerHTML={{__html: listItem}}></li>
        })
      }
    </ol>
  )
}

export default List