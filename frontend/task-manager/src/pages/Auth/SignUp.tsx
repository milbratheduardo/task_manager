import React, { useState, useContext } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { AxiosError } from 'axios';
import { UserContext } from '../../context/userContext';
import uploadImage from '../../utils/uploadImage';

const SignUp = () => {
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<File | null>(null); // Corrigido aqui
  const [fullName, setFullName] = useState<string>('');
  const [adminInviteToken, setAdminInviteToken] = useState<string>('');

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let profileImageUrl = '';

    if (!fullName) {
      setError('Por favor coloque seu nome completo!');
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor entre com um email válido!');
      return;
    }

    if (!password) {
      setError('Por favor insira uma senha!');
      return;
    }

    setError(null);

    try {
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes || ''; 
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        adminInviteToken,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        updateUser(response.data);

        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/dashboard');
        }
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Algo deu errado. Tente novamente.');
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Cria sua Conta</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Registre-se preenchendo os dados abaixo!
        </p>

        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <Input
            value={fullName}
            onChange={({ target }) => setFullName(target.value)}
            label="Nome Completo"
            placeholder="Eduardo Gonçalves"
            type="text"
          />

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

          <Input
            value={adminInviteToken}
            onChange={({ target }) => setAdminInviteToken(target.value)}
            label="Token de Convite Admin"
            placeholder="6 Dígitos"
            type="text"
          />
          <p className="text-gray-500 text-xs pb-2.5 -mt-5">
            Para se cadastrar como Membro, deixe vazio
          </p>

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button
            type="submit"
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
          >
            Registrar
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Já possui uma conta?{' '}
            <Link className="font-medium text-primary underline" to="/login">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
