import client from "./axios";

export const getProfileByUserName = (user_name) => client.get(`/profile/${user_name}`);