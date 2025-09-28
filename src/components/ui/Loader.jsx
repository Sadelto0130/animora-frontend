import {RingLoader} from 'react-spinners'

const Loader = () => {
  return (
    <div className='flex justify-center items-center my-40'>
      <RingLoader
        color="#be74e0"
        cssOverride={{}}
        loading
      />
    </div>
  )
}

export default Loader