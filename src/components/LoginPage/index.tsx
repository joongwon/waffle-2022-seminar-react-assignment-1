import styles from "./index.module.css";
import { Form, InputWithLabel } from "../Form";
import { FormEventHandler, useCallback, useState } from "react";
import { useSessionContext } from "../../contexts/SessionContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosErrorHandler } from "../../lib/error";

function useLoginPageLogic() {
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  const { login } = useSessionContext();
  const navigate = useNavigate();
  const onSubmit = useCallback<FormEventHandler>(
    (event) => {
      event.preventDefault();
      login(loginForm.username, loginForm.password)
        .then((res) => {
          if (res.canceled) return;
          toast.success(`${res.payload.username}님 환영합니다!`);
          navigate("/");
        })
        .catch(axiosErrorHandler("로그인할 수 없습니다"));
    },
    [login, loginForm.password, loginForm.username, navigate]
  );
  return { loginForm, setLoginForm, onSubmit };
}

export default function LoginPage() {
  const { loginForm, setLoginForm, onSubmit } = useLoginPageLogic();
  return (
    <div className={styles["container"]}>
      <Form className={styles["form"]} onSubmit={onSubmit}>
        <h2>로그인</h2>
        <div className={styles["form-wrapper"]}>
          <InputWithLabel
            value={loginForm}
            label="ID"
            name="username"
            setValue={setLoginForm}
            required
          />
          <InputWithLabel
            value={loginForm}
            label="PASSWORD"
            name="password"
            setValue={setLoginForm}
            type="password"
            required
          />
          <button className={styles["login-button"]} type="submit">
            로그인
          </button>
        </div>
      </Form>
    </div>
  );
}
