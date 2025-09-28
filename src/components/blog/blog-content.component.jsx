import React from 'react'
import Img from '../ui/Img'
import Quote from '../ui/Quote'
import List from '../ui/List'

const BlogContent = ({block}) => {

  let {type, data} = block

  switch (type) {
    case "paragraph":
      return <p dangerouslySetInnerHTML={{__html: data.text}}></p>

    case "header":
      return data.level === 3
        ? <h3 className="text-3xl font-bold" dangerouslySetInnerHTML={{__html: data.text}}></h3>
        : <h2 className="text-4xl font-bold" dangerouslySetInnerHTML={{__html: data.text}}></h2>
    
    case "image":
      return <Img url={data?.file.url} caption={data?.caption} />

    case "quote":
      return <Quote quote={data?.text} caption={data?.caption} />

    case "list":
      return <List style={data.style} items={data.items} />

    default:
      return <h1>esto es un block</h1>
      break;
  }
} 

export default BlogContent