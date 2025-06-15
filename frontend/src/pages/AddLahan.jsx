import Layout from "./Layout";
import FormAddLahan from "../components/FormAddLahan";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getMe } from "../feature/authSlice";

const AddLahan = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) navigate("/lahan");
  }, [isError, navigate]);

  return (
    <Layout>
      <FormAddLahan />
    </Layout>
  );
};

export default AddLahan;
