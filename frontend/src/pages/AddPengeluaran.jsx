import Layout from "./Layout";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getMe } from "../feature/authSlice";
import FormAddPengeluaran from "../components/FormAddPengeluaran";

const AddPengeluaran = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) navigate("/pengeluaran");
  }, [isError, navigate]);

  return (
    <Layout>
      <FormAddPengeluaran />
    </Layout>
  );
};

export default AddPengeluaran;
