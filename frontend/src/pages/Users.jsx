import UserList from "../components/UserList";
import Layout from "./Layout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getMe } from "../feature/authSlice";

const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) navigate("/dashboard");
  }, [isError, navigate]);
  return (
    <Layout>
      <UserList />
    </Layout>
  );
};

export default Users;
