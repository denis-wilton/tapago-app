import React, { useCallback, useEffect, useReducer, useState } from "react";
import { useAuth } from "../../context/Auth.context";
import { NavLink, useNavigate } from "react-router-dom";

interface State {
  username: string;
  password: string;
  confirmPassword: string;
  role: string;
}

interface Action {
  type: "SET_USERNAME" | "SET_PASSWORD" | "SET_CONFIRM_PASSWORD" | "SET_ROLE";
  payload: string;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_USERNAME":
      return { ...state, username: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    case "SET_CONFIRM_PASSWORD":
      return { ...state, confirmPassword: action.payload };
    case "SET_ROLE":
      return { ...state, role: action.payload };
    default:
      return state;
  }
}

export default function Register() {
  const initialState = {
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
  };

  const [data, dispatch] = useReducer(reducer, initialState);
  const { register, isAuthenticated, error } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect") || "/";
      navigate(redirect);
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = useCallback(async () => {
    if (data.password === data.confirmPassword) {
      setIsLoading(true);
      try {
        await register({
          username: data.username,
          password: data.password,
          role: data.role,
        });
      } catch (e) {
        setLocalError("Registration failed");
      } finally {
        setIsLoading(false);
      }
    } else {
      setLocalError("Passwords do not match");
    }
  }, [data, register]);

  const isButtonDisabled =
    !data.username ||
    !data.password ||
    !data.confirmPassword ||
    !data.role ||
    isLoading;

  return (
    <div className="h-full bg-primary text-primary grid place-items-center">
      <div>
        <div className="py-10 pb-5">
          <h1 className="font-bold text-center">tapago</h1>
          <div className="text-center text-xs scale-90 text-[#ddd]">
            sistema de pagamentos
          </div>
        </div>
        {(error?.trim() || localError) && (
          <div className="text-xs py-2 text-red-500 bg-white px-2 rounded mb-2">
            Erro: {error || localError}
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
          <input
            type="password"
            placeholder="Confirmar Senha"
            className="block mb-2 p-2 border text-secondary bg-secondary border-gray-300 rounded"
            value={data.confirmPassword}
            onChange={(e) =>
              dispatch({
                type: "SET_CONFIRM_PASSWORD",
                payload: e.target.value,
              })
            }
          />
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Role:</label>
            <div className="flex flex-col space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="Gerente financeiro"
                  checked={data.role === "Gerente financeiro"}
                  onChange={(e) =>
                    dispatch({ type: "SET_ROLE", payload: e.target.value })
                  }
                  className="mr-2"
                />
                Gerente financeiro
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="Supervisor"
                  checked={data.role === "Supervisor"}
                  onChange={(e) =>
                    dispatch({ type: "SET_ROLE", payload: e.target.value })
                  }
                  className="mr-2"
                />
                Supervisor
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="Auxiliar"
                  checked={data.role === "Auxiliar"}
                  onChange={(e) =>
                    dispatch({ type: "SET_ROLE", payload: e.target.value })
                  }
                  className="mr-2"
                />
                Auxiliar
              </label>
            </div>
          </div>
        </div>
        <div>
          <button
            className={`block w-full p-2 bg-secondary text-secondary font-bold rounded mb-5 ${
              isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleRegister}
            disabled={isButtonDisabled}
          >
            {isLoading ? "Registrando..." : "Registrar"}
          </button>

          <div className="text-center text-xs">
            <NavLink to="/login" className="text-[#ddd]">
              Já tem uma conta? Entrar
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
