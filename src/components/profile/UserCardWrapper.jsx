import { useEffect, useState } from "react";
import Loader from "../ui/Loader";
import NoDataMessage from "../ui/nodata.component";
import { useBlog } from "../../context/BlogContext";
import AnimationWrapper from "../../common/page-animation";
import UserCard from "./usercard.component";

const UserCardWrapper = ({query}) => {
  const { getUsersBySearch } = useBlog();
  const [users, setUsers] = useState([]);
  const [offset, setOffset] = useState(0);
  const [load, setLoad] = useState(false);
  let [usersToShow, setUsersToShow] = useState(20);
  const limit = 10;

  const loadMoreUsers = async () => {
    const newOffset = offset + limit;

    await getUsersBySearch(limit, newOffset, query);
    setOffset(newOffset); 
  };

  useEffect(() => {
    const fetchSearchUsers = async () => {
      try {
        setLoad(true);
        const result = await getUsersBySearch(limit, offset, query);

        if (result === undefined || result.length === 0) {
          setUsers([]);
          setLoad(false);
          return;
        }
        setLoad(false);
        setUsers(result);
      } catch (error) {
        console.error("Error al buscar usuarios:", error);
      }
    };
    fetchSearchUsers();
  }, [query]);

  return (
    <>
      {
        load === true ? 
          (
            <Loader />
          ) 
        : users.length === 0 ? 
          (
            <NoDataMessage message={"Usuarios no encontrados"} />
          ) 
        :
          (
            users.slice(0, usersToShow).map((user, i) => {
              return (
                <AnimationWrapper key={i} transition={{duration: 1, delay: i * 0.1}}>
                  <UserCard users={user} />
                </AnimationWrapper>
                )
            })
          ) 
      }

      {
        users.length < 5 ? "" 
        : users.length <= usersToShow ?
          <p className='text-[#303336] p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2'>
            No hay más usuarios...
            <a href="#inicio">
              Volver al inicio
              <i className="fi fi-sr-up text-[#303336]"></i>
            </a>
          </p>
        : <LoadMorePostsBtn setUsersToShow={setUsersToShow} />
      }
    </>
  );
};

export default UserCardWrapper;
