import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import localFont from "next/font/local";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export default function Mensaje() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Marcar que estamos en el cliente
    setIsClient(true);
    
    // Verificar si ya está autenticado (solo en el cliente)
    if (typeof window !== 'undefined') {
      const authStatus = localStorage.getItem("clubAuth");
      if (authStatus === "true") {
        setIsAuthenticated(true);
        fetchCurrentMessage();
      }
    }
  }, []);

  const fetchCurrentMessage = async () => {
    try {
      const response = await fetch('/api/message');
      const data = await response.json();
      setMessage(data.message || "");
    } catch (error) {
      console.error("Error fetching message:", error);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "rotosaurio1.") {
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem("clubAuth", "true");
      }
      fetchCurrentMessage();
    } else {
      setError("Contraseña incorrecta");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem("clubAuth");
    }
    setMessage("");
    setError("");
    setSuccess("");
  };

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("El mensaje no puede estar vacío");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message.trim() }),
      });

      if (response.ok) {
        setSuccess("Mensaje actualizado correctamente");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError("Error al actualizar el mensaje");
      }
    } catch (error) {
      setError("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar estado de carga mientras se hidrata
  if (!isClient) {
    return (
      <div className={`${geistSans.variable} min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-8`}>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={`${geistSans.variable} min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-8`}>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 max-w-md w-full">
          <h1 className="text-3xl font-bold text-white text-center mb-8">
            Administración del Club
          </h1>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Ingresa la contraseña"
                required
              />
            </div>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3 px-4 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200"
            >
              Acceder
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-gray-300 hover:text-white text-sm underline"
            >
              Volver al contador
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${geistSans.variable} min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-8`}>
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Administración del Club
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
        
        <form onSubmit={handleSubmitMessage} className="space-y-6">
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-2">
              Mensaje del Club
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
              placeholder="Escribe el mensaje que aparecerá en la página principal..."
              rows={6}
              required
            />
          </div>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-green-200 text-sm">
              {success}
            </div>
          )}
          
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3 px-4 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Actualizando..." : "Actualizar Mensaje"}
            </button>
            
            <button
              type="button"
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Ver Página
            </button>
          </div>
        </form>
        
        <div className="mt-8 p-4 bg-white/5 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-200 mb-2">Información:</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• El mensaje se mostrará en la página principal del club</li>
            <li>• Cualquier persona puede ver el mensaje sin contraseña</li>
            <li>• Solo los administradores pueden modificar el mensaje</li>
            <li>• Los cambios se aplican inmediatamente</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
