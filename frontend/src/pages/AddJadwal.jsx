import Layout from "./Layout";
import FormAddJadwal from "../components/FormAddJadwal";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getMe } from "../feature/authSlice";

const AddJadwal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) navigate("/jadwal");
  }, [isError, navigate]);

  return (
    <Layout>
      <FormAddJadwal />
    </Layout>
  );
};

export default AddJadwal;
