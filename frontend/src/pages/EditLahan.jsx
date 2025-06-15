import React from "react";
import Layout from "./Layout";
import FormEditLahan from "../components/FormEditLahan";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getMe } from "../feature/authSlice";

const EditLahan = () => {
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
        <FormEditLahan />
    </Layout>
  )
}

export default EditLahan
