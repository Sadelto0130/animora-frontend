import client from "./axios";

export const login = (data) => client.post("/login", data) 

export const logout = () => client.post("/logout");

export const userLoginGoogle = (google_token) => client.post('/google_login_user', {google_token})

export const userRegisterGoogle = (google_token) => client.post("/google_register_user", {google_token})

export const getProfileByUserName = (user_name) => client.get(`/profile/${user_name}`); 