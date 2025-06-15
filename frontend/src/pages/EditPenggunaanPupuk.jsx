import Layout from "./Layout";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getMe } from "../feature/authSlice";
import FormEditPenggunaanPupuk from "../components/FormEditPenggunaanPupuk";

const EditPenggunaanPupuk = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) navigate("/penggunaan-pupuk");
  }, [isError, navigate]);

  return (
    <Layout>
      <FormEditPenggunaanPupuk />
    </Layout>
  );
};

export default EditPenggunaanPupuk;
