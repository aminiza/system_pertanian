import { useDispatch, useSelector } from "react-redux";
import FormAddUser from "../components/FormAddUser";
import Layout from "./Layout";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { getMe } from "../feature/authSlice";

const AddUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) navigate("/");
    if(user && user.role !== "Admin") navigate("/dashboard");
  }, [isError, navigate]);
  
  return (
    <Layout>
      <FormAddUser />
    </Layout>
  );
};

export default AddUser;
