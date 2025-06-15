import React from "react";
import Layout from "./Layout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getMe } from "../feature/authSlice";
import ValidasiAdmin from "../components/ValidasiAdmin";

const ValidasiPenggunaan = () => {
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
      <ValidasiAdmin />
    </Layout>
  );
};

export default ValidasiPenggunaan;
