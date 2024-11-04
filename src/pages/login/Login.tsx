import React, { useCallback, useEffect, useReducer, useState } from "react";
import { useAuth } from "../../context/Auth.context";
import { NavLink, useNavigate } from "react-router-dom";

interface State {
  username: string;
  password: string;
}

interface Action {
  type: "SET_USERNAME" | "SET_PASSWORD";
  payload: string;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_USERNAME":
      return { ...state, username: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    default:
      return state;
  }
}

export default function Login() {
  const initialState = {
    username: "",
    password: "",
  };

  const [data, dispatch] = useReducer(reducer, initialState);
  const { login, isAuthenticated, error } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect") || "/";
      navigate(redirect);
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = useCallback(async () => {
    setLoading(true);
    try {
      await login({
        username: data.username,
        password: data.password,
      });
    } finally {
      setLoading(false);
    }
  }, [data, login]);

  const isButtonDisabled = !data.username || !data.password || loading;

  return (
    <div className="h-full bg-primary text-primary grid place-items-center">
      <div>
        <div className="py-10">
          <h1 className="font-bold text-center">tapago</h1>
          <div className="text-center text-xs scale-90 text-[#ddd]">
            sistema de pagamentos
          </div>
        </div>
        {error?.trim() && (
          <div className="text-xs py-2 text-red-500 bg-white px-2 rounded mb-2">
            Erro: {error}
          </div>
        )}
        <div>
          <input
            type="text"
            placeholder="Usuário"
            className="block mb-2 p-2 border text-secondary bg-secondary border-gray-300 rounded"
            value={data.username}
            onChange={(e) =>
              dispatch({ type: "SET_USERNAME", payload: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Senha"
            className="block mb-2 p-2 border text-secondary bg-secondary border-gray-300 rounded"
            value={data.password}
            onChange={(e) =>
              dispatch({ type: "SET_PASSWORD", payload: e.target.value })
            }
          />
        </div>
        <div>
          <button
            className={`block w-full p-2 bg-secondary text-secondary font-bold rounded mb-5 ${
              isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleLogin}
            disabled={isButtonDisabled}
          >
            {loading ? "Carregando..." : "Entrar"}
          </button>

          <div className="text-center text-xs">
            <NavLink to="/register" className="text-[#ddd]">
              Criar conta
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
