import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// Variable global para almacenar el mensaje en memoria (para Vercel)
let inMemoryMessage = "¡Bienvenidos al Club! La próxima reunión será a las 11:00 AM. ¡No falten!";
let inMemoryUpdatedAt = new Date().toISOString();

const MESSAGE_FILE = path.join(process.cwd(), 'data', 'message.json');

// Verificar si estamos en Vercel
const isVercel = process.env.VERCEL === '1';

// Asegurar que el directorio data existe (solo para desarrollo local)
const ensureDataDir = () => {
  if (isVercel) return; // No crear directorios en Vercel
  const dataDir = path.dirname(MESSAGE_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Leer el mensaje actual
const getCurrentMessage = (): { message: string; updatedAt: string } => {
  if (isVercel) {
    return { message: inMemoryMessage, updatedAt: inMemoryUpdatedAt };
  }
  
  try {
    ensureDataDir();
    if (fs.existsSync(MESSAGE_FILE)) {
      const data = fs.readFileSync(MESSAGE_FILE, 'utf8');
      const parsed = JSON.parse(data);
      return {
        message: parsed.message || "¡Bienvenidos al Club!",
        updatedAt: parsed.updatedAt || new Date().toISOString()
      };
    }
  } catch (error) {
    console.error('Error reading message file:', error);
  }
  
  return {
    message: "¡Bienvenidos al Club!",
    updatedAt: new Date().toISOString()
  };
};

// Guardar el mensaje
const saveMessage = (message: string): boolean => {
  const now = new Date().toISOString();
  
  if (isVercel) {
    inMemoryMessage = message;
    inMemoryUpdatedAt = now;
    return true;
  }
  
  try {
    ensureDataDir();
    const data = { message, updatedAt: now };
    fs.writeFileSync(MESSAGE_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving message:', error);
    return false;
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Obtener el mensaje actual
    const data = getCurrentMessage();
    res.status(200).json(data);
  } else if (req.method === 'POST') {
    // Actualizar el mensaje
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensaje requerido' });
    }

    if (message.trim().length === 0) {
      return res.status(400).json({ error: 'El mensaje no puede estar vacío' });
    }

    const success = saveMessage(message.trim());
    
    if (success) {
      const data = getCurrentMessage();
      res.status(200).json({ 
        message: 'Mensaje actualizado correctamente',
        data 
      });
    } else {
      res.status(500).json({ error: 'Error al guardar el mensaje' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Método ${req.method} no permitido` });
  }
}
