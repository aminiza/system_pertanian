import Layout from "./Layout";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getMe } from "../feature/authSlice";
import FormEditPupuk from "../components/FormEditPupuk";

const EditPupuk = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) navigate("/pupuk");
  }, [isError, navigate]);

  return (
    <Layout>
      <FormEditPupuk />
    </Layout>
  );
};

export default EditPupuk;
