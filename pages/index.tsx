import { useState, useEffect } from "react";
import localFont from "next/font/local";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  });
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const targetTime = new Date();
      
      // Configurar para 11:00 AM GMT-6 (hora central)
      targetTime.setHours(11, 0, 0, 0);
      
      // Si ya pasó la hora de hoy, configurar para mañana
      if (now.getHours() >= 11 && now.getMinutes() >= 0) {
        targetTime.setDate(targetTime.getDate() + 1);
      }
      
      const difference = targetTime.getTime() - now.getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        const milliseconds = difference % 1000;
        
        setTimeLeft({ days, hours, minutes, seconds, milliseconds });
      }
    };

    // Calcular tiempo inicial
    calculateTimeLeft();
    
    // Actualizar cada milisegundo para mostrar milisegundos en tiempo real
    const timer = setInterval(calculateTimeLeft, 1);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Obtener el mensaje actual desde localStorage o API
    const fetchMessage = async () => {
      try {
        const response = await fetch('/api/message-v2');
        const data = await response.json();
        setCurrentMessage(data.message || "¡Bienvenidos al Club!");
      } catch (error) {
        console.error('Error fetching message:', error);
        setCurrentMessage("¡Bienvenidos al Club!");
      }
    };

    fetchMessage();
  }, []);

  useEffect(() => {
    // Actualizar la hora actual después de la hidratación
    const updateCurrentTime = () => {
      const timeElement = document.getElementById('current-time');
      if (timeElement) {
        timeElement.textContent = new Date().toLocaleString('es-ES', { 
          timeZone: 'America/Chicago',
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit',
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        });
      }
    };

    // Actualizar inmediatamente
    updateCurrentTime();
    
    // Actualizar cada segundo
    const timeInterval = setInterval(updateCurrentTime, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex flex-col items-center justify-center p-8`}>
      <div className="text-center text-white max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          Reunión del Club
        </h1>
        
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-200">
            Próxima reunión: 11:00 AM (GMT-6)
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-4xl md:text-6xl font-bold text-yellow-400 font-mono">
                {timeLeft.days.toString().padStart(2, '0')}
              </div>
              <div className="text-sm md:text-lg text-gray-300">Días</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-4xl md:text-6xl font-bold text-yellow-400 font-mono">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-sm md:text-lg text-gray-300">Horas</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-4xl md:text-6xl font-bold text-yellow-400 font-mono">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-sm md:text-lg text-gray-300">Minutos</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-4xl md:text-6xl font-bold text-yellow-400 font-mono">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-sm md:text-lg text-gray-300">Segundos</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-2xl md:text-4xl font-bold text-yellow-400 font-mono">
                {timeLeft.milliseconds.toString().padStart(3, '0')}
              </div>
              <div className="text-sm md:text-lg text-gray-300">ms</div>
            </div>
          </div>
        </div>

        {currentMessage && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 max-w-2xl mx-auto">
            <h3 className="text-xl md:text-2xl font-semibold mb-4 text-gray-200">
              Mensaje del Club
            </h3>
            <p className="text-lg md:text-xl text-gray-100 leading-relaxed">
              {currentMessage}
            </p>
          </div>
        )}

        <div className="mt-12 text-sm text-gray-400">
          <p>Hora actual: <span id="current-time">Cargando...</span></p>
        </div>
      </div>
    </div>
  );
}
