import { Link } from "react-router-dom"


const UserCard = ({users}) => {
  const {avatar_url, email, last_name, name, user_name, user_id} = users

  return (
    <Link to={`/user_profile/${user_name}`} className="flex gap-5 items-center mb-8">
      <img src={avatar_url?.replace(/;/g, "")} className="w-14 h-14 rounded-full"/>

      <div>
        <h1 className="font-medium text-xl line-clamp-2">{name} {last_name}</h1>
        <p className="text-dark-grey">@{user_name}</p>
      </div>
    </Link>
  )
}

export default UserCard 