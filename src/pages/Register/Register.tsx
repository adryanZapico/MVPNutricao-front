import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const Register: React.FC = () => {
  const { register, isAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // ✅ Novo estado de sucesso

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      await register(name, email, password); // 3 argumentos
      setSuccess(true); // ✅ Registrado com sucesso
      setTimeout(() => {
        // Redireciona para login após 2s
        window.location.href = '/login';
      }, 2000);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err.message || 'Erro ao registrar'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">BaseNutri</h1>
          <p className="text-gray-600">Crie sua conta para começar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Nome"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome completo"
            required
          />

          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
          />

          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            required
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-green-600 text-sm">Registrado com sucesso! Redirecionando...</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isLoading}
            disabled={!name || !email || !password}
          >
            Registrar
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Já tem conta?{' '}
            <Link to="/login" className="text-indigo-600 hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
