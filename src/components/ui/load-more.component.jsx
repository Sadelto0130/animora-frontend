const LoadMorePostsBtn = ({ onClick }) => {

  return ( 
    <button
      className='text-[#303336] p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2'
      onClick={onClick}
    >
      Cargar Mas Posts...
    </button>
  )
}

export default LoadMorePostsBtn