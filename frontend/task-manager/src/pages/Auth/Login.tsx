import React, { useContext, useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input'; 
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { AxiosError } from 'axios';
import { UserContext } from '../../context/userContext';

type Props = {};

const Login = ({}: Props) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!validateEmail(email)) {
      setError("Por favor entre com um email válido!");
      return;
    }
  
    if (!password) {
      setError("Por favor insira uma senha!");
      return;
    }
  
    setError("");
  
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
  
      const { token, role } = response.data;
  
      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
  
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard"); 
        }
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
  
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Algo deu errado. Tente novamente.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Seja Bem Vindo!</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Por favor preencha seus dados e faça Login :)
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email"
            placeholder="eduardo@exemplo.com"
            type="text"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Senha"
            placeholder="Mínimo 8 Caracteres"
            type="password"
          />

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
          
          <button type='submit' className='mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded'>
            Entrar
          </button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Ainda não possui uma conta? {" "}
            <Link className='font-medium text-primary underline' to="/sign-up">Registre-se</Link>

          </p>

        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
