import React from "react";
import Layout from "./Layout";
import LahanList from "../components/LahanList";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getMe } from "../feature/authSlice";

const Lahan = () => {
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
      <LahanList />
    </Layout>
  );
};

export default Lahan;
